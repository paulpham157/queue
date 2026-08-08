import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BOT_REPLIES, BOT_DEFAULT } from './shared';

interface ChatMsg {
  role: 'user' | 'bot';
  text: string;
}

// Standalone chatbot demo. Scripted responses — see docs/adr/0001-fe-demos-scripted-mocks.md.
@Component({
  selector: 'app-chatbot-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
            <svg class="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 8a4 4 0 100 8 4 4 0 000-8z"/>
              <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2"/>
            </svg>
          </div>
          <div>
            <div class="font-medium text-sm">AI Agent demo</div>
            <div class="text-xs text-gray-500">Hybrid agent · chat + action</div>
          </div>
        </div>
        <span class="text-xs text-gray-400">Demo — pre-scripted</span>
      </div>

      <div class="h-[480px] overflow-y-auto p-6 space-y-4">
        @for (m of messages(); track $index) {
          <div [class.text-right]="m.role === 'user'">
            <div [class]="m.role === 'user'
              ? 'inline-block max-w-[75%] bg-accent text-white px-4 py-2.5 rounded-2xl text-sm'
              : 'inline-block max-w-[75%] bg-gray-100 text-gray-900 px-4 py-2.5 rounded-2xl text-sm'">
              {{ m.text }}
            </div>
          </div>
        }
      </div>

      <div class="border-t border-gray-200 p-4 bg-gray-50">
        <div class="flex flex-wrap gap-2 mb-3">
          @for (q of quickQuestions; track q) {
            <button (click)="ask(q)"
              class="text-sm px-4 py-2 bg-white border border-gray-200 hover:border-accent hover:text-accent rounded-full">
              {{ q }}
            </button>
          }
        </div>
        <div class="flex gap-2">
          <input [(ngModel)]="userInput" (keydown.enter)="ask(userInput); userInput = ''"
            placeholder="Ask anything — try 'how does it work?'"
            class="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10">
          <button (click)="ask(userInput); userInput = ''"
            class="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover">
            Send
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ChatbotDemoComponent {
  messages = signal<ChatMsg[]>([
    { role: 'bot', text: 'Hi — I am a demo of the AI Agent. Ask me about pricing, integrations, or book a call.' },
  ]);
  userInput = '';

  readonly quickQuestions = [
    'How much does it cost?',
    'What tools do you integrate?',
    'How long does setup take?',
    'Book a call',
  ];

  ask(input: string) {
    const text = (input || '').trim();
    if (!text) return;
    this.messages.update((m) => [...m, { role: 'user', text }]);
    const found = BOT_REPLIES.find((r) => r.match.test(text));
    const reply = found ? found.reply : BOT_DEFAULT;
    setTimeout(() => {
      this.messages.update((m) => [...m, { role: 'bot', text: reply }]);
    }, 400);
  }
}
