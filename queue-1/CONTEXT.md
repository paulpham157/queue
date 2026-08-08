# queue-1 Landing Context

Marketing landing page for Paul 157's three AI services, integrated into the queue-1
Angular frontend. The Spring Boot backend (Redis Streams lead fanout) is reused
unchanged for form submissions.

## Audience

**Founder**:
A small-business founder who builds and runs the company. Technical enough to
evaluate AI tools, but does not code day-to-day.
_Avoid_: SMB owner, entrepreneur, customer

**SMB**:
Small-to-medium business, 1–50 employees, founder-led. Targets US, AU, EU markets.
_Avoid_: Enterprise, startup, agency

## Services

**AI Agent**:
A hybrid agent that converses with users AND takes actions (sends email, queries
data, updates CRM). Sold as setup + managed monthly subscription.
_Avoid_: Chatbot, AI assistant

**Workflow Automation**:
Deterministic, repeatable processes connecting business tools (CRM, email, payments,
sheets). Sold as fully-managed monthly service — Paul 157 owns and maintains the
workflows.
_Avoid_: Zapier build, integration, automation script

**AI Data Analyst**:
Natural-language query over business data, returning charts and insights. Sold as
setup + managed insights subscription.
_Avoid_: BI tool, dashboard, analytics platform

## Sales motion

**Entry point**:
The first action a visitor can take on the landing page. Each service has its own
entry point to match the buying motion.
- AI Agent → interactive demo chatbot
- Workflow Automation → consultation form
- AI Data Analyst → sample dataset demo

**Demo**:
A scripted, on-page simulation of the service. Always labeled on the page with a
small disclaimer (e.g. "Demo — responses are pre-scripted"). Real LLM integration
is out of scope for the landing page.
_Avoid_: Preview, sandbox, trial

**Consultation form**:
A short intake form for Workflow Automation. Submits to `/leads` and fans out
through the existing Redis Streams pipeline (email + CRM + analytics).

## Pricing

**Starting at pricing**:
Each service shows a "Starting at $X" price on the landing page. Acts as a trust
signal and pre-qualifies visitors. Final quote is always custom — the displayed
price is a floor, not a guarantee.
_Avoid_: List price, MSRP, fixed pricing

## Tone

**Brand voice**:
Direct, senior, ROI-focused. Speaks to founders as a peer, not a vendor. Avoids
hype words ("revolutionary", "game-changing") and avoids jargon without context.
_Avoid_: Marketing-speak, buzzwords, founder hustle tone

## Project artefacts

**Lead**:
A captured contact from the consultation form. Already modelled in the Spring
Boot backend as `Lead` (name, email, company, source, message).
_Avoid_: Contact, signup, enquiry
