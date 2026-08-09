import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import confetti from 'canvas-confetti';
import { SERVICES } from './shared';

interface Lead {
  name: string;
  email: string;
  company: string;
  service: string;
  message: string;
}

// Real lead form. Submits to /leads (Redis Streams fanout) — same backend as the original demo.
@Component({
  selector: 'app-lead-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h3 class="font-semibold text-lg mb-1">Like the agent?</h3>
      <p class="text-sm text-gray-500 mb-5">Tell us your stack. We reply within one business day.</p>

      <form (ngSubmit)="submit()" class="space-y-3">
        <input [(ngModel)]="lead.name" name="name" required placeholder="Name *"
          class="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10">
        <input [(ngModel)]="lead.email" name="email" type="email" required placeholder="Email *"
          class="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10">
        <input [(ngModel)]="lead.company" name="company" placeholder="Company"
          class="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10">
        <select [(ngModel)]="lead.service" name="service"
          class="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10">
          <option value="">Service of interest</option>
          @for (s of services; track s.key) {
            <option [value]="s.key">{{ s.name }}</option>
          }
        </select>
        <textarea [(ngModel)]="lead.message" name="message" rows="3" placeholder="Your stack + goal"
          class="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 resize-y"></textarea>
        <button type="submit" [disabled]="submitting"
          class="w-full py-3 bg-accent hover:bg-accent-hover disabled:bg-gray-400 text-white font-medium rounded-md transition-colors">
          {{ submitting ? 'Sending…' : 'Send' }}
        </button>
        <p class="text-center text-xs text-gray-500">
          or <a href="https://cal.com/paulpham157/15min" class="text-accent hover:underline">book a 15-min call</a>
        </p>
        @if (result) {
          <div [class.bg-green-100]="result.kind === 'ok'" [class.text-green-800]="result.kind === 'ok'"
               [class.bg-red-100]="result.kind === 'err'" [class.text-red-800]="result.kind === 'err'"
               class="px-3 py-2 rounded-md text-sm">
            {{ result.text }}
          </div>
        }
      </form>
    </div>

    <div class="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-5 text-sm text-gray-700">
      <p class="font-medium text-blue-900 mb-1">Pricing</p>
      <p class="tabular">Agent: from $2.5k + $500/mo</p>
      <p class="tabular">Workflow: from $1.5k/mo</p>
      <p class="tabular">Data: from $3k + $400/mo</p>
    </div>
  `,
})
export class LeadFormComponent {
  services = SERVICES;
  lead: Lead = { name: '', email: '', company: '', service: '', message: '' };
  submitting = false;
  result: { kind: 'ok' | 'err'; text: string } | null = null;

  async submit() {
    if (this.submitting) return;
    this.submitting = true;
    this.result = null;
    const idemKey = (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`).slice(0, 36);
    try {
      const resp = await fetch('/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idemKey },
        body: JSON.stringify({ ...this.lead, source: 'landing' }),
      });
      const body = await resp.json().catch(() => ({}));
      if (resp.ok) {
        this.result = { kind: 'ok', text: `Queued: ${body.id}. I will reply within one business day.` };
        this.lead = { name: '', email: '', company: '', service: '', message: '' };
        this.celebrate();
      } else {
        this.result = { kind: 'err', text: `Error ${resp.status}: ${body.error ?? resp.statusText}` };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.result = { kind: 'err', text: `Network error: ${msg}` };
    } finally {
      this.submitting = false;
    }
  }

  private celebrate() {
    // Subtle, B2B-friendly burst from the form's submit-button position.
    const node = document.querySelector('app-lead-form button[type="submit"]') as HTMLElement | null;
    const rect = node?.getBoundingClientRect();
    const x = rect ? (rect.left + rect.width / 2) / window.innerWidth : 0.5;
    const y = rect ? (rect.top + rect.height / 2) / window.innerHeight : 0.6;
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x, y },
      colors: ['#2563eb', '#8b5cf6', '#ec4899', '#10b981'],
      disableForReducedMotion: true,
      scalar: 0.9,
    });
  }
}
