import { hashDemoToken } from "@/lib/demo-token";
import { analyzeTicket } from "@/lib/support-ai";
import { getTicketWithToken, updateTicketRecord } from "@/lib/tickets-store";
import { ticketActionSchema } from "@/lib/validation";

export const runtime = "nodejs";

function tokenHash(request: Request) {
  const token = request.headers.get("x-demo-token");
  return token ? hashDemoToken(token) : null;
}

export async function GET(request: Request, context: RouteContext<"/api/tickets/[id]">) {
  const hash = tokenHash(request);
  if (!hash) return Response.json({ error: "Demo access token required." }, { status: 401 });
  const { id } = await context.params;
  const ticket = await getTicketWithToken(id, hash);
  if (!ticket) return Response.json({ error: "Ticket not found." }, { status: 404 });
  return Response.json({ ticket });
}

export async function PATCH(request: Request, context: RouteContext<"/api/tickets/[id]">) {
  const hash = tokenHash(request);
  if (!hash) return Response.json({ error: "Demo access token required." }, { status: 401 });
  const { id } = await context.params;
  const current = await getTicketWithToken(id, hash);
  if (!current) return Response.json({ error: "Ticket not found." }, { status: 404 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "The request body is not valid JSON." }, { status: 400 });
  }
  const parsed = ticketActionSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "The requested action is invalid." }, { status: 400 });

  if (parsed.data.action === "regenerate") {
    const analysis = await analyzeTicket({
      name: current.name,
      email: current.email,
      orderNumber: current.orderNumber,
      topic: current.topic,
      message: current.message,
    });
    const ticket = await updateTicketRecord(
      id,
      hash,
      { ...analysis, status: "pending_approval" },
      { action: "draft_regenerated", actor: "ai", detail: `${analysis.model} generated a new grounded draft` },
    );
    return Response.json({ ticket });
  }

  const isApprove = parsed.data.action === "approve";
  const ticket = await updateTicketRecord(
    id,
    hash,
    {
      status: isApprove ? "approved" : "rejected",
      draftReply: parsed.data.draftReply ?? current.draftReply,
      approvedAt: isApprove ? new Date().toISOString() : undefined,
    },
    {
      action: isApprove ? "agent_approved" : "agent_rejected",
      actor: "agent",
      detail: isApprove ? "Human operator reviewed and approved the reply" : "Human operator rejected the reply for revision",
    },
  );
  return Response.json({ ticket });
}
