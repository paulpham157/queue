// Shared types and mock data for landing prototype.
// Three different variants on the same product surface (Paul 157's 3 AI services).
// Everything in this file is mock — see docs/adr/0001-fe-demos-scripted-mocks.md.

export interface Service {
  key: 'agent' | 'workflow' | 'data';
  name: string;
  tagline: string;
  detail: string;
  startingPrice: string;
  cta: string;
  entryKind: 'demo' | 'form';
}

export const SERVICES: Service[] = [
  {
    key: 'agent',
    name: 'AI Agent',
    tagline: 'A hybrid agent that chats with your data and takes action.',
    detail:
      'Connect your tools once. Your agent reads incoming requests, decides what to do, ' +
      'and ships the work — sends replies, updates CRM, books meetings, queries the warehouse.',
    startingPrice: 'Starting at $2,500 setup + $500/mo',
    cta: 'Try the demo',
    entryKind: 'demo',
  },
  {
    key: 'workflow',
    name: 'Workflow Automation',
    tagline: 'Deterministic pipelines that run your ops 24/7.',
    detail:
      'Lead lands on your form. We enrich it, score it, push to HubSpot, post to Slack, ' +
      'and trigger a welcome sequence — without anyone touching a Zap.',
    startingPrice: 'Starting at $1,500/mo managed',
    cta: 'Tell us your stack',
    entryKind: 'form',
  },
  {
    key: 'data',
    name: 'AI Data Analyst',
    tagline: 'Ask your data anything. Get charts and answers in seconds.',
    detail:
      'Point us at your warehouse. Ask "why did revenue drop last Tuesday?" — get a chart, ' +
      'the SQL behind it, and a one-paragraph read on what happened.',
    startingPrice: 'Starting at $3,000 setup + $400/mo',
    cta: 'Try with sample data',
    entryKind: 'demo',
  },
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'We were paying three contractors to keep our Zapier mess alive. Paul replaced it with ' +
      'one managed pipeline and our lead response time dropped from 4 hours to 9 minutes.',
    name: 'Sarah Chen',
    role: 'Founder',
    company: 'Northwind Logistics, Austin TX',
  },
  {
    quote:
      'The AI agent books 60% of our discovery calls without a human in the loop. It escalates ' +
      'the other 40% with a perfect brief attached.',
    name: 'Marcus Webb',
    role: 'CEO',
    company: 'Loomstack, Sydney AU',
  },
  {
    quote:
      'I asked the data analyst "what changed in churn last quarter" and got back a chart, the ' +
      'SQL, and a paragraph naming the cohort. It paid for itself in a week.',
    name: 'Elena Rossi',
    role: 'Head of Growth',
    company: 'Fattoria, Milan IT',
  },
];

export interface MockBotReply {
  match: RegExp;
  reply: string;
}

export const BOT_REPLIES: MockBotReply[] = [
  {
    match: /price|cost|how much|pricing/i,
    reply:
      'AI Agent starts at $2,500 for setup (one-time) and $500/mo for managed. ' +
      'The setup covers tool integration, custom prompts, and one round of fine-tuning. ' +
      'Want me to walk you through what is included?',
  },
  {
    match: /integration|tools|connect|crm|hubspot|salesforce/i,
    reply:
      'We integrate with HubSpot, Salesforce, Pipedrive, Notion, Slack, Gmail, Stripe, ' +
      'and any tool with an API or webhook. Most setups need 3 to 5 integrations. ' +
      'What is in your current stack?',
  },
  {
    match: /how (does it|do you) work|what is this|explain/i,
    reply:
      'You give me a task in plain English. I plan the steps, call the right tools (CRM, ' +
      'email, sheets), and report back. For repetitive work I save the plan and run it ' +
      'automatically next time. Try asking: "send a welcome email to new HubSpot leads".',
  },
  {
    match: /time|how long|when/i,
    reply:
      'Typical setup takes 7 to 10 business days. Week 1: integrations and prompt design. ' +
      'Week 2: dry runs and handover. You get a working agent in production by end of week 2.',
  },
  {
    match: /book|call|meeting|demo|live/i,
    reply:
      'Great. Book a 30-minute strategy call here: cal.com/paul157/agent. ' +
      'I will look at your stack beforehand so we use the time on decisions, not introductions.',
  },
];

export const BOT_DEFAULT =
  'I can answer questions about pricing, integrations, timeline, or book a call. ' +
  'Try: "how does it work?" or "what does the setup include?"';

export interface DataRow {
  date: string;
  channel: string;
  orders: number;
  revenue: number;
}

export const SAMPLE_DATA: DataRow[] = [
  { date: '2026-01-05', channel: 'organic', orders: 142, revenue: 18420 },
  { date: '2026-01-12', channel: 'paid', orders: 89, revenue: 14210 },
  { date: '2026-01-19', channel: 'organic', orders: 156, revenue: 21100 },
  { date: '2026-01-26', channel: 'referral', orders: 67, revenue: 9890 },
  { date: '2026-02-02', channel: 'paid', orders: 94, revenue: 15600 },
  { date: '2026-02-09', channel: 'organic', orders: 134, revenue: 17800 },
  { date: '2026-02-16', channel: 'paid', orders: 71, revenue: 11200 },
  { date: '2026-02-23', channel: 'organic', orders: 98, revenue: 12400 },
];

export interface MockInsight {
  match: RegExp;
  insight: string;
  chart?: 'bar' | 'line';
}

export const INSIGHTS: MockInsight[] = [
  {
    match: /revenue|sales|money/i,
    insight:
      'Revenue peaked at $21,100 on 2026-01-19 (organic). Paid channel is more volatile: ' +
      'drops 30% week-over-week in Feb while organic stays flat.',
    chart: 'line',
  },
  {
    match: /channel|paid|organic|referral/i,
    insight:
      'Organic drives 58% of orders but only 49% of revenue — paid customers have 1.6x higher AOV. ' +
      'Recommend reallocating 15% of organic budget to paid.',
    chart: 'bar',
  },
  {
    match: /churn|customer|retention/i,
    insight:
      'Repeat customers are not in this dataset. To analyse churn we would need a customer_id ' +
      'column with order history — let me know what your warehouse has.',
  },
];