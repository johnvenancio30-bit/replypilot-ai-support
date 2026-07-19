"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  FileSearch,
  Filter,
  Inbox,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TimerReset,
  TrendingUp,
} from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import type { DashboardMetrics, TicketStatus, TicketSummaryDto } from "@/lib/types";

type QueuePayload = { tickets: TicketSummaryDto[]; metrics: DashboardMetrics };

const emptyMetrics: DashboardMetrics = {
  total: 0,
  pending: 0,
  urgent: 0,
  sent: 0,
  approvalRate: 0,
  estimatedMinutesSaved: 0,
  categories: [],
};

const categoryActions: Record<string, string> = {
  shipping: "Review tracking history and courier escalation criteria.",
  returns: "Confirm the delivery date and return eligibility.",
  billing: "Verify the transaction state before approving a refund review.",
  account: "Verify identity without requesting passwords or access codes.",
  product: "Check evidence and replacement eligibility.",
  other: "Review the customer context and choose the correct owner.",
};

export function DashboardClient() {
  const [payload, setPayload] = useState<QueuePayload>({ tickets: [], metrics: emptyMetrics });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | TicketStatus>("all");
  const [selectedId, setSelectedId] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const response = await fetch("/api/tickets", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Unable to load the queue.");
      setPayload(result);
      setSelectedId((current) => current || result.tickets[0]?.id || "");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to load the queue.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const tickets = useMemo(
    () => payload.tickets.filter((ticket) => filter === "all" || ticket.status === filter),
    [payload.tickets, filter],
  );
  const selected = payload.tickets.find((ticket) => ticket.id === selectedId) ?? tickets[0];
  const maxCategory = Math.max(...payload.metrics.categories.map((item) => item.value), 1);

  return (
    <div className="dashboard-app">
      <div className="dashboard-heading">
        <div><span className="eyebrow">LIVE OPERATIONS VIEW</span><h1>Support overview</h1><p>Prioritize the right conversation and keep every AI reply accountable.</p></div>
        <div className="dashboard-heading-actions"><span className="live-indicator"><i /> Live data</span><button className="button button-secondary button-small" type="button" onClick={() => { setLoading(true); void load(); }}><RefreshCw size={15} className={loading ? "spin" : ""} /> Refresh</button></div>
      </div>

      {error && <div className="notice error" role="alert">{error}</div>}
      <div className="metric-grid">
        <MetricCard icon={Inbox} label="Tickets handled" value={payload.metrics.total} detail="Current demo queue" tone="violet" />
        <MetricCard icon={Clock3} label="Needs approval" value={payload.metrics.pending} detail="Human decision required" tone="blue" />
        <MetricCard icon={AlertTriangle} label="Urgent" value={payload.metrics.urgent} detail="Review these first" tone="orange" />
        <MetricCard icon={TimerReset} label="Time saved" value={`${payload.metrics.estimatedMinutesSaved}m`} detail="At 8 minutes per ticket" tone="green" />
      </div>

      <div className="dashboard-grid">
        <section className="queue-panel">
          <div className="panel-heading"><div><h2>Support queue</h2><p>Customer details are redacted in the public view.</p></div><label><Filter size={15} /><select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)}><option value="all">All tickets</option><option value="pending_approval">Needs approval</option><option value="approved">Approved</option><option value="sent">Sent</option><option value="rejected">Needs revision</option></select></label></div>
          <div className="queue-table" role="list" aria-label="Support ticket queue">
            {loading ? <QueueSkeleton /> : tickets.length ? tickets.map((ticket) => (
              <button className={selected?.id === ticket.id ? "selected" : ""} key={ticket.id} type="button" onClick={() => setSelectedId(ticket.id)} role="listitem">
                <span className={`priority-line priority-${ticket.priority}`} />
                <span className="queue-customer"><i>{ticket.customer.slice(0, 2).toUpperCase()}</i><span><b>{ticket.customer}</b><small>{ticket.ticketNumber} · {relativeTime(ticket.createdAt)}</small></span></span>
                <span className="queue-summary"><b>{ticket.summary}</b><small>{ticket.category} · {ticket.sentiment}</small></span>
                <StatusBadge value={ticket.status} />
              </button>
            )) : <div className="empty-state"><Inbox /><b>No tickets in this view</b><p>Choose another filter or create a live demo ticket.</p><Link className="text-link" href="/demo">Create a ticket <ArrowRight size={16} /></Link></div>}
          </div>
        </section>

        <aside className="inspector-panel">
          {selected ? <>
            <div className="inspector-head"><div><span className="eyebrow">{selected.ticketNumber}</span><h2>{selected.customer}</h2></div><StatusBadge value={selected.priority} /></div>
            <div className="inspector-summary"><Sparkles /><div><small>AI SUMMARY</small><p>{selected.summary}</p></div></div>
            <div className="inspector-facts"><span><small>Category</small><b>{selected.category}</b></span><span><small>Sentiment</small><b>{selected.sentiment}</b></span><span><small>Status</small><b>{selected.status.replaceAll("_", " ")}</b></span><span><small>Updated</small><b>{relativeTime(selected.updatedAt)}</b></span></div>
            <div className="next-action"><FileSearch /><div><small>NEXT SAFE ACTION</small><p>{categoryActions[selected.category] ?? categoryActions.other}</p></div></div>
            <div className="mini-timeline"><h3>Workflow state</h3><TimelineItem done label="Ticket received" /><TimelineItem done label="AI analysis complete" /><TimelineItem done={["approved", "sent"].includes(selected.status)} active={selected.status === "pending_approval"} label="Human approval" /><TimelineItem done={selected.status === "sent"} active={selected.status === "approved"} label="Email delivered" last /></div>
            <Link className="button button-primary inspector-cta" href="/demo">Open a reviewable ticket <ArrowRight size={16} /></Link>
          </> : <div className="empty-state"><Inbox /><b>Select a ticket</b><p>Choose a ticket to inspect its workflow state.</p></div>}
        </aside>
      </div>

      <div className="analytics-grid">
        <section className="analytics-card">
          <div className="panel-heading"><div><h2>Tickets by category</h2><p>Where the support workload is coming from.</p></div><BarChart3 /></div>
          <div className="category-chart" role="img" aria-label="Bar chart of tickets by category">
            {payload.metrics.categories.map((item) => <div key={item.label}><span>{item.label}</span><i><b style={{ width: `${(item.value / maxCategory) * 100}%` }} /></i><strong>{item.value}</strong></div>)}
            {!payload.metrics.categories.length && <div className="chart-empty">No category data yet.</div>}
          </div>
        </section>
        <section className="analytics-card outcome-card">
          <div className="panel-heading"><div><h2>Automation outcomes</h2><p>Efficiency without removing human control.</p></div><TrendingUp /></div>
          <div className="outcome-metric"><strong>{payload.metrics.approvalRate}%</strong><span>approval rate</span></div>
          <div className="approval-meter"><i style={{ width: `${payload.metrics.approvalRate}%` }} /></div>
          <div className="outcome-details"><span><CheckCircle2 /> {payload.metrics.sent} replies delivered</span><span><ShieldCheck /> 100% human gated</span></div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, detail, tone }: { icon: typeof Inbox; label: string; value: string | number; detail: string; tone: string }) {
  return <article className="metric-card"><span className={`metric-icon ${tone}`}><Icon /></span><div><small>{label}</small><strong>{value}</strong><p>{detail}</p></div></article>;
}

function TimelineItem({ done, active, label, last }: { done?: boolean; active?: boolean; label: string; last?: boolean }) {
  return <div className={done ? "done" : active ? "active" : ""}><span>{done ? <CheckCircle2 /> : <Clock3 />}{!last && <i />}</span><b>{label}</b></div>;
}

function QueueSkeleton() { return <div className="queue-skeleton" aria-label="Loading tickets"><LoaderCircle className="spin" /><span>Loading the support queue…</span></div>; }

function relativeTime(value: string) {
  const minutes = Math.round((new Date(value).getTime() - Date.now()) / 60_000);
  if (Math.abs(minutes) < 60) return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(minutes, "minute");
  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(Math.round(minutes / 60), "hour");
}
