import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  Bot,
  Check,
  CircleCheckBig,
  Clock3,
  Database,
  Gauge,
  GitBranch,
  MailCheck,
  MessageSquareText,
  Play,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Zap,
} from "lucide-react";
import { WorkflowVisual } from "@/components/workflow-visual";

const outcomes = [
  { value: "< 10 sec", label: "AI analysis" },
  { value: "100%", label: "Human approved" },
  { value: "8 min", label: "Saved per ticket" },
];

const steps = [
  { icon: MessageSquareText, number: "01", title: "Receive", copy: "A customer submits a support request through the live form." },
  { icon: Sparkles, number: "02", title: "Understand", copy: "AI detects category, urgency, sentiment, and the customer’s real intent." },
  { icon: BookOpenCheck, number: "03", title: "Ground", copy: "ReplyPilot retrieves the most relevant company policies and drafts a sourced reply." },
  { icon: UserCheck, number: "04", title: "Approve & send", copy: "A human edits or approves the response before ReplyPilot delivers the email." },
];

export default function Home() {
  return (
    <>
      <section className="hero-section">
        <div className="hero-orb hero-orb-one" aria-hidden="true" />
        <div className="hero-orb hero-orb-two" aria-hidden="true" />
        <div className="shell hero-grid">
          <div className="hero-copy">
            <span className="pill"><span className="pill-dot" /> LIVE AI AUTOMATION PORTFOLIO</span>
            <h1>Customer support that moves fast. <em>Judgment stays human.</em></h1>
            <p>
              ReplyPilot turns incoming questions into prioritized, knowledge-grounded replies—then pauses for human approval before anything is sent.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/demo">Try the live workflow <ArrowRight size={18} /></Link>
              <a className="button button-secondary" href="#walkthrough"><Play size={17} /> Watch how it works</a>
            </div>
            <div className="trust-row">
              <span><ShieldCheck size={17} /> No auto-send</span>
              <span><BookOpenCheck size={17} /> Grounded answers</span>
              <span><CircleCheckBig size={17} /> Real email delivery</span>
            </div>
          </div>
          <WorkflowVisual />
        </div>
        <div className="shell outcome-bar">
          {outcomes.map((outcome) => <div key={outcome.label}><strong>{outcome.value}</strong><span>{outcome.label}</span></div>)}
          <p>Designed for teams that need speed <b>and</b> control.</p>
        </div>
      </section>

      <section className="section problem-section">
        <div className="shell">
          <div className="section-heading centered">
            <span className="eyebrow">THE BUSINESS PROBLEM</span>
            <h2>Support teams lose hours to work AI can prepare—but should not finish alone.</h2>
            <p>ReplyPilot handles the repetitive analysis while keeping accountability with a real person.</p>
          </div>
          <div className="bento-grid">
            <article className="bento-card bento-wide">
              <div className="card-icon"><Clock3 /></div>
              <div><span className="card-kicker">BEFORE</span><h3>Every ticket starts from zero</h3><p>Agents repeatedly identify the issue, search policies, and write similar answers by hand.</p></div>
              <div className="time-comparison"><span><i style={{ width: "92%" }} />Manual triage <b>12 min</b></span><span><i style={{ width: "18%" }} />ReplyPilot prep <b>under 1 min</b></span></div>
            </article>
            <article className="bento-card accent-card">
              <div className="card-icon"><Zap /></div><span className="card-kicker">AFTER</span><h3>One clear decision</h3><p>Review the evidence, adjust the reply, and approve.</p><div className="big-number">8<span>min saved</span></div>
            </article>
            <article className="bento-card">
              <div className="card-icon"><ShieldCheck /></div><span className="card-kicker">CONTROL</span><h3>Nothing sends blindly</h3><p>Every AI-generated reply stops at a visible approval checkpoint.</p><div className="approval-mini"><Check size={16} /> Human approval required</div>
            </article>
            <article className="bento-card bento-wide knowledge-card">
              <div><div className="card-icon"><BookOpenCheck /></div><span className="card-kicker">TRUST</span><h3>Answers use company knowledge</h3><p>Policies are retrieved first and displayed beside the draft, so the agent can verify what the AI used.</p></div>
              <div className="knowledge-stack"><span>Shipping & delivery <Check /></span><span>Returns policy <Check /></span><span>Billing guidance <Check /></span></div>
            </article>
          </div>
        </div>
      </section>

      <section className="section how-section" id="workflow">
        <div className="shell">
          <div className="section-heading split-heading">
            <div><span className="eyebrow">END-TO-END WORKFLOW</span><h2>Four steps from question to confident reply.</h2></div>
            <p>This is a real working automation, not a sequence of static screens.</p>
          </div>
          <div className="steps-grid">
            {steps.map((step) => {
              const Icon = step.icon;
              return <article className="step-card" key={step.number}><span className="step-number">{step.number}</span><Icon /><h3>{step.title}</h3><p>{step.copy}</p></article>;
            })}
          </div>
          <div className="center-action"><Link className="text-link" href="/demo">Run all four steps yourself <ArrowRight size={17} /></Link></div>
        </div>
      </section>

      <section className="section dashboard-showcase">
        <div className="shell showcase-grid">
          <div className="showcase-copy">
            <span className="eyebrow">OPERATIONS DASHBOARD</span>
            <h2>See what needs attention before customers feel ignored.</h2>
            <p>ReplyPilot turns every interaction into an operational signal: queue health, urgent work, approval progress, and time saved.</p>
            <ul className="feature-list">
              <li><Gauge /><span><b>Priority-first queue</b>Urgent and frustrated customers rise to the top.</span></li>
              <li><BarChart3 /><span><b>Business metrics</b>See approval rate, sent replies, and estimated time saved.</span></li>
              <li><GitBranch /><span><b>Auditable timeline</b>Every AI and human action is recorded.</span></li>
            </ul>
            <Link className="button button-secondary" href="/dashboard">Open the dashboard <ArrowRight size={17} /></Link>
          </div>
          <div className="dashboard-mock" aria-label="Dashboard analytics preview">
            <div className="mock-top"><span>Support overview</span><span className="live-indicator"><i /> Live</span></div>
            <div className="mock-metrics"><span><small>Open tickets</small><b>12</b><em>−18%</em></span><span><small>Needs approval</small><b>4</b><em>Focus</em></span><span><small>Time saved</small><b>96m</b><em>Today</em></span></div>
            <div className="mock-chart"><div className="chart-title"><b>Tickets by category</b><span>Today</span></div>{[["Shipping", 78], ["Returns", 56], ["Billing", 38], ["Account", 24]].map(([label, width]) => <div className="bar-row" key={label}><span>{label}</span><i><b style={{ width: `${width}%` }} /></i><strong>{Math.round(Number(width) / 10)}</strong></div>)}</div>
            <div className="mock-queue"><div><StatusIcon color="violet" /><span><b>Package tracking hasn’t updated</b><small>High priority · 2 min ago</small></span><em>Review</em></div><div><StatusIcon color="orange" /><span><b>Duplicate card charge</b><small>Urgent · 8 min ago</small></span><em>Approved</em></div><div><StatusIcon color="green" /><span><b>Return request</b><small>Normal · 16 min ago</small></span><em>Sent</em></div></div>
          </div>
        </div>
      </section>

      <section className="section architecture-section">
        <div className="shell">
          <div className="section-heading centered"><span className="eyebrow">BUILT AS A REAL SYSTEM</span><h2>A complete automation stack, connected end to end.</h2><p>Each tool has one clear job and every secret stays on the server.</p></div>
          <div className="architecture-flow">
            <TechNode icon={MessageSquareText} label="Next.js" sub="Customer experience" />
            <ArrowRight />
            <TechNode icon={Bot} label="Gemini" sub="Structured AI analysis" />
            <ArrowRight />
            <TechNode icon={Database} label="Supabase" sub="Tickets & history" />
            <ArrowRight />
            <TechNode icon={MailCheck} label="Resend" sub="Approved delivery" />
          </div>
          <div className="safety-strip"><ShieldCheck /><div><b>Portfolio-safe by design</b><span>Rate limited · Fixed demo inbox · No public database keys · Human approval required</span></div></div>
        </div>
      </section>

      <section className="section walkthrough-section" id="walkthrough">
        <div className="shell walkthrough-grid">
          <div className="video-frame">
            <video controls preload="metadata" poster="/replypilot-walkthrough-poster.webp">
              <source src="/replypilot-walkthrough.mp4" type="video/mp4" />
              <track kind="captions" src="/replypilot-walkthrough.vtt" srcLang="en" label="English" />
              Your browser does not support embedded video.
            </video>
            <span className="video-label"><Play size={15} /> 1-minute product walkthrough</span>
          </div>
          <div className="walkthrough-copy"><span className="eyebrow">SEE REAL ACTIONS</span><h2>Watch the full workflow, not a slideshow.</h2><p>The walkthrough shows the cursor filling the form, AI processing the ticket, a human editing and approving the draft, and the final email being sent.</p><ul className="check-list"><li><Check /> Visible cursor and form filling</li><li><Check /> Real approval interaction</li><li><Check /> Human-sounding explanation</li></ul><Link className="text-link" href="/demo">Skip the video and try it <ArrowRight size={17} /></Link></div>
        </div>
      </section>

      <section className="final-cta">
        <div className="shell final-cta-inner"><div><span className="eyebrow">READY TO EXPERIENCE IT?</span><h2>Send one ticket. See the whole system think.</h2><p>No account needed. Demo data only. Human approval always required.</p></div><div className="final-actions"><Link className="button button-light" href="/demo">Try ReplyPilot <ArrowRight size={18} /></Link><a className="button button-ghost-light" href="mailto:johnvenancio30@gmail.com">Contact me</a></div></div>
        <div className="builder-signature">Built by <b>John Venancio</b> — AI Automation Developer</div>
      </section>
    </>
  );
}

function TechNode({ icon: Icon, label, sub }: { icon: typeof Bot; label: string; sub: string }) {
  return <div className="tech-node"><span><Icon /></span><b>{label}</b><small>{sub}</small></div>;
}

function StatusIcon({ color }: { color: string }) { return <span className={`status-icon ${color}`}><CircleCheckBig size={16} /></span>; }
