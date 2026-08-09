import { Component } from '@angular/core';

// Aurora background — multi-blob gradient mesh with slow continuous animation.
// Pure CSS via .aurora-blob / .aurora-blob-2 keyframes defined in styles.css.
@Component({
  selector: 'app-aurora-background',
  standalone: true,
  template: `
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute inset-0 bg-gradient-to-b from-white via-blue-50/30 to-white"></div>
      <div class="aurora-blob absolute -top-32 -left-20 w-[40rem] h-[40rem] bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      <div class="aurora-blob-2 absolute top-20 right-0 w-[36rem] h-[36rem] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      <div class="aurora-blob absolute bottom-0 left-1/3 w-[32rem] h-[32rem] bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
        style="animation-delay: -4s;"></div>
      <!-- Bottom fade: blends aurora into the white content area below. -->
      <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white"></div>
    </div>
  `,
})
export class AuroraBackgroundComponent {}