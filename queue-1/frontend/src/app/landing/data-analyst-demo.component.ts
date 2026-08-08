import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { INSIGHTS } from '../prototype/shared';

interface Insight {
  question: string;
  insight: string;
  chart?: 'bar' | 'line';
}

// Standalone data analyst demo. Sample data + scripted insights — see ADR 0001.
@Component({
  selector: 'app-data-analyst-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="border border-gray-200 rounded-xl p-5">
      <p class="text-xs text-gray-400 uppercase tracking-wide mb-3">Try with sample data</p>

      <div class="flex flex-wrap gap-2 mb-3">
        @for (q of quickQuestions; track q) {
          <button (click)="ask(q)"
            class="text-xs px-3 py-1.5 bg-accent/10 hover:bg-accent/20 text-accent rounded-full">
            {{ q }}
          </button>
        }
      </div>

      <input [(ngModel)]="userInput" (keydown.enter)="ask(userInput); userInput = ''"
        placeholder="Why did revenue drop in Feb?"
        class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm mb-3 focus:outline-none focus:border-accent"/>

      @if (lastInsight(); as li) {
        <div class="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-gray-800">
          {{ li.insight }}
        </div>
        @if (li.chart === 'line') {
          <svg viewBox="0 0 200 60" class="w-full mt-3 text-accent">
            <polyline points="0,40 30,35 60,15 90,45 120,30 150,50 180,40 200,55"
              fill="none" stroke="currentColor" stroke-width="2"/>
          </svg>
        }
        @if (li.chart === 'bar') {
          <div class="flex gap-2 mt-3 items-end h-12">
            <div class="flex-1 bg-accent/40 rounded-t" style="height: 80%"></div>
            <div class="flex-1 bg-accent rounded-t" style="height: 50%"></div>
            <div class="flex-1 bg-accent/60 rounded-t" style="height: 65%"></div>
          </div>
        }
      }

      <p class="text-xs text-gray-400 mt-2">Demo — pre-scripted over sample data.</p>
    </div>
  `,
})
export class DataAnalystDemoComponent {
  userInput = '';
  insights = signal<Insight[]>([]);

  readonly quickQuestions = ['Show revenue trend', 'Compare channels', 'Analyse churn'];

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
