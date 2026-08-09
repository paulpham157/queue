import { Component, Input, Output, EventEmitter, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Tab {
  key: string;
  label: string;
}

interface Measured {
  left: number;
  width: number;
}

// Sliding-pill tab group. Single underline indicator that slides between tabs.
// Pure transform-based animation; no Angular animations module needed.
@Component({
  selector: 'app-animated-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative inline-flex bg-gray-100 rounded-full p-1">
      @for (t of tabs; track t.key) {
        <button
          #btn
          (click)="select(t.key)"
          [class.text-white]="activeKey === t.key"
          [class.text-gray-700]="activeKey !== t.key"
          class="relative z-10 px-4 py-2 text-sm font-medium rounded-full transition-colors duration-300">
          {{ t.label }}
        </button>
      }
      <span
        class="absolute top-1 bottom-1 z-0 bg-accent rounded-full tab-underline"
        [style.transform]="'translateX(' + indicator.left + 'px)'"
        [style.width.px]="indicator.width"
        [style.left]="0">
      </span>
    </div>
  `,
})
export class AnimatedTabsComponent implements AfterViewInit {
  @Input() tabs: Tab[] = [];
  @Input() activeKey = '';
  @Input() set active(value: string) {
    this.activeKey = value;
    queueMicrotask(() => this.recalc());
  }
  @Output() activeChange = new EventEmitter<string>();

  indicator: Measured = { left: 0, width: 0 };

  @ViewChildren('btn') buttons!: QueryList<ElementRef<HTMLButtonElement>>;

  ngAfterViewInit() {
    // Wait one frame so layout settles.
    setTimeout(() => this.recalc(), 0);
    this.buttons.changes.subscribe(() => this.recalc());
    window.addEventListener('resize', this.recalc);
  }

  select(key: string) {
    this.activeKey = key;
    this.activeChange.emit(key);
    this.recalc();
  }

  recalc = () => {
    if (!this.buttons) return;
    const btns = this.buttons.toArray();
    const idx = this.tabs.findIndex((t) => t.key === this.activeKey);
    if (idx < 0 || !btns[idx]) return;
    const btn = btns[idx].nativeElement;
    const parentLeft = btn.parentElement?.getBoundingClientRect().left ?? 0;
    const r = btn.getBoundingClientRect();
    // Account for the parent's inner padding (p-1 = 4px). Adjust to align the pill inside the rounded container.
    const innerLeft = r.left - parentLeft;
    this.indicator = { left: innerLeft, width: r.width };
  };
}