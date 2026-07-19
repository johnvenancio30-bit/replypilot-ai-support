# ReplyPilot

ReplyPilot is a working AI customer-support automation built to show how a business can reduce repetitive support work without giving AI permission to send unchecked messages.

A visitor submits a ticket, Gemini classifies it and retrieves relevant policies, a human reviews the grounded reply, and Resend delivers only the approved response. Supabase stores the ticket and its audit trail.

> Built by **John Venancio — AI Automation Developer**

## What it proves

- A complete business workflow, not a static AI mockup
- Structured AI analysis with a deterministic fallback
- Retrieval-grounded replies with visible source evidence
- A mandatory human approval checkpoint
- Real email delivery to a fixed, abuse-resistant demo inbox
- An operations dashboard with priority, status, and time-saved metrics
- Server-only secrets, row-level security, validation, rate limiting, and audit events

## Workflow

```text
Customer form
    ↓
Validate + rate limit
    ↓
Retrieve company knowledge → Gemini structured analysis
    ↓
Store ticket + evidence in Supabase
    ↓
Human edits and approves
    ↓
Resend delivers to the protected demo inbox
    ↓
Dashboard displays redacted operational data
```

## Stack

| Layer | Tool | Purpose |
| --- | --- | --- |
| Product | Next.js 16, React 19, TypeScript | Responsive experience and server APIs |
| AI | Google Gemini | Classification, prioritization, and reply drafting |
| Data | Supabase Postgres | Tickets, knowledge articles, and audit history |
| Email | Resend | Approved email delivery |
| Hosting | Vercel | Deployment and server-side environment variables |
| Quality | Vitest, Playwright, ESLint | Unit, workflow, responsive, and static checks |

All services can run on their free tiers for this personal portfolio demonstration. When external credentials are absent, the app stays usable through an in-memory store, a deterministic analysis engine, and simulated email delivery.

## Run locally

Requires Node.js 20.9 or newer.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

To use the real integrations, add these server-side variables:

```dotenv
NEXT_PUBLIC_APP_URL=http://localhost:3000
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.5-flash
RESEND_API_KEY=
RESEND_FROM_EMAIL=ReplyPilot Demo <onboarding@resend.dev>
CONTACT_TO_EMAIL=johnvenancio30@gmail.com
DEMO_TOKEN_SECRET=
```

Do not expose the Supabase service-role key or API keys with a `NEXT_PUBLIC_` prefix.

## Create the database

The schema, security policies, knowledge base, and demo records are in [`supabase/migrations/20260719080000_replypilot.sql`](supabase/migrations/20260719080000_replypilot.sql).

With the Supabase CLI linked to a project:

```bash
npx supabase db push
```

The migration enables row-level security and revokes browser roles. All database access happens in server routes through the service-role client.

## Quality checks

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
npm run qa:screenshot
```

The repository also runs type checking, linting, unit tests, and a production build in GitHub Actions.

## Demo safeguards

- All request bodies are validated with Zod.
- A honeypot and IP-based rate limiter reduce automated abuse.
- Ticket mutations require a random, hashed one-time demo token.
- The public dashboard returns redacted names and no email addresses or messages.
- Email is always redirected to John's fixed portfolio inbox.
- AI output is schema-validated; invalid or unavailable output uses the safe local engine.
- No reply can be sent before an explicit approval action is recorded.

More implementation detail is available in [`docs/architecture.md`](docs/architecture.md).

## Author

John Venancio  
AI Automation Developer  
[johnvenancio30@gmail.com](mailto:johnvenancio30@gmail.com)
