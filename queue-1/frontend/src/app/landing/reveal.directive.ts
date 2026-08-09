import { Directive, ElementRef, Input, OnDestroy, OnInit, inject } from '@angular/core';

// Scroll-reveal directive. Adds an 'is-visible' class when the element enters the viewport.
// Defaults to a fade + 16px slide-up. Override the timing with [revealDelay] in ms.
@Directive({
  selector: '[appReveal]',
  standalone: true,
  host: {
    '[class.reveal-hidden]': '!visible',
    '[class.reveal-visible]': 'visible',
    '[style.transition-delay.ms]': 'revealDelay',
  },
})
export class RevealDirective implements OnInit, OnDestroy {
  @Input() revealDelay = 0;
  @Input() revealOnce = true;
  @Input() revealThreshold = 0.15;

  private el = inject(ElementRef<HTMLElement>);
  private observer: IntersectionObserver | null = null;
  visible = false;

  ngOnInit() {
    if (typeof IntersectionObserver === 'undefined') {
      this.visible = true;
      return;
    }
    // Honor prefers-reduced-motion: skip the animation, show content immediately.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      this.visible = true;
      return;
    }
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.visible = true;
            if (this.revealOnce) this.observer?.unobserve(this.el.nativeElement);
          } else if (!this.revealOnce) {
            this.visible = false;
          }
        }
      },
      { threshold: this.revealThreshold, rootMargin: '0px 0px -10% 0px' },
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}