import type { TicketPriority, TicketStatus } from "@/lib/types";

type BadgeValue = TicketPriority | TicketStatus | "ai" | "human" | "email";

const labels: Record<BadgeValue, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
  urgent: "Urgent",
  pending_approval: "Needs approval",
  approved: "Approved",
  rejected: "Needs revision",
  sent: "Sent",
  ai: "AI analyzed",
  human: "Human reviewed",
  email: "Email delivered",
};

export function StatusBadge({ value }: { value: BadgeValue }) {
  return <span className={`status-badge status-${value}`}>{labels[value]}</span>;
}
