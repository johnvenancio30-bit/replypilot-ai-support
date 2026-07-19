# ReplyPilot architecture

## Product boundary

ReplyPilot is intentionally scoped as a portfolio-safe support operations system. It demonstrates the high-value part of an AI support workflow—triage, knowledge retrieval, drafting, review, delivery, and measurement—without becoming an unrestricted public email relay.

## Request lifecycle

1. `POST /api/tickets` validates the customer ticket, checks the honeypot, and applies a request limit.
2. The server loads active knowledge articles from Supabase, or uses the bundled knowledge base when the database is unavailable.
3. Gemini returns structured JSON for category, priority, sentiment, confidence, suggested action, subject, and reply. The output is schema-validated.
4. If Gemini is missing, unavailable, or invalid, the deterministic local analyzer produces a grounded reply and marks it as degraded.
5. The ticket, evidence sources, hashed demo token, and initial audit events are stored in Supabase. The same repository interface uses an in-memory store for credential-free local use.
6. `PATCH /api/tickets/:id` requires the secret demo token and records approve, reject, or regenerate actions.
7. `POST /api/tickets/:id/send` checks that the ticket is approved before using Resend. The destination is server-configured and cannot be chosen by a visitor.
8. `GET /api/tickets` returns only redacted queue summaries and calculated business metrics.

## Data model

```text
replypilot_knowledge_articles
  id, title, excerpt, keywords, content, active

replypilot_tickets
  customer request
  AI classification and grounded draft
  approval/send status
  hashed demo token
  timestamps and provider identifiers

replypilot_ticket_events
  ticket_id → replypilot_tickets.id
  action, actor, detail, created_at
```

Row-level security is enabled on every public table. Anonymous and authenticated browser roles have no direct table privileges; server routes use the service role.

## Trust decisions

| Risk | Control |
| --- | --- |
| AI invents policy | Retrieve sources first, include them in the prompt, validate structured output, and show evidence to the reviewer |
| AI sends a bad reply | Enforce an `approved` database state before delivery |
| Public email relay abuse | Ignore the submitted address as a delivery destination and use a fixed portfolio inbox |
| Ticket tampering | Require a random token and compare only its SHA-256 hash |
| Secret leakage | Keep all integrations in server-only modules and environment variables |
| Dashboard privacy | Return initials/redacted surnames and operational summaries only |
| Provider outage | Fall back to local analysis, memory persistence, and simulated delivery |

## Business signal

The dashboard translates technical activity into outcomes a client can understand: tickets awaiting approval, urgent issues, replies sent, approval rate, category mix, and estimated handling time saved. The eight-minute estimate is intentionally labeled as an estimate rather than presented as measured production data.
