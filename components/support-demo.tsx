"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Check,
  CheckCircle2,
  Clock3,
  FileSearch,
  LoaderCircle,
  MailCheck,
  MessageSquareText,
  PencilLine,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  ThumbsDown,
  UserCheck,
} from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import type { TicketDetailDto, TicketInput } from "@/lib/types";

type Phase = "form" | "analyzing" | "review" | "approved" | "sending" | "sent";

const scenarios: Array<{ label: string; data: TicketInput }> = [
  {
    label: "Delayed delivery",
    data: {
      name: "John Venancio",
      email: "johnvenancio30@gmail.com",
      orderNumber: "ORD-78214",
      topic: "Delayed delivery",
      message: "My tracking has not changed for four business days and the package was due yesterday. Can you please help me find it?",
    },
  },
  {
    label: "Duplicate charge",
    data: {
      name: "John Venancio",
      email: "johnvenancio30@gmail.com",
      orderNumber: "ORD-78191",
      topic: "Duplicate charge",
      message: "I can see two completed charges for the same order on my card. This is urgent and I need the duplicate payment reviewed.",
    },
  },
  {
    label: "Return request",
    data: {
      name: "John Venancio",
      email: "johnvenancio30@gmail.com",
      orderNumber: "ORD-78064",
      topic: "Return request",
      message: "The item is unused, still in its original packaging, and was delivered twelve days ago. I would like to return it.",
    },
  },
];

const emptyInput: TicketInput = {
  name: "",
  email: "",
  orderNumber: "",
  topic: "",
  message: "",
  website: "",
};

const progress = [
  { title: "Reading the ticket", copy: "Extracting the customer’s request", icon: MessageSquareText },
  { title: "Finding trusted knowledge", copy: "Matching policies and support guidance", icon: FileSearch },
  { title: "Preparing a safe reply", copy: "Creating a structured draft for review", icon: Sparkles },
];

export function SupportDemo() {
  const [input, setInput] = useState<TicketInput>(emptyInput);
  const [phase, setPhase] = useState<Phase>("form");
  const [analysisStep, setAnalysisStep] = useState(0);
  const [ticket, setTicket] = useState<TicketDetailDto | null>(null);
  const [token, setToken] = useState("");
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [deliveredTo, setDeliveredTo] = useState("");

  const update = (field: keyof TicketInput, value: string) => setInput((current) => ({ ...current, [field]: value }));

  async function submitTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setPhase("analyzing");
    setAnalysisStep(0);
    const timers = [
      window.setTimeout(() => setAnalysisStep(1), 650),
      window.setTimeout(() => setAnalysisStep(2), 1400),
    ];
    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Unable to create the ticket.");
      setTicket(result.ticket);
      setToken(result.token);
      setDraft(result.ticket.draftReply);
      sessionStorage.setItem("replypilot-demo", JSON.stringify({ id: result.ticket.id, token: result.token }));
      setAnalysisStep(2);
      window.setTimeout(() => setPhase("review"), 350);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to create the ticket.");
      setPhase("form");
    } finally {
      timers.forEach(window.clearTimeout);
    }
  }

  async function runAction(action: "approve" | "reject" | "regenerate") {
    if (!ticket || !token) return;
    setError("");
    setNotice("");
    setActionLoading(action);
    try {
      const response = await fetch(`/api/tickets/${ticket.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json", "x-demo-token": token },
        body: JSON.stringify({ action, draftReply: draft }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Unable to update the ticket.");
      setTicket(result.ticket);
      setDraft(result.ticket.draftReply);
      if (action === "approve") {
        setPhase("approved");
        setNotice("Human review recorded. The reply is now ready to send.");
      } else if (action === "reject") {
        setNotice("Reply rejected. Edit the draft or regenerate it before approval.");
      } else {
        setNotice("A new grounded draft is ready for your review.");
        setPhase("review");
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update the ticket.");
    } finally {
      setActionLoading("");
    }
  }

  async function sendReply() {
    if (!ticket || !token) return;
    setError("");
    setPhase("sending");
    try {
      const response = await fetch(`/api/tickets/${ticket.id}/send`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-demo-token": token },
        body: JSON.stringify({ draftReply: draft }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Unable to send the reply.");
      setTicket(result.ticket);
      setDeliveredTo(result.delivery.deliveredTo);
      setPhase("sent");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to send the reply.");
      setPhase("approved");
    }
  }

  function reset() {
    setInput(emptyInput);
    setTicket(null);
    setToken("");
    setDraft("");
    setError("");
    setNotice("");
    setDeliveredTo("");
    setPhase("form");
    sessionStorage.removeItem("replypilot-demo");
  }

  if (phase === "analyzing") {
    return (
      <div className="demo-processing" role="status" aria-live="polite">
        <div className="processing-orbit"><Sparkles /><i /><i /></div>
        <span className="eyebrow">REPLYPILOT IS WORKING</span>
        <h2>Turning one message into a confident next step.</h2>
        <div className="processing-steps">
          {progress.map((item, index) => {
            const Icon = item.icon;
            const state = index < analysisStep ? "done" : index === analysisStep ? "active" : "waiting";
            return <div className={state} key={item.title}><span>{state === "done" ? <Check /> : <Icon />}</span><div><b>{item.title}</b><small>{item.copy}</small></div>{state === "active" && <LoaderCircle className="spin" />}</div>;
          })}
        </div>
        <p>Usually complete in a few seconds. The reply will not be sent automatically.</p>
      </div>
    );
  }

  if (ticket && phase !== "form") {
    return (
      <div className="review-workspace">
        <div className="workflow-progress" aria-label="Workflow progress">
          <ProgressItem done icon={MessageSquareText} label="Received" />
          <i />
          <ProgressItem done icon={Sparkles} label="Analyzed" />
          <i />
          <ProgressItem done={["approved", "sending", "sent"].includes(phase)} active={phase === "review"} icon={UserCheck} label="Approve" />
          <i />
          <ProgressItem done={phase === "sent"} active={phase === "approved" || phase === "sending"} icon={MailCheck} label="Send" />
        </div>

        {phase === "sent" ? (
          <div className="send-success" role="status">
            <div className="success-icon"><MailCheck /></div>
            <span className="eyebrow">WORKFLOW COMPLETE</span>
            <h2>The approved reply was sent.</h2>
            <p>ReplyPilot recorded every step and delivered the portfolio email to <b>{deliveredTo}</b>.</p>
            <div className="success-receipt">
              <span><small>Ticket</small><b>{ticket.ticketNumber}</b></span>
              <span><small>Status</small><StatusBadge value="sent" /></span>
              <span><small>Delivery</small><b>Resend API</b></span>
            </div>
            <div className="success-actions"><Link className="button button-primary" href="/dashboard">See the dashboard <ArrowRight size={17} /></Link><button className="button button-secondary" type="button" onClick={reset}>Run another ticket</button></div>
          </div>
        ) : (
          <div className="review-grid">
            <aside className="ticket-context">
              <div className="context-heading"><div><span className="eyebrow">{ticket.ticketNumber}</span><h2>{ticket.topic}</h2></div><StatusBadge value={ticket.priority} /></div>
              <div className="customer-card"><span>{initials(ticket.name)}</span><div><b>{ticket.name}</b><small>{ticket.email}</small></div></div>
              <div className="message-card"><small>CUSTOMER MESSAGE</small><p>{ticket.message}</p>{ticket.orderNumber && <span>Order {ticket.orderNumber}</span>}</div>
              <div className="analysis-facts"><div><small>Category</small><b>{ticket.category}</b></div><div><small>Sentiment</small><b>{ticket.sentiment}</b></div><div><small>Confidence</small><b>{ticket.confidence}%</b></div><div><small>Status</small><StatusBadge value={ticket.status} /></div></div>
              <div className="recommendation"><Sparkles /><div><small>RECOMMENDED ACTION</small><p>{ticket.suggestedAction}</p></div></div>
              <div className="source-panel"><div className="panel-title"><span><BookOpenCheck /> Knowledge used</span><b>{ticket.sources.length}</b></div>{ticket.sources.map((source) => <article key={source.id}><FileSearch /><div><b>{source.title}</b><p>{source.excerpt}</p></div></article>)}</div>
            </aside>
            <section className="reply-editor">
              <div className="editor-heading"><div><span className="eyebrow">AI-DRAFTED RESPONSE</span><h2>Review before sending</h2></div><span className="model-chip"><Sparkles /> {ticket.degraded ? "Fallback engine" : ticket.model}</span></div>
              <div className="subject-line"><span>Subject</span><b>{ticket.draftSubject}</b></div>
              <label htmlFor="draft-reply">Approved customer reply</label>
              <textarea id="draft-reply" value={draft} onChange={(event) => setDraft(event.target.value)} rows={14} />
              <div className="editor-meta"><span><PencilLine /> You can edit every word</span><span>{draft.length} characters</span></div>
              {notice && <div className="notice success" role="status"><CheckCircle2 /> {notice}</div>}
              {error && <div className="notice error" role="alert">{error}</div>}
              <div className="human-checkpoint"><ShieldCheck /><div><b>Human checkpoint</b><p>ReplyPilot cannot send this response until you approve it.</p></div></div>
              <div className="editor-actions">
                {phase === "approved" || phase === "sending" ? (
                  <>
                    <button className="button button-secondary" type="button" onClick={() => setPhase("review")} disabled={phase === "sending"}><PencilLine size={17} /> Edit again</button>
                    <button className="button button-primary" type="button" onClick={sendReply} disabled={phase === "sending"}>{phase === "sending" ? <><LoaderCircle className="spin" /> Sending email…</> : <><Send size={17} /> Send approved reply</>}</button>
                  </>
                ) : (
                  <>
                    <button className="icon-action reject" type="button" onClick={() => runAction("reject")} disabled={Boolean(actionLoading)}><ThumbsDown size={17} /> Reject</button>
                    <button className="icon-action" type="button" onClick={() => runAction("regenerate")} disabled={Boolean(actionLoading)}>{actionLoading === "regenerate" ? <LoaderCircle className="spin" /> : <RefreshCw size={17} />} Regenerate</button>
                    <button className="button button-primary" type="button" onClick={() => runAction("approve")} disabled={Boolean(actionLoading)}>{actionLoading === "approve" ? <LoaderCircle className="spin" /> : <Check size={17} />} Approve reply</button>
                  </>
                )}
              </div>
              <p className="portfolio-safety"><ShieldCheck /> Portfolio safety: live emails go to John’s fixed demo inbox to prevent abuse.</p>
            </section>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="demo-form-layout">
      <aside className="demo-guide">
        <span className="eyebrow">STEP 1 OF 4</span>
        <h2>Choose a customer question.</h2>
        <p>For the fastest demo, select a sample below. ReplyPilot fills the form for you.</p>
        <div className="scenario-list">
          <span>QUICK SCENARIOS</span>
          {scenarios.map((scenario) => <button type="button" key={scenario.label} onClick={() => setInput({ ...emptyInput, ...scenario.data })}><MessageSquareText /><span><b>{scenario.label}</b><small>Fill the form automatically</small></span><ArrowRight /></button>)}
        </div>
        <div className="guide-promise"><ShieldCheck /><div><b>What happens next</b><p>AI prepares a reply. You review it before anything sends.</p></div></div>
      </aside>
      <form className="ticket-form" onSubmit={submitTicket}>
        <div className="form-heading"><div><span>New support request</span><small>All fields marked * are required</small></div><span className="secure-label"><ShieldCheck /> Demo-safe</span></div>
        {error && <div className="notice error" role="alert">{error}</div>}
        <div className="form-grid two-columns">
          <Field label="Customer name" required><input autoComplete="name" value={input.name} onChange={(event) => update("name", event.target.value)} placeholder="e.g. John Venancio" required minLength={2} /></Field>
          <Field label="Email address" required><input type="email" autoComplete="email" value={input.email} onChange={(event) => update("email", event.target.value)} placeholder="you@example.com" required /></Field>
        </div>
        <div className="form-grid two-columns">
          <Field label="Order number" hint="Optional"><input value={input.orderNumber} onChange={(event) => update("orderNumber", event.target.value)} placeholder="ORD-78214" /></Field>
          <Field label="Topic" required><select value={input.topic} onChange={(event) => update("topic", event.target.value)} required><option value="">Select a topic</option><option>Delayed delivery</option><option>Return request</option><option>Duplicate charge</option><option>Damaged item</option><option>Account access</option><option>Product question</option></select></Field>
        </div>
        <Field label="How can we help?" required hint={`${input.message.length}/2000`}><textarea value={input.message} onChange={(event) => update("message", event.target.value)} placeholder="Describe the issue and what outcome you need…" rows={6} minLength={20} maxLength={2000} required /></Field>
        <label className="honeypot" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={input.website} onChange={(event) => update("website", event.target.value)} /></label>
        <div className="form-submit"><p><Clock3 /> Analysis usually takes a few seconds</p><button className="button button-primary" type="submit">Analyze support ticket <ArrowRight size={17} /></button></div>
      </form>
    </div>
  );
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return <label className="field"><span><b>{label}{required && <em>*</em>}</b>{hint && <small>{hint}</small>}</span>{children}</label>;
}

function ProgressItem({ done, active, icon: Icon, label }: { done?: boolean; active?: boolean; icon: typeof Check; label: string }) {
  return <span className={done ? "done" : active ? "active" : ""}><i>{done ? <Check /> : <Icon />}</i>{label}</span>;
}

function initials(name: string) { return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(); }
