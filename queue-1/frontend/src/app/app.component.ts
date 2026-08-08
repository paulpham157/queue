import { Component } from '@angular/core';
import { LandingPageComponent } from './landing/landing-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LandingPageComponent],
  template: `<app-landing-page />`,
})
export class AppComponent {}