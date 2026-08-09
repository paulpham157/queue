import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { INSIGHTS, SAMPLE_DATA } from './shared';

interface Insight {
  question: string;
  insight: string;
  chart?: 'bar' | 'line';
}

// Standalone data analyst demo. Shows raw data → visualized charts → business insights.
@Component({
  selector: 'app-data-analyst-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white p-5">
      <p class="text-xs text-gray-400 uppercase tracking-wide mb-3">Try with sample data</p>

      <!-- Quick questions -->
      <div class="flex flex-wrap gap-2 mb-4">
        @for (q of quickQuestions; track q) {
          <button (click)="ask(q)"
            class="text-xs px-3 py-1.5 bg-accent/10 hover:bg-accent/20 text-accent rounded-full">
            {{ q }}
          </button>
        }
      </div>

      <!-- Input -->
      <input [(ngModel)]="userInput" (keydown.enter)="ask(userInput); userInput = ''"
        placeholder="Why did revenue drop in Feb?"
        class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm mb-4 focus:outline-none focus:border-accent"/>

      <!-- Results section -->
      @if (lastInsight(); as li) {
        <!-- Step 1: Raw data preview -->
        <div class="mb-4">
          <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Raw data → Transformed</p>
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <div class="bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600 border-b border-gray-200">
              Raw Data (8 rows)
            </div>
            <div class="overflow-x-auto max-h-48 overflow-y-auto">
              <table class="min-w-full text-xs">
                <thead class="bg-gray-100 sticky top-0">
                  <tr>
                    <th class="px-3 py-2 text-left text-gray-600 font-medium">date</th>
                    <th class="px-3 py-2 text-left text-gray-600 font-medium">channel</th>
                    <th class="px-3 py-2 text-right text-gray-600 font-medium">orders</th>
                    <th class="px-3 py-2 text-right text-gray-600 font-medium">revenue</th>
                  </tr>
                </thead>
                <tbody>
                  @for (row of sampleData; track row.date; let i = $index) {
                    <tr [class.bg-blue-50]="i % 2 === 0" class="border-t border-gray-100">
                      <td class="px-3 py-1.5 text-gray-700 font-mono">{{ row.date }}</td>
                      <td class="px-3 py-1.5">
                        <span [class.bg-green-100]="row.channel === 'organic'"
                              [class.bg-blue-100]="row.channel === 'paid'"
                              [class.bg-purple-100]="row.channel === 'referral'"
                              class="px-2 py-0.5 rounded text-[10px] font-medium capitalize"
                              [class.text-green-700]="row.channel === 'organic'"
                              [class.text-blue-700]="row.channel === 'paid'"
                              [class.text-purple-700]="row.channel === 'referral'">
                          {{ row.channel }}
                        </span>
                      </td>
                      <td class="px-3 py-1.5 text-right text-gray-700 tabular">{{ row.orders }}</td>
                      <td class="px-3 py-1.5 text-right text-gray-700 tabular">$ {{ row.revenue | number }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Step 2: Visualization + Insight -->
        <div class="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <p class="text-[10px] font-semibold text-blue-400 uppercase tracking-wider mb-2">Business Insight</p>
          <p class="text-sm text-gray-800 mb-3">{{ li.insight }}</p>

          <!-- Chart visualization -->
          @if (li.chart === 'line') {
            <div class="mt-3">
              <p class="text-[9px] text-gray-400 mb-1">Revenue trend by week</p>
              <svg viewBox="0 0 400 140" class="w-full h-44 text-accent">
                <!-- Grid lines -->
                <line x1="0" y1="110" x2="400" y2="110" stroke="#e5e7eb" stroke-width="1"/>
                <line x1="0" y1="75" x2="400" y2="75" stroke="#e5e7eb" stroke-width="1"/>
                <line x1="0" y1="40" x2="400" y2="40" stroke="#e5e7eb" stroke-width="1"/>
                <line x1="0" y1="10" x2="400" y2="10" stroke="#e5e7eb" stroke-width="1"/>
                <!-- Area fill under line -->
                <polygon points="0,100 0,110 400,110 400,80 342,70 285,75 228,50 171,55 114,20 57,45 0,70"
                  fill="#2563eb" opacity="0.08"/>
                <!-- Data line -->
                <polyline points="0,70 57,45 114,20 171,55 228,40 285,65 342,50 400,70"
                  fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round"/>
                <!-- Data points -->
                @for (d of sampleData; track d.date; let i = $index) {
                  <circle [attr.cx]="i * 57" [attr.cy]="80 - ((d.revenue - 9000) / 140)" r="4" fill="#2563eb"/>
                }
                <!-- Axis labels -->
                @for (d of sampleData; track d.date; let i = $index) {
                  <text [attr.x]="i * 57" y="125" text-anchor="middle" class="text-[7px] fill-gray-400">{{ d.date.slice(5) }}</text>
                }
              </svg>
            </div>
          }
          @if (li.chart === 'bar') {
            <div class="mt-3">
              <p class="text-[9px] text-gray-400 mb-1">Orders by channel</p>
              <div class="flex gap-6 items-end px-4" style="min-height: 160px;">
                @for (c of channels; track c.name) {
                  <div class="flex flex-col items-center" style="min-width: 60px;">
                    <p class="text-[9px] font-semibold text-gray-700 tabular mb-1">{{ c.total }}</p>
                    <div class="w-14 rounded-t transition-all"
                         [style.height.px]="(c.total / maxOrders) * 120"
                         [class.bg-green-500]="c.name === 'organic'"
                         [class.bg-blue-500]="c.name === 'paid'"
                         [class.bg-purple-500]="c.name === 'referral'"></div>
                    <p class="text-[9px] text-gray-500 mt-2 capitalize">{{ c.name }}</p>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }

      <p class="text-xs text-gray-400 mt-3">Demo — pre-scripted over sample data.</p>
    </div>
  `,
})
export class DataAnalystDemoComponent implements OnInit {
  userInput = '';
  insights = signal<Insight[]>([]);

  readonly quickQuestions = ['Show revenue trend', 'Compare channels', 'Analyse churn'];

  // Sample data for display
  sampleData = SAMPLE_DATA;

  // Aggregated channel data for bar chart
  readonly channels = [
    { name: 'organic', total: 530 },
    { name: 'paid', total: 254 },
    { name: 'referral', total: 67 },
  ];
  maxOrders = 530;

  ngOnInit() {
    // Show revenue trend by default
    this.ask('Show revenue trend');
  }

  ask(input: string) {
    const q = (input || '').trim();
    if (!q) return;
    const found = INSIGHTS.find((i) => i.match.test(q));
    const next: Insight = found
      ? { question: q, insight: found.insight, chart: found.chart }
      : { question: q, insight: 'I would need a larger sample and a defined time window to answer that. Try one of the suggestions above.' };
    this.insights.update((arr) => [...arr, next]);
  }

  lastInsight(): Insight | null {
    const arr = this.insights();
    return arr.length ? arr[arr.length - 1] : null;
  }
}
