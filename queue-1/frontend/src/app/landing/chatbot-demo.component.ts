import { Component, signal, ElementRef, ViewChild } from '@angular/core';
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
    <div class="bg-white">
      <!-- header removed — tab bar in the parent card provides the label -->
      <div #chatContainer class="h-[400px] overflow-y-auto p-6 space-y-4 scroll-smooth">
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
  @ViewChild('chatContainer') chatContainer!: ElementRef<HTMLDivElement>;

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
    this.scrollToBottom();
    const found = BOT_REPLIES.find((r) => r.match.test(text));
    const reply = found ? found.reply : BOT_DEFAULT;
    setTimeout(() => {
      this.messages.update((m) => [...m, { role: 'bot', text: reply }]);
      this.scrollToBottom();
    }, 400);
  }

  private scrollToBottom() {
    requestAnimationFrame(() => {
      const el = this.chatContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }
}
