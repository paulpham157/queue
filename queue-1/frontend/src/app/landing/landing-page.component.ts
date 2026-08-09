import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotDemoComponent } from './chatbot-demo.component';
import { DataAnalystDemoComponent } from './data-analyst-demo.component';
import { LeadFormComponent } from './lead-form.component';
import { AuroraBackgroundComponent } from './aurora-background.component';
import { HeroProductGridComponent } from './hero-product-grid.component';
import { SplitTextComponent } from './split-text.component';
import { RevealDirective } from './reveal.directive';
import { SERVICES, TESTIMONIALS } from './shared';

type DemoServiceKey = 'agent' | 'workflow' | 'data';

interface BentoTile {
  key: string;
  name: string;
  line: string;
  cta: string;
  href?: string;
  demoKey?: DemoServiceKey;
}

// A graph node in the network diagram
export interface GraphNode {
  name: string;
  x: number;
  y: number;
  type: 'trigger' | 'process' | 'output' | 'aggregator';
  typeLabel: string;
  label: string;
  tool: string;
  icon: string;
}

// An edge connects two nodes by name
export interface GraphEdge {
  from: string;
  to: string;
}

const NODE_W = 148; // approximate node width in px
const NODE_H = 72;  // approximate node height in px

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ChatbotDemoComponent,
    DataAnalystDemoComponent,
    LeadFormComponent,
    AuroraBackgroundComponent,
    HeroProductGridComponent,
    SplitTextComponent,
    RevealDirective,
  ],
  template: `
    <nav class="border-b bg-white/80 backdrop-blur sticky top-0 z-20 transition-colors motion-reduce:transition-none"
         [class.border-gray-200]="scrolled()"
         [class.border-transparent]="!scrolled()">
      <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <a href="/" class="flex items-center gap-2 text-lg font-bold tracking-tighter text-gray-900">
          <span class="w-2 h-2 rounded-full bg-accent"></span>
          paul 157
        </a>
        <div class="flex items-center gap-1 text-sm font-semibold text-gray-700">
          <a href="#services" class="px-3 py-2 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors motion-reduce:transition-none">Services</a>
          <a href="#testimonials" class="px-3 py-2 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors motion-reduce:transition-none">Customers</a>
          <a href="#contact" class="ml-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-md font-medium transition-colors motion-reduce:transition-none">Talk to us</a>
        </div>
      </div>
    </nav>

    <!-- HERO -->
    <section class="relative overflow-hidden">
      <app-aurora-background />
      <div class="relative max-w-3xl mx-auto px-6 pt-16 pb-6 text-center" appReveal>
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/70 border border-gray-200 rounded-full text-xs text-gray-600 mb-6">
          <span class="w-2 h-2 bg-green-500 rounded-full"></span>
          Built for founders
        </div>
        <h1 class="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05] mb-6">
          <app-split-text text="AI agents, shipped for SMBs." [stagger]="30" />
        </h1>
        <p class="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed"
           appReveal [revealDelay]="200">
          Managed end-to-end — outcomes in 7–10 days.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="#demo"
             class="inline-block px-7 py-3.5 bg-white/70 backdrop-blur border border-gray-200 shadow-sm font-semibold text-gray-900 rounded-lg transition-all hover:bg-accent hover:text-white hover:border-accent motion-reduce:transition-none">
            Try the demo
          </a>
          <a href="#contact"
             class="inline-block px-7 py-3.5 bg-white/70 backdrop-blur border border-gray-200 font-medium text-gray-700 rounded-lg transition-all hover:bg-accent hover:text-white hover:border-accent motion-reduce:transition-none">
            See pricing
          </a>
        </div>
        <p class="text-xs text-gray-400 mt-6">No credit card. Real outcomes in 7–10 days.</p>
      </div>
      <div class="relative max-w-4xl mx-auto px-6 pb-14" appReveal [revealDelay]="150">
        <app-hero-product-grid />
      </div>
    </section>

    <!-- MAIN GRID: logos + tabbed demo (Agent | Workflow | Data) + sticky form -->
    <section id="demo" class="px-6 pb-16 scroll-mt-24">
      <div class="max-w-7xl mx-auto mb-12" appReveal [revealDelay]="80">
        <p class="text-center text-xs uppercase tracking-wider text-gray-500 mb-6">
          Trusted by SMB founders in
        </p>
        <div class="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-60">
          <span class="text-base font-bold tracking-tight text-gray-700">Northwind Logistics</span>
          <span class="text-base font-serif italic text-gray-700">Loomstack</span>
          <span class="text-base font-semibold text-gray-700">Fattoria</span>
          <span class="text-base font-bold tracking-tighter text-gray-700">MAVEN&nbsp;OPS</span>
          <span class="text-base font-light tracking-wide text-gray-700">Tideline&nbsp;Health</span>
          <span class="text-base font-medium text-gray-700">Northwind&nbsp;AU</span>
        </div>
      </div>

      <div class="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
        <!-- Tabbed service demo card -->
        <div class="lg:col-span-2" appReveal [revealDelay]="120">
          <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <!-- Tab bar -->
            <div class="flex border-b border-gray-200 bg-gray-50">
              @for (t of demoServiceTabs; track t.key) {
                <button (click)="demoServiceTab.set(t.key)"
                  [class.border-b-2]="demoServiceTab() === t.key"
                  [class.border-accent]="demoServiceTab() === t.key"
                  [class.text-accent]="demoServiceTab() === t.key"
                  [class.text-gray-500]="demoServiceTab() !== t.key"
                  class="flex-1 px-4 py-3 text-sm font-medium transition-colors motion-reduce:transition-none">
                  {{ t.label }}
                </button>
              }
              <span class="flex items-center px-4 text-xs text-gray-400">Demo — pre-scripted</span>
            </div>

            <!-- Content -->
            @if (demoServiceTab() === 'agent') {
              <app-chatbot-demo />
            } @else if (demoServiceTab() === 'workflow') {
              <div class="p-6 space-y-4">
                <!-- Pipeline selector + live indicator -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <select [(ngModel)]="selectedPipeline" class="font-mono text-xs text-gray-700 bg-white border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-accent">
                      @for (p of pipelines; track p.key) {
                        <option [value]="p.key">{{ p.label }}</option>
                      }
                    </select>
                  </div>
                  <span class="font-mono text-xs text-green-600 tabular">● live</span>
                </div>

                <!-- Network / Node-based graph canvas -->
                <div class="relative w-full rounded-2xl border border-gray-200 overflow-x-auto"
                     style="min-height: 500px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);">
                  <!-- Inner padded layer so nodes don't clip at edges -->
                  <div class="relative" style="min-width: 760px; min-height: 460px; padding: 60px 80px 40px 80px;">

                    <!-- Subtle grid -->
                    <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]" aria-hidden="true">
                      <defs>
                        <pattern id="nw-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#94a3b8" stroke-width="0.5"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#nw-grid)"/>
                    </svg>

                    <!-- SVG: edges, bezier curves, flow particles, arrowheads -->
                    <svg class="absolute inset-0 w-full h-full pointer-events-none"
                         [attr.width]="svgWidth"
                         [attr.height]="svgHeight"
                         aria-hidden="true">
                      <defs>
                        <!-- Edge gradient -->
                        <linearGradient id="edge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stop-color="#475569" stop-opacity="0.6"/>
                          <stop offset="100%" stop-color="#94a3b8" stop-opacity="0.4"/>
                        </linearGradient>
                        <!-- Arrowhead marker — refX pushed past tip so it sits inside node circle -->
                        <marker id="arrowhead" viewBox="0 0 10 8" refX="9" refY="4"
                                markerWidth="8" markerHeight="6" orient="auto">
                          <path d="M1,1 L9,4 L1,7 Z" fill="#64748b"/>
                        </marker>
                      </defs>

                      <!-- Node masking circles (block edge lines beneath node icons) -->
                      @for (n of currentGraphNodes; track n.name) {
                        <circle [attr.cx]="n.x" [attr.cy]="n.y" r="28" fill="#1e293b" opacity="0.95"/>
                      }

                      <!-- Edge paths (bezier curves) -->
                      @for (e of currentGraphEdges; track e.id) {
                        <!-- Background glow line -->
                        <path [attr.d]="e.path"
                              stroke="#334155" stroke-width="4" fill="none"
                              stroke-linecap="round" opacity="0.3"/>
                        <!-- Main line -->
                        <path [attr.d]="e.path"
                              stroke="url(#edge-grad)" stroke-width="1.5" fill="none"
                              stroke-linecap="round"
                              marker-end="url(#arrowhead)"/>
                        <!-- Animated flow dot -->
                        <circle r="3" fill="#60a5fa" opacity="0.9">
                          <animateMotion [attr.dur]="e.dur" [attr.path]="e.path"
                                         repeatCount="indefinite"
                                         calcMode="spline" keySplines="0.4 0 0.2 1"/>
                          <animate attributeName="opacity"
                                   values="0;1;1;0" keyTimes="0;0.15;0.85;1"
                                   [attr.dur]="e.dur"
                                   repeatCount="indefinite"/>
                        </circle>
                      }
                    </svg>

                    <!-- Nodes: circular icon + label + tool -->
                    @for (n of currentGraphNodes; track n.name) {
                      <div class="absolute flex flex-col items-center select-none cursor-default transition-all duration-300 ease-out hover:scale-110 motion-reduce:transition-none"
                           [style.left.px]="n.x"
                           [style.top.px]="n.y"
                           [style.transform]="'translate(-50%, -50%)'">
                        <!-- Circle node -->
                        <div class="w-12 h-12 rounded-full border-2 flex items-center justify-center shadow-lg relative"
                             [class]="nodeCircleClass(n.type)">
                          <!-- Outer ping ring -->
                          <div class="absolute inset-0 rounded-full border-2 animate-ping opacity-20"
                               [class]="nodeCircleClass(n.type)"
                               [style.animation-duration]="'3s'">
                          </div>
                          <svg class="w-5 h-5 relative z-10" [class]="nodeIconColor(n.type)"
                               viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path [attr.d]="n.icon"></path>
                          </svg>
                        </div>
                        <!-- Label below -->
                        <div class="mt-2 text-center">
                          <div class="text-[10px] font-bold uppercase tracking-wider leading-none"
                               [class]="nodeLabelColor(n.type)">
                            {{ n.typeLabel }}
                          </div>
                          <div class="text-xs font-semibold text-slate-200 leading-snug mt-0.5 truncate max-w-[120px]">{{ n.label }}</div>
                          <div class="text-[9px] text-slate-500 font-mono truncate max-w-[120px]">{{ n.tool }}</div>
                        </div>
                      </div>
                    }
                  </div>
                </div>

                <!-- Metrics row -->
                <div class="flex items-center gap-4 text-xs text-gray-500">
                  <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span><span class="tabular">{{ currentWorkflowDuration }} avg runtime</span></span>
                  <span class="text-gray-300">·</span>
                  <span class="tabular">0.02% error rate</span>
                  <span class="text-gray-300">·</span>
                  <span>{{ currentGraphEdges.length }} connections</span>
                  <span class="text-gray-300">·</span>
                  <span>{{ currentGraphNodes.length }} nodes</span>
                  <span class="text-gray-300">·</span>
                  <span>runs 24/7</span>
                </div>
                <p class="text-xs text-gray-500">{{ serviceFor('workflow').detail }}</p>
                <p class="text-sm text-gray-500 tabular mt-1">{{ serviceFor('workflow').startingPrice }}</p>
              </div>
            } @else if (demoServiceTab() === 'data') {
              <app-data-analyst-demo />
            }
          </div>
        </div>

        <aside id="contact" class="lg:sticky lg:top-20 self-start scroll-mt-24" appReveal [revealDelay]="220">
          <app-lead-form />
        </aside>
      </div>
    </section>

    <!-- SERVICES bento overview -->
    <section id="services" class="px-6 py-16 bg-warm-50 border-y border-gray-200 scroll-mt-16" appReveal>
      <div class="max-w-6xl mx-auto">
        <h2 class="text-2xl font-semibold tracking-tight text-center mb-3">Everything we ship</h2>
        <p class="text-gray-500 text-center mb-10">Three services, one managed relationship.</p>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (b of bento; track b.key) {
            <div class="bg-white border border-gray-200 rounded-xl p-6 flex flex-col hover:border-gray-300 transition-colors motion-reduce:transition-none">
              <div class="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                @switch (b.key) {
                  @case ('agent') {
                    <svg class="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8a4 4 0 100 8 4 4 0 000-8z"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2"/></svg>
                  }
                  @case ('workflow') {
                    <svg class="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="12" cy="18" r="3"/><path d="M9 7l6 0M7 9l4 8M17 9l-4 8"/></svg>
                  }
                  @case ('data') {
                    <svg class="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 14l3-3 3 3 5-6"/></svg>
                  }
                  @case ('pricing') {
                    <svg class="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                  }
                }
              </div>
              <h3 class="font-semibold mb-1">{{ b.name }}</h3>
              <p class="text-sm text-gray-500 flex-1 mb-4">{{ b.line }}</p>
              @if (b.href) {
                <a [href]="b.href" class="text-sm font-medium text-accent hover:text-accent-hover text-left">{{ b.cta }} →</a>
              } @else {
                <button (click)="openDemo(b.demoKey!)" class="text-sm font-medium text-accent hover:text-accent-hover text-left">{{ b.cta }} →</button>
              }
            </div>
          }
        </div>
      </div>
    </section>

    <!-- TRUST STATS -->
    <section class="px-6 py-12 bg-white border-b border-gray-200" appReveal>
      <div class="max-w-3xl mx-auto grid grid-cols-3 gap-8 text-center">
        @for (s of stats; track s.caption) {
          <div>
            <div class="text-4xl font-semibold tracking-tight tabular">{{ s.value }}</div>
            <p class="text-sm text-gray-500 mt-1">{{ s.caption }}</p>
          </div>
        }
      </div>
      <p class="text-center text-xs text-gray-400 mt-8">Pilot program — 2026 cohort. Numbers update as we ship.</p>
    </section>

    <!-- TESTIMONIALS SLIDER -->
    <section id="testimonials" class="px-6 py-16 bg-white scroll-mt-16" appReveal>
      <div class="max-w-3xl mx-auto">
        <h2 class="text-2xl font-semibold tracking-tight text-center mb-8">Customers</h2>

        <div class="relative">
          <!-- Slider track -->
          <div class="overflow-hidden rounded-xl border border-gray-200">
            <div class="flex transition-transform duration-500 ease-out"
                 [style.transform]="'translateX(-' + (testimonialIndex() * 100) + '%)'">
              @for (t of testimonials; track t.name) {
                <div class="w-full flex-shrink-0 px-12 py-10 text-center">
                  <p class="text-base text-gray-700 leading-relaxed mb-6">"{{ t.quote }}"</p>
                  <p class="text-sm font-semibold">{{ t.name }}</p>
                  <p class="text-xs text-gray-500">{{ t.role }} · {{ t.company }}</p>
                </div>
              }
            </div>
          </div>

          <!-- Prev / Next -->
          <button (click)="prevTestimonial()"
            class="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-colors motion-reduce:transition-none"
            aria-label="Previous">
            ←
          </button>
          <button (click)="nextTestimonial()"
            class="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-colors motion-reduce:transition-none"
            aria-label="Next">
            →
          </button>

          <!-- Dots -->
          <div class="flex justify-center gap-2 mt-6">
            @for (t of testimonials; track t.name; let i = $index) {
              <button (click)="goToTestimonial(i)"
                [class.bg-accent]="testimonialIndex() === i"
                [class.bg-gray-300]="testimonialIndex() !== i"
                class="w-2 h-2 rounded-full transition-colors motion-reduce:transition-none"
                [attr.aria-label]="'Go to testimonial ' + (i + 1)">
              </button>
            }
          </div>
        </div>
      </div>
    </section>

    <footer class="border-t border-gray-200 py-8 text-center text-sm text-gray-500">
      paul 157 · AI services for SMB founders · US · AU · EU
    </footer>
  `,
})
export class LandingPageComponent {
  testimonials = TESTIMONIALS;
  demoServiceTab = signal<DemoServiceKey>('agent');
  scrolled = signal(false);
  testimonialIndex = signal(0);

  readonly demoServiceTabs = [
    { key: 'agent' as const, label: 'AI Agent' },
    { key: 'workflow' as const, label: 'Workflow Automation' },
    { key: 'data' as const, label: 'AI Data Analyst' },
  ];

  readonly bento: BentoTile[] = [
    { key: 'agent', name: 'AI Agent', line: 'Chat + take action across your tools.', cta: 'Try the demo', demoKey: 'agent' },
    { key: 'workflow', name: 'Workflow Automation', line: 'Connect your tools. Runs 24/7, managed.', cta: 'Learn more', demoKey: 'workflow' },
    { key: 'data', name: 'AI Data Analyst', line: 'Ask your data anything. Charts + reads.', cta: 'Learn more', demoKey: 'data' },
  ];

  readonly stats = [
    { value: '7–10', caption: 'days avg setup' },
    { value: '1', caption: 'founder contact — no ticket queue' },
    { value: '3', caption: 'services, one managed relationship' },
  ];

  selectedPipeline = 'incoming_lead';

  readonly pipelines = [
    { key: 'incoming_lead', label: 'incoming_lead' },
    { key: 'invoice_processing', label: 'invoice_processing' },
    { key: 'customer_onboarding', label: 'customer_onboarding' },
    { key: 'social_media_posting', label: 'social_media_posting' },
  ];

  // Each pipeline defines its own node graph layout (positions + connections).
  readonly graphData: Record<string, { nodes: GraphNode[]; edges: GraphEdge[]; duration: string }> = {
    incoming_lead: {
      duration: '1.4s',
      nodes: [
        // Left column (x offset by +80 for padding)
        { name: 'trigger',     x: 100, y: 200, type: 'trigger',   typeLabel: 'Trigger', label: 'Lead form',        tool: 'form.submit',      icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
        { name: 'enrich',      x: 100, y: 60,  type: 'process',   typeLabel: 'Enrich',    label: 'Enrich email',       tool: 'clearbit',         icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
        { name: 'score',       x: 100, y: 360, type: 'process',   typeLabel: 'Score',     label: 'Score lead',        tool: 'openai',            icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
        // Middle column
        { name: 'crm',         x: 280, y: 200, type: 'aggregator',typeLabel: 'Sync',      label: 'CRM contact',       tool: 'hubspot',           icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
        // Right column
        { name: 'slack',       x: 460, y: 60,  type: 'output',    typeLabel: 'Output',    label: 'Slack #sales',      tool: 'slack.notify',      icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m5.656 3.536l-3.536 3.536' },
        { name: 'email',       x: 460, y: 340, type: 'output',    typeLabel: 'Output',    label: 'Welcome email',     tool: 'gmail.send',        icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
      ],
      edges: [
        { from: 'trigger', to: 'crm' },
        { from: 'enrich',  to: 'crm' },
        { from: 'score',   to: 'crm' },
        { from: 'crm',     to: 'slack' },
        { from: 'crm',     to: 'email' },
      ],
    },
    invoice_processing: {
      duration: '1.0s',
      nodes: [
        { name: 'trigger',   x: 100, y: 220, type: 'trigger',  typeLabel: 'Trigger',  label: 'Invoice PDF',    tool: 'stripe.webhook',   icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { name: 'parse',     x: 100, y: 60,  type: 'process',  typeLabel: 'Parse',     label: 'Extract data',    tool: 'openai',           icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
        { name: 'validate',  x: 280, y: 220, type: 'process',  typeLabel: 'Validate',  label: 'Check totals',    tool: 'custom.rule',      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
        { name: 'post',      x: 280, y: 380, type: 'aggregator',typeLabel: 'Post',    label: 'Accounting',      tool: 'quickbooks',       icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        { name: 'slack',     x: 460, y: 60,  type: 'output',   typeLabel: 'Notify',    label: 'Slack #finance',   tool: 'slack.notify',     icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m5.656 3.536l-3.536 3.536' },
        { name: 'sendgrid',  x: 460, y: 380, type: 'output',   typeLabel: 'Send',      label: 'Invoice sent',     tool: 'sendgrid',         icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
      ],
      edges: [
        { from: 'trigger',  to: 'parse' },
        { from: 'parse',    to: 'validate' },
        { from: 'validate', to: 'post' },
        { from: 'post',     to: 'slack' },
        { from: 'post',     to: 'sendgrid' },
      ],
    },
    customer_onboarding: {
      duration: '0.7s',
      nodes: [
        { name: 'signup',   x: 100, y: 220, type: 'trigger',  typeLabel: 'Trigger',  label: 'Signup',        tool: 'auth.api',         icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' },
        { name: 'match',    x: 280, y: 220, type: 'process',  typeLabel: 'Assign',    label: 'Team match',     tool: 'custom.rule',      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
        { name: 'email',    x: 100, y: 60,  type: 'process',  typeLabel: 'Send',      label: 'Welcome kit',    tool: 'email.service',    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
        { name: 'schedule', x: 460, y: 220, type: 'process',  typeLabel: 'Schedule',  label: 'Onboard call',    tool: 'calendly',         icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { name: 'crm',      x: 460, y: 60,  type: 'output',   typeLabel: 'Update',    label: 'CRM update',      tool: 'hubspot',          icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
        { name: 'slack',    x: 460, y: 380, type: 'output',   typeLabel: 'Notify',    label: 'Slack #team',     tool: 'slack.notify',     icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m5.656 3.536l-3.536 3.536' },
      ],
      edges: [
        { from: 'signup',   to: 'match' },
        { from: 'signup',   to: 'email' },
        { from: 'match',    to: 'schedule' },
        { from: 'email',    to: 'schedule' },
        { from: 'schedule', to: 'crm' },
        { from: 'schedule', to: 'slack' },
      ],
    },
    social_media_posting: {
      duration: '1.5s',
      nodes: [
        { name: 'cms',       x: 100, y: 200, type: 'trigger',  typeLabel: 'Content', label: 'Content ready',   tool: 'cms.webhook',     icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { name: 'generate',  x: 280, y: 200, type: 'process',  typeLabel: 'Generate',  label: 'Post copy',       tool: 'openai',          icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' },
        { name: 'buffer',    x: 460, y: 100, type: 'process',  typeLabel: 'Queue',     label: 'Post schedule',   tool: 'buffer',          icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
        { name: 'batch',     x: 460, y: 320, type: 'aggregator',typeLabel: 'Publish',label: 'Multi-platform',  tool: 'api.batch',       icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
        { name: 'twitter',   x: 620, y: 60,  type: 'output',   typeLabel: 'Twitter',   label: 'Twitter / X',     tool: 'twitter.api',     icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
        { name: 'linkedin',  x: 620, y: 380, type: 'output',   typeLabel: 'LinkedIn',  label: 'LinkedIn',        tool: 'linkedin.api',    icon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z' },
      ],
      edges: [
        { from: 'cms',      to: 'generate' },
        { from: 'generate', to: 'buffer' },
        { from: 'generate', to: 'batch' },
        { from: 'buffer',   to: 'twitter' },
        { from: 'batch',    to: 'linkedin' },
      ],
    },
  };

  get currentGraphNodes(): GraphNode[] {
    return this.graphData[this.selectedPipeline]?.nodes ?? [];
  }

  get currentGraphEdges(): Array<{
    id: string; path: string; dur: string;
  }> {
    const data = this.graphData[this.selectedPipeline];
    if (!data) return [];
    const nodeMap = new Map(data.nodes.map((n) => [n.name, n]));
    return data.edges.map((e) => {
      const src = nodeMap.get(e.from);
      const dst = nodeMap.get(e.to);
      // Circular nodes are centered on (x,y) — no offset
      const sx = src?.x ?? 0;
      const sy = src?.y ?? 0;
      const dx = dst?.x ?? 0;
      const dy = dst?.y ?? 0;
      // Bezier with horizontal control points for natural flow
      const cx1 = sx + (dx - sx) * 0.4;
      const cx2 = dx - (dx - sx) * 0.4;
      const path = `M${sx},${sy} C${cx1},${sy} ${cx2},${dy} ${dx},${dy}`;
      // Deterministic duration based on distance for stable animation
      const dist = Math.sqrt((dx - sx) ** 2 + (dy - sy) ** 2);
      const dur = `${Math.max(1.5, Math.min(3.0, dist / 100))}s`;
      return { id: `${e.from}-${e.to}`, path, dur };
    });
  }

  get svgWidth(): number {
    const data = this.graphData[this.selectedPipeline];
    if (!data) return 760;
    const maxRight = Math.max(...data.nodes.map(n => n.x + NODE_W / 2));
    return Math.max(760, maxRight + 80);
  }

  get svgHeight(): number {
    const data = this.graphData[this.selectedPipeline];
    if (!data) return 460;
    const maxBottom = Math.max(...data.nodes.map(n => n.y + NODE_H / 2));
    return Math.max(460, maxBottom + 60);
  }

  get currentWorkflowDuration() {
    return this.graphData[this.selectedPipeline]?.duration ?? '0s';
  }

  openDemo(key: DemoServiceKey) {
    this.demoServiceTab.set(key);
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  nextTestimonial() {
    this.testimonialIndex.update((i) => (i + 1) % this.testimonials.length);
  }

  prevTestimonial() {
    this.testimonialIndex.update((i) => (i - 1 + this.testimonials.length) % this.testimonials.length);
  }

  goToTestimonial(i: number) {
    this.testimonialIndex.set(i);
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 8);
  }

  openDeepDive(key: DemoServiceKey) {
    this.demoServiceTab.set(key);
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  serviceFor(key: string) {
    return SERVICES.find((s) => s.key === key) ?? SERVICES[0];
  }

  // Style helpers for dark-canvas circular nodes
  nodeCircleClass(type: string): string {
    switch (type) {
      case 'trigger':    return 'border-blue-400 bg-slate-800';
      case 'process':    return 'border-slate-400 bg-slate-800';
      case 'output':     return 'border-green-400 bg-slate-800';
      case 'aggregator': return 'border-purple-400 bg-slate-800';
      default:           return 'border-slate-400 bg-slate-800';
    }
  }
  nodeIconColor(type: string): string {
    switch (type) {
      case 'trigger':    return 'text-blue-400';
      case 'process':    return 'text-slate-300';
      case 'output':     return 'text-green-400';
      case 'aggregator': return 'text-purple-400';
      default:           return 'text-slate-300';
    }
  }
  nodeLabelColor(type: string): string {
    switch (type) {
      case 'trigger':    return 'text-blue-400/80';
      case 'process':    return 'text-slate-500';
      case 'output':     return 'text-green-400/80';
      case 'aggregator': return 'text-purple-400/80';
      default:           return 'text-slate-500';
    }
  }
}
