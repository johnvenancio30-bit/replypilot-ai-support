import type { Metadata } from "next";
import { DashboardClient } from "@/components/dashboard-client";

export const metadata: Metadata = {
  title: "Support Operations Dashboard",
  description: "See ReplyPilot prioritize tickets, track human approvals, and measure support automation outcomes.",
};

export default function DashboardPage() {
  return <div className="dashboard-page"><div className="shell"><DashboardClient /></div></div>;
}
