import { hashDemoToken } from "@/lib/demo-token";
import { sendApprovedReply } from "@/lib/email";
import { getTicketWithToken, updateTicketRecord } from "@/lib/tickets-store";
import { sendTicketSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request, context: RouteContext<"/api/tickets/[id]/send">) {
  const token = request.headers.get("x-demo-token");
  if (!token) return Response.json({ error: "Demo access token required." }, { status: 401 });
  const hash = hashDemoToken(token);
  const { id } = await context.params;
  const ticket = await getTicketWithToken(id, hash);
  if (!ticket) return Response.json({ error: "Ticket not found." }, { status: 404 });
  if (ticket.status !== "approved") {
    return Response.json({ error: "The reply must be approved before it can be sent." }, { status: 409 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "The request body is not valid JSON." }, { status: 400 });
  }
  const parsed = sendTicketSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "The approved reply is invalid." }, { status: 400 });

  try {
    const delivery = await sendApprovedReply(ticket, parsed.data.draftReply);
    const updated = await updateTicketRecord(
      id,
      hash,
      {
        status: "sent",
        draftReply: parsed.data.draftReply,
        sentAt: new Date().toISOString(),
        emailId: delivery.id,
      },
      { action: "email_sent", actor: "system", detail: `Approved reply delivered to ${delivery.deliveredTo}` },
    );
    return Response.json({ ticket: updated, delivery });
  } catch {
    return Response.json({ error: "Email delivery failed. Please try again." }, { status: 502 });
  }
}
