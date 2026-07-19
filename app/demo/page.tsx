import type { Metadata } from "next";
import { SupportDemo } from "@/components/support-demo";

export const metadata: Metadata = {
  title: "Live Support Workflow",
  description: "Submit a real demo ticket, review ReplyPilot’s grounded AI response, approve it, and send the email.",
};

export default function DemoPage() {
  return (
    <div className="demo-page">
      <section className="page-hero compact-page-hero">
        <div className="shell">
          <span className="pill"><span className="pill-dot" /> INTERACTIVE DEMO</span>
          <h1>Run the complete support workflow.</h1>
          <p>Submit a ticket, inspect the evidence, edit the response, approve it, and send a real portfolio email.</p>
        </div>
      </section>
      <section className="shell demo-shell"><SupportDemo /></section>
    </div>
  );
}
