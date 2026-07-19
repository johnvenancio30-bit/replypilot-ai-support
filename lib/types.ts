export type TicketStatus =
  | "pending_approval"
  | "approved"
  | "rejected"
  | "sent";

export type TicketPriority = "low" | "normal" | "high" | "urgent";
export type TicketSentiment = "positive" | "neutral" | "frustrated" | "angry";
export type TicketCategory =
  | "shipping"
  | "returns"
  | "billing"
  | "product"
  | "account"
  | "other";

export type TicketInput = {
  name: string;
  email: string;
  orderNumber?: string;
  topic: string;
  message: string;
  website?: string;
};

export type KnowledgeSource = {
  id: string;
  title: string;
  excerpt: string;
};

export type TicketAnalysis = {
  summary: string;
  category: TicketCategory;
  priority: TicketPriority;
  sentiment: TicketSentiment;
  confidence: number;
  suggestedAction: string;
  draftSubject: string;
  draftReply: string;
  sources: KnowledgeSource[];
  model: string;
  degraded?: boolean;
};

export type TicketEvent = {
  id: string;
  action: string;
  actor: "customer" | "ai" | "agent" | "system";
  detail: string;
  createdAt: string;
};

export type TicketRecord = TicketInput &
  TicketAnalysis & {
    id: string;
    ticketNumber: string;
    status: TicketStatus;
    demoTokenHash: string;
    emailId?: string;
    createdAt: string;
    updatedAt: string;
    approvedAt?: string;
    sentAt?: string;
    events: TicketEvent[];
  };

export type TicketDetailDto = Omit<TicketRecord, "demoTokenHash" | "website">;

export type TicketSummaryDto = Pick<
  TicketRecord,
  | "id"
  | "ticketNumber"
  | "category"
  | "priority"
  | "sentiment"
  | "summary"
  | "status"
  | "createdAt"
  | "updatedAt"
> & {
  customer: string;
};

export type DashboardMetrics = {
  total: number;
  pending: number;
  urgent: number;
  sent: number;
  approvalRate: number;
  estimatedMinutesSaved: number;
  categories: Array<{ label: string; value: number }>;
};
