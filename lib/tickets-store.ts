import "server-only";

import { randomUUID } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type {
  DashboardMetrics,
  TicketAnalysis,
  TicketDetailDto,
  TicketEvent,
  TicketInput,
  TicketRecord,
  TicketStatus,
  TicketSummaryDto,
} from "@/lib/types";

type TicketUpdate = Partial<
  Pick<
    TicketRecord,
    | "status"
    | "summary"
    | "category"
    | "priority"
    | "sentiment"
    | "confidence"
    | "suggestedAction"
    | "draftReply"
    | "draftSubject"
    | "sources"
    | "approvedAt"
    | "sentAt"
    | "emailId"
    | "model"
    | "degraded"
  >
>;

const nowMinus = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();

function seedTickets(): TicketRecord[] {
  return [
    {
      id: "e98f532a-2f16-46c1-945c-6359288d28db",
      ticketNumber: "RP-1048",
      name: "Maya Rodriguez",
      email: "maya@example.com",
      orderNumber: "ORD-78214",
      topic: "Delayed delivery",
      message: "My tracking has not changed for four days and the package was due yesterday.",
      category: "shipping",
      priority: "high",
      sentiment: "frustrated",
      summary: "Delivery is late and tracking has not updated for four days.",
      confidence: 94,
      suggestedAction: "Open a courier investigation and update the customer within one business day.",
      draftSubject: "Update on your delayed delivery",
      draftReply: "Hi Maya,\n\nI’m sorry your delivery is late. Your tracking has been unchanged long enough for us to open a courier investigation. We’ll review the shipment and update you within one business day.\n\nBest,\nCustomer Support",
      sources: [{ id: "shipping-delays", title: "Shipping and delivery times", excerpt: "Tracking that has not changed for three business days should be investigated." }],
      model: "gemini-3.5-flash",
      status: "pending_approval",
      demoTokenHash: "seed-only",
      createdAt: nowMinus(18),
      updatedAt: nowMinus(16),
      events: [
        { id: randomUUID(), action: "ticket_created", actor: "customer", detail: "Support request received", createdAt: nowMinus(18) },
        { id: randomUUID(), action: "ai_analyzed", actor: "ai", detail: "Classified as high-priority shipping issue", createdAt: nowMinus(16) },
      ],
    },
    {
      id: "b8dd8d8b-ce0e-4a4d-a79b-c254e188c67c",
      ticketNumber: "RP-1047",
      name: "Jordan Kim",
      email: "jordan@example.com",
      orderNumber: "ORD-78191",
      topic: "Duplicate charge",
      message: "I can see two completed charges for the same order on my card.",
      category: "billing",
      priority: "urgent",
      sentiment: "angry",
      summary: "Customer reports two completed card charges for one order.",
      confidence: 97,
      suggestedAction: "Verify both transactions and escalate the duplicate payment for refund review.",
      draftSubject: "We’re reviewing the duplicate charge",
      draftReply: "Hi Jordan,\n\nI’m sorry about the duplicate charge. We’ll verify both completed transactions and escalate the duplicate payment for refund review.\n\nBest,\nCustomer Support",
      sources: [{ id: "billing-help", title: "Billing and duplicate charges", excerpt: "Completed duplicate charges require verification and refund review." }],
      model: "gemini-3.5-flash",
      status: "approved",
      demoTokenHash: "seed-only",
      createdAt: nowMinus(54),
      updatedAt: nowMinus(12),
      approvedAt: nowMinus(12),
      events: [
        { id: randomUUID(), action: "ticket_created", actor: "customer", detail: "Support request received", createdAt: nowMinus(54) },
        { id: randomUUID(), action: "agent_approved", actor: "agent", detail: "Reply approved after billing review", createdAt: nowMinus(12) },
      ],
    },
    {
      id: "8ef0d848-fc44-491d-876b-c5cb81b067f1",
      ticketNumber: "RP-1046",
      name: "Alex Thompson",
      email: "alex@example.com",
      orderNumber: "ORD-78064",
      topic: "Return request",
      message: "The item is unused and I would like to return it within the return window.",
      category: "returns",
      priority: "normal",
      sentiment: "neutral",
      summary: "Customer wants to return an unused item within 30 days.",
      confidence: 93,
      suggestedAction: "Confirm delivery date and issue a return authorization.",
      draftSubject: "Your return request",
      draftReply: "Hi Alex,\n\nYour unused item may be returned within 30 days in its original packaging. We’ll confirm the delivery date and provide a return authorization.\n\nBest,\nCustomer Support",
      sources: [{ id: "returns-policy", title: "30-day returns policy", excerpt: "Unused items can be returned within 30 days of delivery." }],
      model: "gemini-3.5-flash",
      status: "sent",
      demoTokenHash: "seed-only",
      emailId: "seed-email",
      createdAt: nowMinus(132),
      updatedAt: nowMinus(92),
      approvedAt: nowMinus(96),
      sentAt: nowMinus(92),
      events: [
        { id: randomUUID(), action: "ticket_created", actor: "customer", detail: "Support request received", createdAt: nowMinus(132) },
        { id: randomUUID(), action: "email_sent", actor: "system", detail: "Approved reply delivered", createdAt: nowMinus(92) },
      ],
    },
  ];
}

const globalStore = globalThis as typeof globalThis & { replyPilotTickets?: TicketRecord[] };
const memoryTickets = globalStore.replyPilotTickets ?? seedTickets();
globalStore.replyPilotTickets = memoryTickets;

function ticketNumber() {
  return `RP-${Math.floor(1000 + Math.random() * 9000)}`;
}

function event(action: string, actor: TicketEvent["actor"], detail: string): TicketEvent {
  return { id: randomUUID(), action, actor, detail, createdAt: new Date().toISOString() };
}

function rowToTicket(row: Record<string, unknown>, events: TicketEvent[] = []): TicketRecord {
  return {
    id: String(row.id),
    ticketNumber: String(row.ticket_number),
    name: String(row.customer_name),
    email: String(row.customer_email),
    orderNumber: row.order_number ? String(row.order_number) : "",
    topic: String(row.topic),
    message: String(row.message),
    category: row.category as TicketRecord["category"],
    priority: row.priority as TicketRecord["priority"],
    sentiment: row.sentiment as TicketRecord["sentiment"],
    summary: String(row.summary),
    confidence: Number(row.confidence),
    suggestedAction: String(row.suggested_action),
    draftSubject: String(row.draft_subject),
    draftReply: String(row.draft_reply),
    sources: (row.sources ?? []) as TicketRecord["sources"],
    model: String(row.ai_model),
    degraded: Boolean(row.degraded),
    status: row.status as TicketStatus,
    demoTokenHash: String(row.demo_token_hash),
    emailId: row.email_id ? String(row.email_id) : undefined,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    approvedAt: row.approved_at ? String(row.approved_at) : undefined,
    sentAt: row.sent_at ? String(row.sent_at) : undefined,
    events,
  };
}

function toDto(ticket: TicketRecord): TicketDetailDto {
  const { demoTokenHash, website, ...safe } = ticket;
  void demoTokenHash;
  void website;
  return safe;
}

function toSummary(ticket: TicketRecord): TicketSummaryDto {
  const parts = ticket.name.trim().split(/\s+/);
  const customer = parts.length > 1 ? `${parts[0]} ${parts.at(-1)?.[0]}.` : parts[0];
  return {
    id: ticket.id,
    ticketNumber: ticket.ticketNumber,
    customer,
    category: ticket.category,
    priority: ticket.priority,
    sentiment: ticket.sentiment,
    summary: ticket.summary,
    status: ticket.status,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
  };
}

async function getEvents(ticketId: string): Promise<TicketEvent[]> {
  const db = getSupabaseAdmin();
  if (!db) return memoryTickets.find((item) => item.id === ticketId)?.events ?? [];
  const { data } = await db
    .from("replypilot_ticket_events")
    .select("id,action,actor,detail,created_at")
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true });
  return (data ?? []).map((item) => ({
    id: String(item.id),
    action: String(item.action),
    actor: item.actor as TicketEvent["actor"],
    detail: String(item.detail),
    createdAt: String(item.created_at),
  }));
}

export async function createTicketRecord(
  input: TicketInput,
  analysis: TicketAnalysis,
  demoTokenHash: string,
): Promise<TicketDetailDto> {
  const timestamp = new Date().toISOString();
  const initialEvents = [
    event("ticket_created", "customer", "Support request received"),
    event("knowledge_retrieved", "system", `${analysis.sources.length} knowledge sources matched`),
    event("ai_analyzed", "ai", `${analysis.model} prepared a grounded reply draft`),
  ];
  const record: TicketRecord = {
    ...input,
    ...analysis,
    id: randomUUID(),
    ticketNumber: ticketNumber(),
    status: "pending_approval",
    demoTokenHash,
    createdAt: timestamp,
    updatedAt: timestamp,
    events: initialEvents,
  };
  const db = getSupabaseAdmin();
  if (!db) {
    memoryTickets.unshift(record);
    return toDto(record);
  }

  const { data, error } = await db
    .from("replypilot_tickets")
    .insert({
      id: record.id,
      ticket_number: record.ticketNumber,
      customer_name: record.name,
      customer_email: record.email,
      order_number: record.orderNumber || null,
      topic: record.topic,
      message: record.message,
      category: record.category,
      priority: record.priority,
      sentiment: record.sentiment,
      summary: record.summary,
      confidence: record.confidence,
      suggested_action: record.suggestedAction,
      draft_subject: record.draftSubject,
      draft_reply: record.draftReply,
      sources: record.sources,
      ai_model: record.model,
      degraded: Boolean(record.degraded),
      status: record.status,
      demo_token_hash: record.demoTokenHash,
    })
    .select("*")
    .single();
  if (error || !data) throw new Error("Unable to save the support ticket.");
  await db.from("replypilot_ticket_events").insert(
    initialEvents.map((item) => ({
      id: item.id,
      ticket_id: record.id,
      action: item.action,
      actor: item.actor,
      detail: item.detail,
      created_at: item.createdAt,
    })),
  );
  return toDto(rowToTicket(data, initialEvents));
}

export async function getTicketWithToken(id: string, demoTokenHash: string) {
  const db = getSupabaseAdmin();
  if (!db) {
    const ticket = memoryTickets.find((item) => item.id === id && item.demoTokenHash === demoTokenHash);
    return ticket ? toDto(ticket) : null;
  }
  const { data } = await db
    .from("replypilot_tickets")
    .select("*")
    .eq("id", id)
    .eq("demo_token_hash", demoTokenHash)
    .maybeSingle();
  if (!data) return null;
  return toDto(rowToTicket(data, await getEvents(id)));
}

export async function updateTicketRecord(
  id: string,
  demoTokenHash: string,
  updates: TicketUpdate,
  activity: { action: string; actor: TicketEvent["actor"]; detail: string },
): Promise<TicketDetailDto | null> {
  const db = getSupabaseAdmin();
  const newEvent = event(activity.action, activity.actor, activity.detail);
  if (!db) {
    const index = memoryTickets.findIndex((item) => item.id === id && item.demoTokenHash === demoTokenHash);
    if (index < 0) return null;
    memoryTickets[index] = {
      ...memoryTickets[index],
      ...updates,
      updatedAt: new Date().toISOString(),
      events: [...memoryTickets[index].events, newEvent],
    };
    return toDto(memoryTickets[index]);
  }

  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (updates.status) payload.status = updates.status;
  if (updates.summary !== undefined) payload.summary = updates.summary;
  if (updates.category !== undefined) payload.category = updates.category;
  if (updates.priority !== undefined) payload.priority = updates.priority;
  if (updates.sentiment !== undefined) payload.sentiment = updates.sentiment;
  if (updates.confidence !== undefined) payload.confidence = updates.confidence;
  if (updates.suggestedAction !== undefined) payload.suggested_action = updates.suggestedAction;
  if (updates.draftReply !== undefined) payload.draft_reply = updates.draftReply;
  if (updates.draftSubject !== undefined) payload.draft_subject = updates.draftSubject;
  if (updates.sources !== undefined) payload.sources = updates.sources;
  if (updates.approvedAt !== undefined) payload.approved_at = updates.approvedAt;
  if (updates.sentAt !== undefined) payload.sent_at = updates.sentAt;
  if (updates.emailId !== undefined) payload.email_id = updates.emailId;
  if (updates.model !== undefined) payload.ai_model = updates.model;
  if (updates.degraded !== undefined) payload.degraded = updates.degraded;

  const { data } = await db
    .from("replypilot_tickets")
    .update(payload)
    .eq("id", id)
    .eq("demo_token_hash", demoTokenHash)
    .select("*")
    .maybeSingle();
  if (!data) return null;
  await db.from("replypilot_ticket_events").insert({
    id: newEvent.id,
    ticket_id: id,
    action: newEvent.action,
    actor: newEvent.actor,
    detail: newEvent.detail,
    created_at: newEvent.createdAt,
  });
  return toDto(rowToTicket(data, await getEvents(id)));
}

export async function listTicketSummaries(): Promise<TicketSummaryDto[]> {
  const db = getSupabaseAdmin();
  if (!db) return memoryTickets.slice(0, 20).map(toSummary);
  const { data, error } = await db
    .from("replypilot_tickets")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) throw new Error("Unable to load the support queue.");
  return (data ?? []).map((row) => toSummary(rowToTicket(row)));
}

export function calculateMetrics(tickets: TicketSummaryDto[]): DashboardMetrics {
  const total = tickets.length;
  const approved = tickets.filter((item) => ["approved", "sent"].includes(item.status)).length;
  const grouped = new Map<string, number>();
  tickets.forEach((item) => grouped.set(item.category, (grouped.get(item.category) ?? 0) + 1));
  return {
    total,
    pending: tickets.filter((item) => item.status === "pending_approval").length,
    urgent: tickets.filter((item) => item.priority === "urgent").length,
    sent: tickets.filter((item) => item.status === "sent").length,
    approvalRate: total ? Math.round((approved / total) * 100) : 0,
    estimatedMinutesSaved: total * 8,
    categories: [...grouped.entries()]
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value),
  };
}
