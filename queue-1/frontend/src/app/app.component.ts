import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Lead {
  name: string;
  email: string;
  company: string;
  source: string;
  message: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  lead: Lead = {
    name: '',
    email: '',
    company: '',
    source: 'landing',
    message: '',
  };

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
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idemKey,
        },
        body: JSON.stringify(this.lead),
      });
      const body = await resp.json().catch(() => ({}));
      if (resp.ok) {
        this.result = { kind: 'ok', text: `Queued: ${body.id}` };
        this.lead = { name: '', email: '', company: '', source: 'landing', message: '' };
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
}