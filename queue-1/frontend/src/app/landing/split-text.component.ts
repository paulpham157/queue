import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface Word {
  text: string;
  highlight?: boolean;
  gradient?: boolean;
}

// Splits text into words and animates them in with a stagger.
// Words containing "highlight" are rendered with stronger weight.
// A contiguous run of words can be marked gradient via [gradientStart]..[gradientEnd].
@Component({
  selector: 'app-split-text',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="inline-flex flex-nowrap gap-x-[0.3em]">
      @for (w of words; track $index) {
        <span
          class="split-word"
          [class.is-in]="started"
          [class.font-semibold]="w.highlight"
          [class.bg-gradient-to-r]="w.gradient"
          [class.from-accent]="w.gradient"
          [class.via-purple-500]="w.gradient"
          [class.to-pink-500]="w.gradient"
          [class.bg-clip-text]="w.gradient"
          [class.text-transparent]="w.gradient"
          [style.transitionDelay.ms]="$index * stagger">
          {{ w.text }}
        </span>
      }
    </span>
  `,
})
export class SplitTextComponent implements OnInit, AfterViewInit {
  @Input() text = '';
  @Input() stagger = 60;
  @Input() gradientStart?: number;
  @Input() gradientEnd?: number;
  @Input() highlightWords: string[] = [];

  started = false;
  words: Word[] = [];

  ngOnInit() {
    this.words = this.text.split(' ').map((raw) => {
      const cleaned = raw.replace(/[.,]/g, '');
      const highlight = this.highlightWords.some((h) => cleaned.toLowerCase().includes(h.toLowerCase()));
      return { text: raw, highlight };
    });
    if (this.gradientStart !== undefined && this.gradientEnd !== undefined) {
      for (let i = this.gradientStart; i <= this.gradientEnd && i < this.words.length; i++) {
        this.words[i].gradient = true;
      }
    }
  }

  ngAfterViewInit() {
    // Slight delay so the initial state (hidden) renders first, then transitions to visible.
    requestAnimationFrame(() => {
      setTimeout(() => (this.started = true), 60);
    });
  }
}