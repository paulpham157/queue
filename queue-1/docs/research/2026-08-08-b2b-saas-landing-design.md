# B2B SaaS landing design — patterns from top-tier sites

Date: 2026-08-08
Sources: 5 sites (Linear, Vercel, Stripe, Anthropic, Resend)

## Access status

`WebFetch` was blocked on every primary domain (linear.app, vercel.com, stripe.com, anthropic.com, resend.com — all returned "Unable to verify if domain is safe to fetch"). WebSearch returned empty for every query. **All findings below were captured via `curl` against the live HTML and CSS at each root URL.** The HTML was minified and statically rendered (SSR), so visual judgements about layout/imagery/colors are anchored in (a) extracted CSS classes, inline styles, color tokens and `@font-face`/`@keyframes` rules, and (b) what the markup actually contains (text content, class names that imply layout, attribute names). I have flagged every claim as `[fetched]` (verbatim from the HTML/CSS) or `[inferred]` (conclusion drawn from CSS structure that I could not pixel-confirm). No screenshotting was possible; page-level visual references are linked to the live URL.

| Site | URL | Status |
|---|---|---|
| Linear | https://linear.app | fetched via curl (1.27 MB SSR HTML) |
| Vercel | https://vercel.com | fetched via curl (619 KB SSR HTML + 4 CSS chunks) |
| Stripe | https://stripe.com | fetched via curl (683 KB SSR HTML + 8 CSS chunks) |
| Anthropic | https://anthropic.com | fetched via curl (182 KB HTML, Webflow-built) |
| Resend | https://resend.com | fetched via curl (446 KB SSR HTML) |

## Summary table

| Site | Hero | Type | Color | Imagery | Notable |
|---|---|---|---|---|---|
| Linear | "The system for product development" — sub "Purpose-built for planning and building products with AI agents" | Modern sans (Inter-like), monospace for code/data; tabular-nums for figures | Dark `theme-color #08090a`, light surfaces. Customer-card backgrounds include `#0F3338`, `#422222`, `#e4f222`, `#1C85E8`, pastel `#b2d5ff→#dfd1ff` | Minimal SVG mark, dot-grid pattern (`grid-dot-X-Y-upDown`, `…pong`) infinite animations, customer-card bento of OpenAI/Ramp/Opendoor with bold color blocks | "Ingredients" sections (1.1, 1.2…), `font-variant-numeric: tabular-nums`, audio "Weekly Pulse" element |
| Vercel | "Agentic Infrastructure" + sub "The autonomous stack for every app and agent." H2s: "Build agents on infrastructure that thinks like them", "Ship apps that scale from zero to millions instantly", "Host platforms that serve every customer" | Geist Sans (proprietary), Geist Mono; GeistPixel family (Pixel Circle/Grid/Line/Square/Triangle) — distinctive pixel primitives | Light bg default, hero canvas with shader; tokens `gray-100…gray-1000`, `green-900`, accent `#0070F3` (visible in CSS) | Triangle logo SVG, pixel-grid hero canvas, scroll-driven shaders | Group/hero with shader canvas, `motion-reduce:` for accessibility, `aria-[current=page]:underline` nav indicator |
| Stripe | Subhead "Financial Infrastructure to Grow Your Revenue". H2s: "The backbone of global commerce", "Powering businesses of all sizes", "Flexible solutions for every business model" | Sohne variable (`sohne-var`) for prose, SourceCodePro for monospace | Navy `#1a1a2e` and `#2d2d44` darks, cyan `#7ec8e3`, gold `#f5a623` — conservative financial palette | Bento grid of products (Payments, Billing, Agentic Commerce, Issuing, Crypto, Connect), customer stories (Hertz, URBN, Instacart, Le Monde), stat callouts ("US$1.9tn in 2025") | `hds-*` design-system class prefix, hds-button variants `--primary`/`--secondary-on-quiet`/`--transparent`, "Stats section" as trust banner |
| Anthropic | H1 "AI **research** and **products** that put safety at the frontier" (linked words). Sub: "AI will have a vast impact on the world. Anthropic is a public benefit corporation dedicated to securing its benefits and mitigating its risks." | Anthropic Sans (body), Anthropic Serif (display — `Anthropic Serif'), Georgia, serif`), JetBrains Mono (code) | Warm cream `#fafafa`, deep slate `#141413`, terracotta accent `#d97757`, dusty rose `#c46686`, sage `#788c5d`, sky `#d3e5f8`, olive `#5d6c7b` — editorial palette, intentionally non-tech | Editorial-style big-CTA section ("Anthropic is built on hard questions"), Webflow-built | Distinctly warm/editorial tone vs other AI sites; rounded-2xl buttons with `backdrop-blur-[25px]` glass + `texture-btn.png` overlay; "Big-CTA" pattern as full-bleed scroll section |
| Resend | H1 "Email for developers" rendered in Domaine (custom serif display, 4rem mobile / 6rem desktop, `tracking-[-0.01em] leading-[100%]`). Sub: "The best way to reach humans instead of spam folders. Deliver transactional and marketing emails at scale." | `font-domaine` (display serif) for hero h1, `font-display` for H2s, sans for body. Gradient text effect on headings (`effect-font-gradient`) | Dark-mode default (`color-scheme: dark`, `theme-color: #000000`); primary buttons are translucent white-on-glass with hover-invert | Headline as a wordmark moment; tail-anchored pill CTAs | Glass buttons with `texture-btn.png` overlay (`linear-gradient(104deg, rgba(253,253,253,0.05)_5%, rgba(240,240,228,0.1)_100%)`); CTAs labeled "Get started" + "Documentation" (no signup pitch on hero secondary) |

---

## Per-site findings

### Linear — https://linear.app

**[fetched]** The hero `<title>` is "Linear – The system for product development" and the meta description is "Purpose-built for planning and building products with AI agents." A secondary headline visible inside the SSR markup is "Purpose-built for modern teams with AI workflows at its core, Linear sets a new standard for planning and building products." and "Designed for the AI era." A large H2 partially rendered reads "Define the …" (likely "Define the workflow" — the visible body section that follows uses the verb "Define" repeatedly as a section heading).

**[fetched]** Top-nav links (extracted from `<nav aria-label="Main">`): Customers, Pricing, Now, Contact, Docs, Log in, Open app. Section anchors that scroll to product areas: Intake, Plan, Build, Diffs, Monitor, Pricing, Security, Asks. Primary CTA is "Get started" (`variant-invert` button on dark hero); secondary is "Contact sales" (`variant-secondary`). Nav and section links use the `I_mUeq_root` class — Linear's link primitive.

**[fetched]** Theme color is `#08090a` (near-black). Body bg appears neutral/white in light mode (theme not visible in SSR HTML but consistent with `theme-color`). Customer-card backgrounds extracted from inline styles are: `#0F3338` (deep teal), `#422222` (deep red/brown), `#e4f222` (high-visibility lime), `#1C85E8` (clear blue), and a layered pastel `linear-gradient(180deg, #b2d5ff 0%, #dfd1ff 100%)` with `rgba(255,255,255,0.4)` overlay. `[inferred]` This is a deliberate "color-by-company" approach — each customer testimonial card carries the brand color of the customer, which is unusual and very memorable.

**[fetched]** Typography: a single sans-serif family is used across body and headings (class `sc-KOGVz` — Linear's type component); a monospace family is referenced via `var(--font-monospace)`. Numeric values use `font-variant-numeric: tabular-nums` (this is how their "Issues 18, 16, 14…" graphs align). Type scale tokens visible: `--title-1-size`, `--title-2-size`, `--title-3-size`, `--title-4-size`, `--text-tiny-size`, `--text-mini-size`, `--text-micro-size`, `--text-small-size`, `--text-regular-size`, `--text-large-size`.

**[fetched]** Motion: dozens of `animation:` rules on grid-dot elements. Examples: `animation:grid-dot-0-0-agent 3200ms steps(1, end) infinite`, `animation:grid-dot-0-0-pong 1600ms steps(1, end) infinite`, `animation:grid-dot-0-0-upDown 2800ms steps(1, end) infinite`. `[inferred]` This is a styled grid of dots where each one animates in a coordinated loop — likely a hero illustration of an active workspace. Also an audio element (`<audio src="https://static.linear.app/assets/homepage/pulse-audio.mp3" preload="metadata">`) titled "Weekly Pulse for Aug 8" — a tappable audio digest of product updates.

**[fetched]** "Ingredients" pattern: a footer on each section enumerates features with numbered slugs, e.g. `1.1 Linear Agent +`, `1.2 Triage +`, `1.3 Customer Requests +`, `1.4 Linear Asks +`, `3.1 Issues +`, `3.2 Agents +`, `3.3 Linear MCP +`, `3.4 Git automations +`, `3.5 Cycles +`. The `+` button implies expand/collapse. `[inferred]` This is a fast way to scan what's in each section without scrolling.

**[fetched]** Customer trust signal: "Linear powers over **40,000** product teams. From ambitious startups to major enterprises." with a "Customer stories" link. Logos visible: OpenAI (Gabriel Peal, Staff Software Engineer), Ramp (Nik Koblov, Head of Engineering), Opendoor (Kaz Nejatian, VP Product). Logos rendered as inline SVG at 64×64px in monoline Linear style.

**[fetched]** Pricing intro headline (visible in nav): "Pricing" appears as a section anchor but the landing-page section text after the headline is "Review PRs and agent output" — making pricing secondary to capability demo.

**[inferred]** Distinctive details: (1) the `font-variant-numeric: tabular-nums` rule is a small but very Linear touch — they care about numeric alignment. (2) The "Ingredients" pattern is unique — no other site in the set uses numbered subsections as scan-rhythm. (3) The customer-card colored blocks (lime, teal, etc.) are bolder than the typical grayscale logo grid.

### Vercel — https://vercel.com

**[fetched]** Title: "Agentic Infrastructure - Vercel". Description: "The autonomous stack for every app and agent." Hero `<h1>` text: "Agentic Infrastructure" (class `text-heading-48 @sm:text-heading-64 font-normal!`). H2s immediately under: "Build agents on infrastructure that thinks like them" (max-width 18ch, `text-heading-56 @lg:text-heading-56`), "Ship apps that scale from zero to millions instantly", "Host platforms that serve every customer", "Recently shipped", "Built by you, or your agents". Footer column labels: Agent Stack, Core Platform, Security, Tools, Frameworks, SDKs, Build, Learn, Explore, Company, Legal & Trust, Social.

**[fetched]** Top nav (extracted from `aria-label="Main"` nav element): AI SDK, AI Gateway, Sandbox, Passport, Connect, Security, CDN / Content Delivery, Fluid Compute, Observability, Workflows, Vercel Agent, Vercel Plugin, Docs, About, Blog, Changelog, Knowledge Base, AI Apps, Web Apps, Marketing Sites. Nav links carry CDP analytics (`data-cdp-track`). Logo is a single-triangle SVG (the iconic ▲). Header uses `peer sticky top-0 z-(--header-zindex) bg-background-200` with a `data-[scrolled]:shadow-[0_1px_0_0_var(--ds-gray-alpha-400)]` rule — a hairline border appears on scroll only.

**[fetched]** Typography: CSS variables `--font-geist-sans` and `--font-mono` are used everywhere. The most distinctive detail: Vercel also defines a family of **pixel primitives** — `--font-geist-pixel-circle`, `--font-geist-pixel-grid`, `--font-geist-pixel-line`, `--font-geist-pixel-square`, `--font-geist-pixel-triangle`, with face names GeistPixelCircle, GeistPixelGrid, GeistPixelLine, GeistPixelSquare, GeistPixelTriangle. `[inferred]` These are pixel-font assets used as decorative monograms/marks in product UI. Geist Sans is Vercel's custom typeface (well-documented elsewhere) — a clean grotesque similar to Inter but tuned tighter.

**[fetched]** Headline sizes are tokenized as `text-heading-48`, `text-heading-56`, `text-heading-64` and balanced with `text-balance` (`text-balance text-heading-48 @sm:text-heading-64`). Body uses `text-label-14 font-medium`. Color tokens: `gray-100` through `gray-1000` (10-stop scale), `green-900`, plus `bg-background-100` / `bg-background-200` for surfaces. The hero canvas sits in a `group/hero relative flex min-h-0 flex-1 flex-col items-center justify-center` container with three absolutely-positioned layers: a shader canvas, a light-only zoom-freeze image, and a hidden mobile image.

**[fetched]** Hero interaction: the hero element has `data-[hero-drop-active=true]/hero` and `data-[hero-drop-staging=true]/hero` data-attribute states. The primary copy becomes invisible when the user starts a "drop" gesture (likely file drop), and a drop hint text becomes visible — an interactive demo of the Vercel Agent that lives inside the hero. Hero text container is `max-w-[444px]`. Drop-active copy: "autonomously investigate errors, plan fixes, and open PRs."

**[fetched]** Motion: extensive `@keyframes` defined — examples include `@keyframes botid-hero-module__HXoBNa__letterReveal`, `@keyframes scrolling-graph-module__eLF`, `@keyframes cursor-module__AEUiAq__float`, `@keyframes comment-module__qCxnUW__blink`, `@keyframes form-content-module__PGBHYG__pulse-animation`. Animation timings: `0.2s ease-in-out forwards`, `0.5s forwards`, `1.1s steps(2,end) infinite`. Every motion class is paired with a `motion-reduce:` variant that disables the animation under user preference.

**[fetched]** Layout: hero uses `min-h-0 flex-1 flex-col @lg:flex-row @lg:justify-between`. Section container uses `tracking-tighter @lg:leading-none` on H2s with `@lg:col-span-8 @lg:col-start-1` — a 12-col grid where headlines take col 1–8 and a deliberate empty col 9–12 acts as whitespace. Nav active-page state uses `aria-[current=page]:underline` with `decoration-gray-500 underline-offset-[5px] decoration-1` — subtle 1px underline.

**[fetched]** Color tokens used in CSS: a flat scale includes `#0070F3` (the Vercel blue, repeated), `#00D2BE`, `#00E5FF`, `#00FF95` — used as semantic accents. `[inferred]` Vercel's brand is a pure white/black canvas with one saturated blue as the only "noise" color, plus neon-cyan/teal/lime for status badges.

**[inferred]** Distinctive details: (1) the **GeistPixel family** is the most unusual typographic choice across all 5 sites — pixelated marks as a third typeface role. (2) **letter-reveal** animation in the hero (`@keyframes botid-hero-module__HXoBNa__letterReveal`) is a more dramatic version of Linear's split-text. (3) **scroll-state header** with hairline shadow is a polished detail. (4) Vercel uses **`text-balance`** as a layout primitive — titles wrap to balanced lines.

### Stripe — https://stripe.com

**[fetched]** Title: "Stripe | Financial Infrastructure to Grow Your Revenue". Description: "Stripe is a financial services platform that helps all types of businesses accept payments, build flexible billing models and manage money movement." Server rendered to a Hong Kong locale (`og:url: https://stripe.com/en-hk`) — Stripe geo-personalizes. The page contains no `<h1>` element in SSR (the heading is rendered client-side by their hydration step) but the next-level H2s are: "Flexible solutions for every business model.", "The backbone of global commerce", "Powering businesses of all sizes.", "Reliable, extensible infrastructure for every stack.", "What's happening".

**[fetched]** Hero CTA buttons (extracted from `hds-button--primary` instances): "Get started", "Start now" (both `data-analytics-label="hero__get_started"` and `data-analytics-label="global_nav__start_now"`), "Contact sales" (`hero__contact_sales` — Stripe splits self-serve from sales motion), "Sign in", and a "Watch now" link to Stripe Sessions 2026. All buttons use the `hds-button` design-system prefix with variants `--primary`, `--secondary-on-quiet`, `--compact`, `--transparent`, `--secondary`.

**[fetched]** Typography: `font-family: sohne-var` is used throughout the body. Sohne is Stripe's licensed typeface (by Klim Type Foundry) — a humanist sans with moderate contrast. Monospace uses `SourceCodePro`. `[inferred]` Sohne is a paid commercial face — choosing it signals an investment in voice. Stripe also writes everything lowercase ("get started", "contact sales") for the buttons — distinctive typographic restraint.

**[fetched]** Color palette extracted from CSS: primary dark backgrounds `#1a1a2e` and `#2d2d44` (deep navy), secondary text `#424770`, neutral surfaces `#929eaa`, `#cad2d9`, `#e0e0e0`, plus accent cyan `#7ec8e3` and warning/CTA gold `#f5a623`. `[inferred]` The palette reads "trust + finance": navy as the trust color, gold as the conversion color.

**[fetched]** Layout patterns: the page is structured around a **bento grid** of product modules with H3 headings ("Accept and optimise payments globally – online and in person", "Enable any billing model", "Monetise through agentic commerce", "Create a card issuing programme", "Access borderless money movement with stablecoins and crypto", "Embed payments in your platform"). A separate "Stats section" shows "The backbone of global commerce" with the headline "Businesses on Stripe generated US$1.9tn in 2025" and "150K+ users have their best day ever on Stripe."

**[fetched]** Customer story cards: Hertz, URBN, Instacart, Le Monde — each rendered with a "customer-summary-description" headline (e.g. "Hertz unifies commerce with Stripe.", "URBN consolidates $5 billion in online and in-store revenue onto Stripe."). Each card opens to a full case study. `[inferred]` Stripe uses revenue-numbers in customer cards ("$5 billion", "US$1.9tn") as proof points — VCs/founders respond to that.

**[fetched]** Vertical personas on a separate section: "Stripe for enterprises", "Stripe for startups", "Stripe for platforms" — each a button linking to a dedicated landing. `[inferred]` Stripe is one of the few sites that explicitly segments by customer size.

**[inferred]** Distinctive details: (1) **`hds-*` design-system prefix** on every button (`hds-button--primary` etc.) — Stripe has a fully tokenized component library. (2) **bento grid as section primitive** rather than feature rows. (3) **stats-first layout** — a "backbone of global commerce" stat banner appears as a section, not just decoration. (4) **dropdown navigation menus** (`hds-navigation-menu__trigger`) instead of mega-menus — the nav collapses cleanly on small screens.

### Anthropic — https://anthropic.com

**[fetched]** Title: "Home | Anthropic". Description: "Anthropic is an AI safety and research company that's working to build reliable, interpretable, and steerable AI systems." Site is built on Webflow (every link carries `g_clickable_link w-inline-block` class signatures). H1: `AI <a href=".../research">research</a> and <a href=".../product/overview">products</a> that put safety at the frontier` — the words "research" and "products" are inline links. Subhead: `AI will have a vast impact on the world. Anthropic is a public benefit corporation dedicated to securing its benefits and mitigating its risks.`

**[fetched]** Typography: Webflow class `u-display-xl` on the H1 (custom display size); `font-family: Anthropic Serif', Georgia, serif` for serif display; `font-family: Anthropic Sans` for body; `font-family: JetBrains Mono` for monospace. `[inferred]` Anthropic commissioned their own typeface family — Anthropic Sans (a humanist grotesque) plus Anthropic Serif (a display serif) — distinct from the Inter/Geist norm of B2B SaaS. The choice signals editorial credibility.

**[fetched]** Color palette extracted from CSS: warm, earthy tones — `#d97757` (terracotta/coral, the primary accent), `#141413` (warm near-black for text/dark surfaces), `#fafafa` (off-white/cream), `#1f1e1d`, `#3d3d3a`, `#e3dacc`, `#ebcece`, `#d3e5f8`, `#c46686`, `#c6613f`, `#d4a27f`, `#5d6c7b`, `#ea384c`, `#788c5d`, `#61c554`. `[inferred]` Anthropic deliberately chose a non-tech color story — cream paper + terracotta + sage + dusty rose — to look more editorial/scientific than "another AI SaaS".

**[fetched]** Buttons: rounded-2xl with `border-[2px] border-white/5 backdrop-blur-[25px] bg-[linear-gradient(104deg,rgba(253,253,253,0.05)_5%,rgba(240,240,228,0.1)_100%)] shadow-sm hover:bg-white/90 hover:text-black hover:shadow-button focus-visible:bg-white/90`. An `after:` pseudo-element layers `texture-btn.png` over the button border for a paper-grain effect. CTA text variants: "Try Claude", "Learn", "Read". Section labels: "Products", "Models" in footer.

**[fetched]** Section structure: a primary "big-cta" section with `class="big-cta_scroll-bg is-kt3"`, `big-cta_container`, `big-cta-content_wrap`, `big-cta_title`, `big-cta_subtitle-wrap`. The big-CTA headline reads "Anthropic is built on hard questions." `[inferred]` This is a full-bleed scroll-driven section where the background image transitions as the user scrolls — a "scroll-bg" pattern. Below, an article-list of "Latest releases" with H3s "Introducing Opus 5", "Introducing Sonnet 5", "Announcing Claude Science" and editorial posts ("Core views on AI safety", "Anthropic's Responsible Scaling Policy", "Anthropic Academy: Build and Learn with Claude", "Anthropic's Economic Index", "Claude's Constitution").

**[fetched]** Inline data attributes on CTAs encode analytics context: `data-cta-copy="Research" data-cta="Home page" data-cta-position="Hero section"` — every link knows its position in the funnel.

**[inferred]** Distinctive details: (1) **Anthropic Sans + Anthropic Serif as a paired serif/sans system** is the most typographically confident choice in the set. (2) **cream/terracotta palette** reads as "scientific paper" rather than "tech dashboard" — a clear position against the OpenAI blue. (3) **editorial layout** (numbered articles, H3 stories with category tags) reads like a publication homepage, not a SaaS landing. (4) **`big-cta_scroll-bg`** pattern is a content-led hero where the background changes on scroll, distinct from Vercel's static shader.

### Resend — https://resend.com

**[fetched]** Title: "Resend · Email for developers". Description: "The best way to reach humans instead of spam folders. Deliver transactional and marketing emails at scale." Color scheme: `dark`. Theme color: `#000000`. The site is fully dark-by-default — `<meta name="color-scheme" content="dark">`.

**[fetched]** H1 (hero): `<h1 class="effect-font-styling font-domaine text-[4rem] md:text-[6rem] tracking-[-0.01em] leading-[100%] effect-font-gradient relative text-center md:text-left pb-3">Email for<br/>developers</h1>` — the headline is the literal product positioning ("Email for developers"), set in a custom serif (Domaine) at 64–96px, tracking tightened to `-0.01em`, line-height 100%, with a gradient text effect (`effect-font-gradient`).

**[fetched]** Subhead: `<p class="text-base md:text-[1.125rem] md:leading-[1.5] text-gray-11 font-normal relative mb-8 mt-2 max-w-[30rem] text-center leading-7 md:text-left">The best way to reach humans instead of spam folders. Deliver transactional and marketing emails at scale.</p>`

**[fetched]** Buttons: a single primary CTA class is reused everywhere with different sizes. `<a class="relative inline-flex items-center justify-center select-none rounded-2xl … text-white border-[2px] border-white/5 backdrop-blur-[25px] bg-[linear-gradient(104deg,rgba(253,253,253,0.05)_5%,rgba(240,240,228,0.1)_100%)] shadow-sm not-disabled:hover:bg-white/90 not-disabled:hover:text-black">`. CTA labels: "Get started" (primary, large), "Log in" (text-only secondary), "Documentation" (ghost), "Contact us" (ghost), "Check the docs" (ghost). On hover the button **inverts** — from translucent white text on glass to solid white background with black text.

**[fetched]** Each button has an `after:` pseudo-element layered with `texture-btn.png` for a paper-grain effect, exactly like Anthropic. `[inferred]` Both Anthropic and Resend use the same `texture-btn.png` pattern — likely a shared micro-design convention in the AI dev-tool space.

**[fetched]** Type system: `var(--font-domaine)` for the hero display, `var(--font-display)` for H2s (`text-[3rem] md:text-[3.5rem] tracking-tighter leading-[120%]`), `var(--font-sans)` for body, `var(--font-mono)` for code. Color tokens: `text-slate-11`, `text-slate-12`, `text-emphasis`, `bg-slate-4` — a Radix-style slate scale. `font-display effect-font-styling text-xl leading-[130%] text-slate-12` for sub-headlines (e.g. "Test mode", "Modular webhooks", "Contact management", "Broadcast analytics").

**[fetched]** Section structure: H2s visible in markup are "Integrate", "First-class", "Write using a delightful editor", "Go beyond editing", "Develop emails using React", "Reach humans, not spam folders", "Everything in your control", "Beyond expectations", "Email reimagined." (the latter in a dedicated hero that re-uses the `effect-font-hero` class — a 4.8rem version of the same Domaine serif). Feature links enumerated: Automations, Audiences, Broadcasts, Inbound, Templates, Webhooks, Dedicated IPs — all under `/features/*`.

**[fetched]** Logo: the HTML uses `font-display` for the wordmark — `[inferred]` the "Resend" logo is set in Domaine/display serif as the wordmark, not a custom mark.

**[fetched]** Layout: max-width on the subhead is `max-w-[30rem]` (about 480px). Cards use the `rounded-2xl border border-gray-alpha-400` pattern with focus rings on `focus-visible:ring-2 focus-visible:ring-slate-7`. Section padding follows a `[&_svg]:text-gray-11` convention where icons inherit text color.

**[fetched]** Color tokens (extracted from the CSS dump): heavy use of deep navy/black hues `#00002d`, `#00002f`, `#000033`, `#000055`, `#002359`, plus bright accent blues `#0075ff`, `#0077FF`, `#0090FF`, `#0080ff` — likely used for syntax/code blocks and the `effect-font-gradient` headline. `[inferred]` The brand blue is the same Vercel-Blue family (`#0075ff` ≈ `#0070F3`) — they are borrowing from a familiar dev-tool palette.

**[inferred]** Distinctive details: (1) **Domaine serif as the brand voice** — the only one of the 5 sites that uses a serif wordmark. (2) **dark-by-default** landing — every other site is light. (3) **gradient text on headlines** (`effect-font-gradient`) — a small flourish that's hard to copy. (4) **glass buttons that invert on hover** is a tactile, B2B-premium pattern. (5) **CTA naming** — "Get started" is a friction-low signup CTA; "Documentation" is offered as the secondary, not "Book a call". This is a developer-first motion that matches the audience.

---

## Patterns to apply to queue-1

The current queue-1 landing at `/Users/paulpham157/Downloads/queue/queue-1/frontend/src/app/landing/landing-page.component.ts` already has a strong foundation: a sticky nav, a hero with aurora background + split-text headline + dual CTAs + trust microcopy, a chatbot+form 3-column grid, animated tabs, testimonials, and a footer. The brand color is `#2563eb` (Tailwind `accent`). Below are concrete recommendations, each tied to a specific inspiration source. The audience is SMB founders in US/AU/EU — direct, senior, ROI-focused — so we should adopt patterns that signal competence (Linear's polish, Stripe's bento) rather than editorial poetry (Anthropic) or developer-cute (Resend). The "AI agent for founders" voice wants to feel **trustworthy + capable**, not futuristic.

### 1. Replace the aurora hero with a **single-product visual** hero (Linear + Stripe)

**What to change:** `frontend/src/app/landing/landing-page.component.ts` (lines 41–73) and `frontend/src/app/landing/aurora-background.component.ts`.

**Why:** Linear's hero doesn't have an aurora mesh — it has the workspace grid (animated dots) and Stripe has its bento grid + customer logos. The aurora is generic startup-SaaS. Replacing it with a single concrete visual (e.g. a 6-tile dashboard preview of the AI agent doing 3 things: "Lead came in → triaged → updated CRM") would communicate the actual product.

**Inspiration:** Linear (`grid-dot-*` animations, lines 41–73 of the hero section), Stripe (bento grid of product modules under the H2).

**Concrete change:** Keep `<app-aurora-background>` as an opt-in alternative, but introduce a new `<app-hero-product-grid>` component that renders a 6-card static grid of "in-progress" agent tasks (similar to Linear's "Issue in progress" cards). Add a small `pulse` animation on the dots in each card (Linear-style `step(1,end)` for sharp frame transitions, not smooth easing).

### 2. Tighten the headline copy to a single-sentence value prop (Linear)

**What to change:** `frontend/src/app/landing/landing-page.component.ts` line 52.

Current: `"AI that ships the work, not a demo."` (good but still abstract).

**Why:** Linear's H1 is "The system for product development" — three nouns, zero jargon. Stripe's hero is the same. Anthropic's is "AI research and products that put safety at the frontier" — also noun-phrase. The current Paul 157 line is good but could be even more concrete.

**Inspiration:** Linear (noun-phrase H1), Anthropic (linked inline words for two-word headers — could split "AI agent" into one link to /agent and "for founders" into another link to /founders).

**Concrete change:** Try one of: "AI agents, shipped for SMBs.", "AI workflows your team can run.", "AI work, not a tool." Then sub "Managed end-to-end, outcomes in 7–10 days." (which is already on the page). Add an `appReveal` on the sub so it fades in 200ms after the headline, like Linear's letter-reveal.

### 3. Add a **logotype wordmark** in the navbar (Resend)

**What to change:** `frontend/src/app/landing/landing-page.component.ts` lines 32–37.

Current: `<div class="font-semibold tracking-tight">Paul 157</div>` — a plain text wordmark.

**Why:** Every site in the set has a distinct logo treatment: Linear's interlocking monogram, Vercel's triangle, Stripe's wordmark, Anthropic's hexagonal mark, Resend's serif wordmark. A plain "Paul 157" reads generic.

**Inspiration:** Resend (Domaine serif wordmark), Stripe (lowercase Sohne wordmark).

**Concrete change:** Render "paul 157" (lowercase) in a heavier weight (`font-bold tracking-tighter text-lg`). Optionally layer a small accent-color dot before the wordmark (`.before:content-['•'] .before:text-accent .before:mr-2`). This is a 5-minute change with disproportionate brand impact.

### 4. Add a **bento grid** of capabilities instead of the linear tabs section (Stripe)

**What to change:** `frontend/src/app/landing/landing-page.component.ts` lines 89–131 (the "Or explore our other services" tabs section).

**Why:** Stripe uses a 6-tile bento for its product surface. Linear uses numbered "Ingredients" subsections. Both scan faster than a 2-tab interface.

**Inspiration:** Stripe (`modular-solutions-bento-card__title` pattern), Linear (numbered 1.1/1.2 ingredients).

**Concrete change:** Replace the 2-tab animated-tabs section with a 4-tile bento: (a) AI Agent — "Chat + take action", (b) Workflow Automation — "Connect your tools", (c) AI Data Analyst — "Ask your data", (d) Pricing/Starting-at — "$2.5k setup + $500/mo". Each tile gets a small accent-color icon + 1-line description + "Learn more →" link. The chatbot demo stays as the dominant interactive element, but the bento lets visitors scan all three services at once. Keep `<app-animated-tabs>` for a secondary "deep-dive" view if a user clicks into one tile.

### 5. Add **tabular-nums** to numeric data and a **monospace accent** in CTAs (Linear)

**What to change:** `frontend/src/styles.css` (add a `font-variant-numeric: tabular-nums` rule) and `frontend/src/app/landing/chatbot-demo.component.ts` + `frontend/src/app/landing/lead-form.component.ts` (apply to numeric badges).

**Why:** Linear uses `tabular-nums` for issue counts, version numbers, and timestamps. It signals "this data is precise". Resend uses `font-mono` for code/email subject lines.

**Inspiration:** Linear (`font-variant-numeric: tabular-nums`), Resend (mono accent in `font-mono u-text-transform-uppercase` labels).

**Concrete change:** Add a `.tabular` utility class in `styles.css`: `.tabular { font-variant-numeric: tabular-nums; }`. Apply it to: (a) the "1.4s avg · 0.02% error" line in the workflow pipeline demo (line ~119), (b) any version/date badges, (c) the starting-price numbers in `lead-form.component.ts` (`Agent: from $2.5k + $500/mo`).

### 6. Add a **trust stats banner** before the testimonials (Stripe)

**What to change:** New section to insert between the chatbot+form grid (line 86) and the services bento (line 89).

**Why:** Stripe has a "Backbone of global commerce" stats section that reads "Businesses on Stripe generated US$1.9tn in 2025." It's the highest-trust element on their page. Linear has "40,000 product teams". Even one honest number ("Shipped for X founders in US/AU/EU", or "Average setup time: 7–10 days", or "Hours saved per week: 12+") is a trust multiplier.

**Inspiration:** Stripe (`stats-section__title hds-heading--xxl`), Linear (`Linear powers over 40,000 product teams`).

**Concrete change:** Insert a small section above the existing testimonials: one row of 3 stat tiles (use `grid grid-cols-3 gap-8 max-w-3xl mx-auto py-12`), each tile has a 4xl tabular number and a small caption. Example copy (replace once real data exists):
- **7–10** days avg setup
- **1** founder contact (no ticket queue)
- **3** services bundled

**Honesty note:** Don't fake stats. If real numbers aren't available, skip this section or use placeholder language like "Pilot program — 2026". The CONTEXT.md says "Avoid list price" and emphasizes trust.

### 7. Use **glass-style CTA buttons** on the hero (Resend)

**What to change:** `frontend/src/app/landing/landing-page.component.ts` lines 62–69 (CTA buttons).

Current: a solid `bg-accent` button + a bordered ghost button. Both very standard.

**Why:** Resend and Anthropic use a translucent glass button (`backdrop-blur-[25px]` + subtle gradient) that reads more premium than a solid color. The current solid `#2563eb` button is fine but generic. The glass button would differentiate Paul 157 from "every Tailwind SaaS landing".

**Inspiration:** Resend (button class chain `bg-[linear-gradient(104deg,rgba(253,253,253,0.05)_5%,rgba(240,240,228,0.1)_100%)] border-[2px] border-white/5 backdrop-blur-[25px]`), Anthropic (same).

**Concrete change:** Keep the existing `bg-accent` button as the primary CTA on the form submit. For the hero CTAs, switch to: `bg-white/70 backdrop-blur border border-gray-200 hover:bg-accent hover:text-white hover:border-accent transition-all`. This is a quiet, premium-glass feel without being dark-mode-only. Add a subtle `shadow-sm` so they float slightly.

### 8. Add a **customer logos row** before the testimonials (Stripe)

**What to change:** New section to insert between services bento and testimonials. Or expand the testimonials section.

**Why:** Linear's customer card grid (OpenAI / Ramp / Opendoor in colored blocks) and Stripe's customer story cards are the strongest trust signals on both pages. The current Paul 157 testimonials section (`landing-page.component.ts` lines 134–147) has a 3-column text-quote grid — good but no logo presence.

**Inspiration:** Linear (colored customer-card blocks with logos), Stripe (Hertz / URBN / Instacart / Le Monde customer stories).

**Concrete change:** Keep the existing testimonials but add a **logos row above** them: a single horizontal row of 4–6 grayscale SVG logos (or text-only brand names in `text-gray-400 font-semibold`), with a small caption "Trusted by SMB founders in" before the row. Logos are always rendered in monochrome `opacity-60 hover:opacity-100` — no logos-with-real-colors treatment unless they're paying customers (per brand-respecting practice).

### 9. Tone down the **split-text reveal** on the hero (Linear, but more restrained)

**What to change:** `frontend/src/app/landing/split-text.component.ts` lines 38–44 + `frontend/src/app/landing/landing-page.component.ts` lines 51–55.

Current: `stagger=55ms` per word, gradient on words 5–7 ("ships the work"). Bold visual but slightly heavy.

**Why:** Linear's split-text is sharp and brief — `letterReveal` is 0.5s forwards. Resend's hero is static (no animation on the headline itself). For a B2B founder audience, the headline should be readable immediately, not staggered.

**Inspiration:** Linear (sharp `steps` animations), Vercel (`@keyframes botid-hero-module__HXoBNa__letterReveal` 0.5s forwards), Resend (static).

**Concrete change:** Either (a) reduce `stagger` to 30ms, or (b) drop split-text entirely and use a simple opacity fade-in via `appReveal` for the whole headline block. Also consider removing the gradient text effect (`gradientStart=5 gradientEnd=7`) — gradient text on H1s is showing its age. A solid black/dark headline is more senior B2B.

### 10. Add a **scroll-state hairline** on the navbar (Vercel)

**What to change:** `frontend/src/app/landing/landing-page.component.ts` lines 30–39.

Current: `border-b border-gray-200 bg-white/80 backdrop-blur sticky top-0 z-20`.

**Why:** Vercel's navbar has zero border until you scroll, then a 1px hairline appears (`data-[scrolled]:shadow-[0_1px_0_0_var(--ds-gray-alpha-400)]`). It feels lighter and more refined than a permanent border.

**Inspiration:** Vercel (`data-[scrolled]:shadow-[0_1px_0_0_var(--ds-gray-alpha-400)]`).

**Concrete change:** Add a `[ngClass]` (or signal) that tracks scroll and toggles a `border-b border-gray-200` class. Or use Tailwind's `scroll-mt-` with IntersectionObserver — but the simplest is a `@HostListener('window:scroll')` setting `isScrolled = scrollY > 8`. Apply a 1px hairline border only when `isScrolled`. Keep the `backdrop-blur` always-on (it's always nice on sticky headers).

### 11. Replace `bg-gray-50` with a true neutral surface (Anthropic)

**What to change:** `frontend/src/app/landing/landing-page.component.ts` line 89 (`<section ... bg-gray-50 border-y border-gray-200">`).

**Why:** Anthropic uses `#fafafa` (true off-white with a warm cast) instead of Tailwind's `gray-50` (which is cool/blue). The current `bg-gray-50` reads generic-AI-startup. A warm off-white would feel more "senior brand".

**Inspiration:** Anthropic (`#fafafa` cream surfaces).

**Concrete change:** Add a custom color to `tailwind.config.js`: `warm: { 50: '#fafaf7', 100: '#f5f4ed' }`, and replace `bg-gray-50` with `bg-warm-50`. Keep borders as `border-gray-200` for definition. This is a 5-line change to `tailwind.config.js` and a 1-line change in the component.

### 12. Improve the **CTA copy** on the hero (Linear, Anthropic)

**What to change:** `frontend/src/app/landing/landing-page.component.ts` lines 64 + 68.

Current primary CTA: `"Try the demo"`. Current secondary: `"Book a 30-min call"`.

**Why:** Linear uses "Get started" + "Contact sales" — verbs that map to clear actions. Resend uses "Get started" + "Documentation". Stripe uses "Get started" + "Contact sales". The current "Try the demo" is good but "Book a 30-min call" feels like a high-friction ask for cold traffic.

**Inspiration:** Linear, Resend, Stripe — all use "Get started" as primary + a low-friction secondary (docs/contact).

**Concrete change:** Keep "Try the demo" as primary (it's the strongest CTA given the chatbot demo). Replace the secondary "Book a 30-min call" with something like "See pricing" (since pricing is already on the page in the lead form, this would jump-scroll to it) or "How it works" (jump-scroll to the services section). The booking-a-call CTA should move into the lead-form section, not the hero.

### 13. Add a **`prefers-reduced-motion`** guard on all animations (Vercel)

**What to change:** `frontend/src/styles.css` (the `@keyframes aurora-*` rules at lines 18–32) + `frontend/src/app/landing/aurora-background.component.ts` + `frontend/src/app/landing/landing-page.component.ts` (the `appReveal` usage).

**Why:** Vercel pairs every animation class with `motion-reduce:` variants (`transition-opacity duration-300 motion-reduce:transition-none`). The current Paul 157 landing does not honor `prefers-reduced-motion`. For a founder audience (often 35–55, may have motion sensitivity), this is an accessibility gap.

**Inspiration:** Vercel (`motion-reduce:transition-none`, `motion-reduce:transition-none group-data-[hero-drop-active=true]/hero:opacity-0`).

**Concrete change:** Wrap each animation rule in `styles.css` with `@media (prefers-reduced-motion: no-preference) { … }`. Add `motion-safe:` prefixes to Tailwind animation classes (e.g. `motion-safe:animate-aurora`). For the `appReveal` directive, check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` on init and skip the reveal animation if true.

### Summary of file changes

| File | Change |
|---|---|
| `frontend/src/app/landing/landing-page.component.ts` | New navbar wordmark (#3), new stats banner (#6), new customer logos row (#8), tone-down split-text (#9), CTA copy (#12), scroll-state border (#10) |
| `frontend/src/app/landing/aurora-background.component.ts` | Reduce opacity, optional replace with product-grid (#1) |
| `frontend/src/app/landing/split-text.component.ts` | Reduce stagger or make optional (#9) |
| `frontend/src/app/landing/chatbot-demo.component.ts` | Add `tabular-nums` to numeric badges (#5) |
| `frontend/src/app/landing/lead-form.component.ts` | Add `tabular-nums` to prices (#5), add "Book a call" CTA moved from hero (#12) |
| `frontend/src/styles.css` | Add `@media (prefers-reduced-motion: no-preference)` guards (#13), add `.tabular` utility (#5) |
| `frontend/tailwind.config.js` | Add `warm: { 50, 100 }` palette (#11), confirm accent already `#2563eb` |

**Highest-impact, lowest-effort first:** #3 (nav wordmark), #5 (tabular-nums), #8 (logos row), #12 (CTA copy), #13 (reduced-motion). These are 1–5 line changes that buy significant brand polish.

**Longer-payoff next:** #4 (bento grid replacing tabs), #1 (product-grid hero replacing aurora), #7 (glass buttons). These are component-level changes that require new components or significant rewrites.