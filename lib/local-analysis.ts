import { findRelevantArticles, knowledgeArticles, type KnowledgeArticle } from "@/lib/knowledge-base";
import type {
  TicketAnalysis,
  TicketCategory,
  TicketInput,
  TicketPriority,
  TicketSentiment,
} from "@/lib/types";

function includesAny(value: string, terms: string[]) {
  return terms.some((term) => value.includes(term));
}

export function createLocalAnalysis(
  input: TicketInput,
  availableArticles: KnowledgeArticle[] = knowledgeArticles,
): TicketAnalysis {
  const topic = input.topic.toLowerCase();
  const text = `${input.topic} ${input.message}`.toLowerCase();
  const articles = findRelevantArticles(text, 3, availableArticles);
  let category: TicketCategory = "other";
  if (includesAny(topic, ["bill", "charge", "payment", "invoice"])) category = "billing";
  else if (includesAny(topic, ["ship", "deliver", "tracking", "package", "late"])) category = "shipping";
  else if (includesAny(topic, ["return", "refund", "exchange"])) category = "returns";
  else if (includesAny(topic, ["login", "password", "account", "sign in"])) category = "account";
  else if (includesAny(topic, ["broken", "damaged", "wrong item", "defective"])) category = "product";
  else if (includesAny(text, ["bill", "charge", "payment", "invoice"])) category = "billing";
  else if (includesAny(text, ["ship", "deliver", "tracking", "package", "late"])) category = "shipping";
  else if (includesAny(text, ["return", "refund", "exchange"])) category = "returns";
  else if (includesAny(text, ["login", "password", "account", "sign in"])) category = "account";
  else if (includesAny(text, ["broken", "damaged", "wrong item", "defective"])) category = "product";

  let priority: TicketPriority = "normal";
  if (includesAny(text, ["urgent", "immediately", "fraud", "charged twice", "never arrived"])) priority = "urgent";
  else if (includesAny(text, ["angry", "damaged", "missing", "cancel", "late"])) priority = "high";
  else if (includesAny(text, ["question", "wondering", "when will"])) priority = "low";

  let sentiment: TicketSentiment = "neutral";
  if (includesAny(text, ["furious", "unacceptable", "angry", "terrible"])) sentiment = "angry";
  else if (includesAny(text, ["frustrated", "disappointed", "still waiting", "problem"])) sentiment = "frustrated";
  else if (includesAny(text, ["thank", "appreciate", "happy"])) sentiment = "positive";

  const firstName = input.name.split(/\s+/)[0];
  const primary = articles[0];
  const nextStep =
    category === "shipping"
      ? "Check the tracking history and open a courier investigation if there has been no scan for three business days."
      : category === "returns"
        ? "Confirm the delivery date and item condition, then provide a return authorization if eligible."
        : category === "billing"
          ? "Verify whether the charge is pending or completed, then escalate confirmed duplicates for refund review."
          : "Verify the account and order details before completing the requested change.";

  return {
    summary: `${input.name} needs help with ${input.topic.toLowerCase()}: ${input.message.slice(0, 150)}${input.message.length > 150 ? "…" : ""}`,
    category,
    priority,
    sentiment,
    confidence: articles.length > 1 ? 88 : 78,
    suggestedAction: nextStep,
    draftSubject: `Update on your ${input.topic.toLowerCase()} request`,
    draftReply: `Hi ${firstName},\n\nThanks for contacting us. I understand how important it is to get this resolved.\n\n${primary.content}\n\n${nextStep}\n\nPlease reply with any missing order details so we can take the next step for you.\n\nBest,\nCustomer Support`,
    sources: articles.map(({ id, title, excerpt }) => ({ id, title, excerpt })),
    model: "ReplyPilot deterministic fallback",
    degraded: true,
  };
}
