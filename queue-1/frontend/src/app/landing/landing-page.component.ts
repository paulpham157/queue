import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatbotDemoComponent } from './chatbot-demo.component';
import { DataAnalystDemoComponent } from './data-analyst-demo.component';
import { LeadFormComponent } from './lead-form.component';
import { SERVICES, TESTIMONIALS } from '../prototype/shared';

type TabKey = 'workflow' | 'data';

// Landing page — Variant C: Interactive-first. Chatbot demo is the hero,
// other services in tabs, sticky sidebar form.
// See CONTEXT.md for service definitions and ADR 0001 for demo-disclosure rules.
@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, ChatbotDemoComponent, DataAnalystDemoComponent, LeadFormComponent],
  template: `
    <nav class="border-b border-gray-200 bg-white">
      <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div class="font-semibold tracking-tight">Paul 157</div>
        <div class="flex gap-4 text-sm text-gray-600">
          <a href="#services" class="hover:text-gray-900">Other services</a>
          <a href="#testimonials" class="hover:text-gray-900">Customers</a>
          <a href="#contact" class="px-3 py-1.5 bg-accent text-white rounded-md hover:bg-accent-hover">Talk to us</a>
        </div>
      </div>
    </nav>

    <!-- Tiny hero — chat IS the hero -->
    <section class="px-6 pt-12 pb-6 bg-gradient-to-b from-white to-blue-50/40">
      <div class="max-w-3xl mx-auto text-center">
        <h1 class="text-4xl sm:text-5xl font-semibold tracking-tight leading-tight mb-3">
          AI that ships the work, not a demo.
        </h1>
        <p class="text-gray-600">Skip the sales pitch. Ask the agent.</p>
      </div>
    </section>

    <!-- Main grid: chatbot hero + sticky sidebar form -->
    <section class="px-6 pb-16">
      <div class="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <app-chatbot-demo />
        </div>

        <aside id="contact" class="lg:sticky lg:top-20 self-start">
          <app-lead-form />
        </aside>
      </div>
    </section>

    <!-- Other services in tabs -->
    <section id="services" class="px-6 py-16 bg-gray-50 border-y border-gray-200">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-2xl font-semibold tracking-tight text-center mb-8">Or explore our other services</h2>

        <div class="flex justify-center gap-2 mb-8">
          @for (t of tabs; track t.key) {
            <button (click)="activeTab = t.key"
              [class.bg-accent]="activeTab === t.key"
              [class.text-white]="activeTab === t.key"
              [class.bg-white]="activeTab !== t.key"
              class="px-4 py-2 border border-gray-200 rounded-full text-sm font-medium">
              {{ t.label }}
            </button>
          }
        </div>

        <div class="bg-white border border-gray-200 rounded-2xl p-8">
          @for (t of tabs; track t.key) {
            @if (activeTab === t.key) {
              <div class="grid md:grid-cols-2 gap-8 items-start">
                <div>
                  <h3 class="text-2xl font-semibold mb-3">{{ t.service.name }}</h3>
                  <p class="text-gray-600 mb-4">{{ t.service.tagline }}</p>
                  <p class="text-gray-600 mb-4">{{ t.service.detail }}</p>
                  <p class="text-sm text-gray-500">{{ t.service.startingPrice }}</p>
                </div>
                <div>
                  @if (t.key === 'workflow') {
                    <div class="bg-gray-900 rounded-xl p-5 font-mono text-xs text-gray-300">
                      <div class="text-gray-500 mb-3"># Pipeline: incoming_lead</div>
                      <div><span class="text-green-400">form.submit</span> → enrich_email()</div>
                      <div class="ml-4">→ score_lead(openai)</div>
                      <div class="ml-8">→ hubspot.create_contact()</div>
                      <div class="ml-12">→ slack.notify(#sales)</div>
                      <div class="ml-12">→ gmail.send_welcome()</div>
                      <div class="mt-3 text-gray-500"># 1.4s avg · 0.02% error</div>
                    </div>
                  }
                  @if (t.key === 'data') {
                    <app-data-analyst-demo />
                  }
                </div>
              </div>
            }
          }
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section id="testimonials" class="px-6 py-16 bg-white">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-2xl font-semibold tracking-tight text-center mb-8">Customers</h2>
        <div class="grid md:grid-cols-3 gap-4">
          @for (t of testimonials; track t.name) {
            <div class="border border-gray-200 rounded-xl p-5">
              <p class="text-sm text-gray-700 leading-relaxed mb-3">"{{ t.quote }}"</p>
              <p class="text-sm font-semibold">{{ t.name }}</p>
              <p class="text-xs text-gray-500">{{ t.role }} · {{ t.company }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <footer class="border-t border-gray-200 py-8 text-center text-sm text-gray-500">
      Paul 157 · AI services for SMB founders · US · AU · EU
    </footer>
  `,
})
export class LandingPageComponent {
  testimonials = TESTIMONIALS;
  activeTab: TabKey = 'workflow';

  readonly tabs = [
    { key: 'workflow' as const, label: 'Workflow Automation', service: SERVICES[1] },
    { key: 'data' as const, label: 'AI Data Analyst', service: SERVICES[2] },
  ];
}
