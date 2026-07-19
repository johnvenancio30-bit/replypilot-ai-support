import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Bot,
  Check,
  Database,
  FileSearch,
  GitBranch,
  MailCheck,
  MessageSquareText,
  ShieldCheck,
  UserCheck,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "ReplyPilot Case Study",
  description: "The product thinking, architecture, safeguards, and measurable business value behind ReplyPilot.",
};

export default function CaseStudyPage() {
  return (
    <>
      <section className="page-hero case-hero">
        <div className="shell"><span className="pill"><span className="pill-dot" /> PRODUCT CASE STUDY</span><h1>Building faster support without handing control to AI.</h1><p>ReplyPilot demonstrates how I translate a repetitive business process into a safe, measurable automation system.</p></div>
      </section>
      <section className="case-stats"><div className="shell"><span><strong>8 min</strong><small>estimated time saved per ticket</small></span><span><strong>4 steps</strong><small>from intake to delivery</small></span><span><strong>100%</strong><small>of replies human gated</small></span><span><strong>$0</strong><small>portfolio infrastructure cost</small></span></div></section>

      <section className="section case-section">
        <div className="shell case-intro-grid">
          <div><span className="eyebrow">THE CHALLENGE</span><h2>Support work is repetitive, but customer trust is not.</h2></div>
          <div><p>Agents repeatedly read long messages, identify the issue, search policy documents, and write nearly identical responses. A generic chatbot can make this faster—but may also invent policy or send the wrong message without oversight.</p><p>The goal was not to remove the agent. It was to give the agent a high-quality first draft with visible evidence and a clear decision point.</p></div>
        </div>
      </section>

      <section className="section case-flow-section">
        <div className="shell"><div className="section-heading centered"><span className="eyebrow">SOLUTION DESIGN</span><h2>One traceable flow from customer intent to approved action.</h2></div>
          <div className="case-flow">
            <FlowStep icon={MessageSquareText} number="01" title="Capture" copy="Validate the request and protect the public endpoint." />
            <ArrowRight />
            <FlowStep icon={FileSearch} number="02" title="Retrieve" copy="Find the policies most relevant to the customer’s words." />
            <ArrowRight />
            <FlowStep icon={Bot} number="03" title="Draft" copy="Return structured analysis and a grounded response." />
            <ArrowRight />
            <FlowStep icon={UserCheck} number="04" title="Approve" copy="Let a human edit, reject, regenerate, or approve." />
            <ArrowRight />
            <FlowStep icon={MailCheck} number="05" title="Deliver" copy="Send only the approved version and record the result." />
          </div>
        </div>
      </section>

      <section className="section decisions-section">
        <div className="shell"><div className="section-heading"><span className="eyebrow">KEY PRODUCT DECISIONS</span><h2>The details that make it feel like business software.</h2></div>
          <div className="decision-grid">
            <Decision icon={BookOpenCheck} title="Retrieval before generation" copy="ReplyPilot selects relevant policies first. The AI sees only those sources, and the reviewer sees them beside the draft." outcome="Reduces unsupported answers" />
            <Decision icon={ShieldCheck} title="Approval as a required state" copy="Sending is unavailable until a human approves the current draft. Editing remains available after generation." outcome="Keeps responsibility visible" />
            <Decision icon={GitBranch} title="Every action becomes an event" copy="Ticket creation, retrieval, AI drafting, approval, rejection, and delivery are written to an activity timeline." outcome="Creates an audit trail" />
            <Decision icon={Zap} title="Graceful AI fallback" copy="If the model is unavailable, a deterministic policy-based engine preserves the demo while clearly identifying degraded mode." outcome="Keeps the workflow reliable" />
          </div>
        </div>
      </section>

      <section className="section safety-section">
        <div className="shell safety-grid"><div><span className="eyebrow">SAFETY & SECURITY</span><h2>Public enough to demonstrate. Controlled enough to share.</h2><p>A portfolio demo needs different safeguards from a private internal tool. ReplyPilot limits abuse while keeping the most important interactions real.</p><ul className="case-checks"><li><Check /> Server-only Gemini, Supabase, and Resend secrets</li><li><Check /> One-time hashed token for each approval workflow</li><li><Check /> Rate-limited ticket creation and strict validation</li><li><Check /> Fixed portfolio email destination</li><li><Check /> Redacted customer details on the public dashboard</li></ul></div><div className="safety-code"><div><span>replypilot / workflow.policy</span><i>ENFORCED</i></div><pre>{"if (!humanApproved) {\n  return \"send blocked\";\n}\n\nconst reply = {\n  grounded: true,\n  editable: true,\n  audited: true,\n};"}</pre></div></div>
      </section>

      <section className="section stack-section"><div className="shell"><div className="section-heading centered"><span className="eyebrow">IMPLEMENTATION</span><h2>Purposeful tools, not unnecessary complexity.</h2></div><div className="stack-grid"><Stack icon={MessageSquareText} title="Next.js + TypeScript" copy="Accessible product UI and server route handlers" /><Stack icon={Bot} title="Gemini" copy="Structured ticket analysis and reply generation" /><Stack icon={Database} title="Supabase" copy="Postgres ticket records and event history" /><Stack icon={MailCheck} title="Resend" copy="Transactional delivery after approval" /></div></div></section>

      <section className="case-cta"><div className="shell"><div><span className="eyebrow">TRY THE RESULT</span><h2>The best proof is the working workflow.</h2><p>Submit a support request and make the final decision yourself.</p></div><Link className="button button-light" href="/demo">Run ReplyPilot <ArrowRight size={18} /></Link></div></section>
    </>
  );
}

function FlowStep({ icon: Icon, number, title, copy }: { icon: typeof Bot; number: string; title: string; copy: string }) { return <article><span>{number}</span><Icon /><h3>{title}</h3><p>{copy}</p></article>; }
function Decision({ icon: Icon, title, copy, outcome }: { icon: typeof Bot; title: string; copy: string; outcome: string }) { return <article><span><Icon /></span><h3>{title}</h3><p>{copy}</p><b><Check /> {outcome}</b></article>; }
function Stack({ icon: Icon, title, copy }: { icon: typeof Bot; title: string; copy: string }) { return <article><Icon /><div><h3>{title}</h3><p>{copy}</p></div></article>; }
