import { Component } from '@angular/core';

// Hero product grid — Linear-inspired 6-tile dashboard preview of the AI agent
// mid-work. Static content, sharp-frame pulse dots (steps(1,end)), mono labels.
// Communicates the actual product instead of an abstract gradient.
@Component({
  selector: 'app-hero-product-grid',
  standalone: true,
  template: `
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      @for (t of tiles; track t.label) {
        <div class="bg-white/80 backdrop-blur border border-gray-200 rounded-lg px-4 py-3 shadow-sm text-left">
          <div class="flex items-center gap-2 mb-1">
            <span class="tile-dot w-1.5 h-1.5 rounded-full bg-green-500" [style.animation-delay]="t.delay"></span>
            <span class="font-mono text-[11px] uppercase tracking-wide text-gray-500">{{ t.label }}</span>
          </div>
          <p class="font-mono text-xs text-gray-700 tabular">{{ t.detail }}</p>
        </div>
      }
    </div>
  `,
})
export class HeroProductGridComponent {
  readonly tiles = [
    { label: 'lead received', detail: 'form.submit · 09:41:07', delay: '0ms' },
    { label: 'enriched', detail: 'clearbit · 0.4s', delay: '200ms' },
    { label: 'scored', detail: 'openai · 87/100', delay: '400ms' },
    { label: 'crm updated', detail: 'hubspot · #4821', delay: '600ms' },
    { label: 'welcome sent', detail: 'gmail · 09:41:09', delay: '800ms' },
    { label: 'slack posted', detail: '#sales · 09:41:10', delay: '1000ms' },
  ];
}
