import { createDemoToken } from "@/lib/demo-token";
import { checkRateLimit } from "@/lib/rate-limit";
import { analyzeTicket } from "@/lib/support-ai";
import {
  calculateMetrics,
  createTicketRecord,
  listTicketSummaries,
} from "@/lib/tickets-store";
import { ticketInputSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function GET() {
  try {
    const tickets = await listTicketSummaries();
    return Response.json({ tickets, metrics: calculateMetrics(tickets) });
  } catch {
    return Response.json({ error: "The support queue is temporarily unavailable." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key = forwarded || request.headers.get("x-real-ip") || "local-demo";
  const rateLimit = checkRateLimit(key);
  if (!rateLimit.allowed) {
    return Response.json(
      { error: "Demo limit reached. Please wait a few minutes and try again." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "The request body is not valid JSON." }, { status: 400 });
  }
  const parsed = ticketInputSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Please check the support request." },
      { status: 400 },
    );
  }
  if (parsed.data.website) return Response.json({ error: "Unable to process this request." }, { status: 400 });

  try {
    const { token, hash } = createDemoToken();
    const analysis = await analyzeTicket(parsed.data);
    const ticket = await createTicketRecord(parsed.data, analysis, hash);
    return Response.json({ ticket, token }, { status: 201 });
  } catch {
    return Response.json(
      { error: "ReplyPilot could not create the ticket. Please try again." },
      { status: 500 },
    );
  }
}
