# Frontend demos use scripted mocks with disclosure

The landing page demos for AI Agent (chatbot) and AI Data Analyst (sample dataset)
are implemented as hardcoded scripted responses on the Angular frontend, not as
real LLM calls. Each demo carries a small on-page disclaimer (e.g. "Demo — responses
are pre-scripted"). The only real backend call is the Workflow Automation
consultation form, which submits to `/leads` and fans out via Redis Streams.

**Why mocks:** Real LLM integration on the landing page would add API cost, latency,
secret management, and scope creep (prompt engineering, streaming, error handling).
A scripted demo is free, instant, deterministic, and good enough to communicate
capability to a first-time visitor. Real LLM integration belongs in a separate
product surface, not on a marketing landing page.

**Reversibility:** Switching from scripted to real LLM is a localised change in
two components (the chatbot demo and the data analyst demo). The disclosure text
and the layout would both need to change. Net cost: a day or two, not a quarter.
