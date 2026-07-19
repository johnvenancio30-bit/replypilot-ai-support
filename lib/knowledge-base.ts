import type { KnowledgeSource } from "@/lib/types";

export type KnowledgeArticle = KnowledgeSource & {
  keywords: string[];
  content: string;
};

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    id: "shipping-delays",
    title: "Shipping and delivery times",
    excerpt: "Orders process in 1–2 business days. Tracking updates can take 24 hours to appear.",
    keywords: ["shipping", "delivery", "late", "tracking", "package", "arrive", "courier"],
    content:
      "Orders normally process in 1–2 business days. Standard delivery takes 3–5 business days after dispatch. Tracking links may take up to 24 hours to show their first scan. If tracking has not changed for 3 business days, support should open a courier investigation.",
  },
  {
    id: "returns-policy",
    title: "30-day returns policy",
    excerpt: "Unused items can be returned within 30 days of delivery with their original packaging.",
    keywords: ["return", "exchange", "wrong size", "changed mind", "send back"],
    content:
      "Unused items in their original packaging may be returned within 30 days of delivery. Support provides a return authorization before the item is shipped back. Final-sale items are excluded unless they arrived damaged or incorrect.",
  },
  {
    id: "refund-timing",
    title: "Refund processing",
    excerpt: "Approved refunds usually reach the original payment method within 5–10 business days.",
    keywords: ["refund", "money back", "charged", "credit", "payment"],
    content:
      "After a return is inspected, approved refunds are issued to the original payment method. Banks normally post the credit within 5–10 business days. Support should not promise a specific bank posting date.",
  },
  {
    id: "damaged-orders",
    title: "Damaged or incorrect orders",
    excerpt: "Report damaged or incorrect items within seven days and include a clear photo.",
    keywords: ["damaged", "broken", "wrong item", "missing", "defective"],
    content:
      "Customers should report a damaged, defective, missing, or incorrect item within seven days of delivery. Ask for the order number and a clear photo of the item and package label. Support may offer a replacement or refund after verification.",
  },
  {
    id: "billing-help",
    title: "Billing and duplicate charges",
    excerpt: "Pending authorizations usually disappear in 3–5 business days; completed duplicate charges need review.",
    keywords: ["billing", "duplicate", "charged twice", "card", "invoice", "payment"],
    content:
      "A pending card authorization is not always a completed charge and usually disappears within 3–5 business days. If two charges are both completed, support should verify the order and escalate the duplicate payment for refund review.",
  },
  {
    id: "account-access",
    title: "Account access and password reset",
    excerpt: "Password reset links expire after 30 minutes and should be requested again if expired.",
    keywords: ["account", "login", "password", "reset", "email", "locked"],
    content:
      "Customers can request a password reset from the sign-in page. Reset links expire after 30 minutes. Support should never request a password or verification code. Repeated access failures require identity verification by an authorized agent.",
  },
];

const tokenize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);

export function findRelevantArticles(
  query: string,
  limit = 3,
  articles: KnowledgeArticle[] = knowledgeArticles,
): KnowledgeArticle[] {
  const tokens = new Set(tokenize(query));
  const ranked = articles
    .map((article) => {
      const keywordScore = article.keywords.reduce(
        (score, keyword) => score + (query.toLowerCase().includes(keyword) ? 5 : 0),
        0,
      );
      const contentScore = tokenize(`${article.title} ${article.content}`).reduce(
        (score, word) => score + (tokens.has(word) ? 1 : 0),
        0,
      );
      return { article, score: keywordScore + contentScore };
    })
    .sort((a, b) => b.score - a.score);

  const matches = ranked.filter((item) => item.score > 0).slice(0, limit);
  return (matches.length ? matches : ranked.slice(0, 1)).map((item) => item.article);
}
