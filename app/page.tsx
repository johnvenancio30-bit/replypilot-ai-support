import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Check,
  CircleCheckBig,
  MailCheck,
  MessageSquareText,
  Play,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Zap,
} from "lucide-react";
import { WorkflowVisual } from "@/components/workflow-visual";

const steps = [
  {
    icon: MessageSquareText,
    number: "1",
    title: "Customer asks",
    copy: "A customer sends a support question.",
  },
  {
    icon: Sparkles,
    number: "2",
    title: "AI prepares",
    copy: "ReplyPilot finds the right policy and drafts a reply.",
  },
  {
    icon: UserCheck,
    number: "3",
    title: "Human approves",
    copy: "A person checks and edits the answer.",
  },
  {
    icon: MailCheck,
    number: "4",
    title: "Email sends",
    copy: "Only the approved reply is sent.",
  },
];

const benefits = [
  {
    icon: Zap,
    title: "Faster replies",
    copy: "AI handles the first draft, so the team can respond sooner.",
  },
  {
    icon: BookOpenCheck,
    title: "Consistent answers",
    copy: "Every draft is based on the same company policies.",
  },
  {
    icon: ShieldCheck,
    title: "Human control",
    copy: "Nothing is sent until a person reviews and approves it.",
  },
];

export default function Home() {
  return (
    <>
      <section className="hero-section simple-hero">
        <div className="hero-orb hero-orb-one" aria-hidden="true" />
        <div className="hero-orb hero-orb-two" aria-hidden="true" />
        <div className="shell hero-grid simple-hero-grid">
          <div className="hero-copy simple-hero-copy">
            <span className="pill"><span className="pill-dot" /> LIVE PORTFOLIO DEMO</span>
            <h1>AI drafts customer replies. <em>You approve before they send.</em></h1>
            <p>
              A customer asks a question. ReplyPilot finds the right company policy,
              writes a reply, and waits for human approval before sending.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/demo">
                Try the live demo <ArrowRight size={18} />
              </Link>
              <a className="simple-video-link" href="#walkthrough">
                <Play size={16} /> Watch the 1-minute video
              </a>
            </div>
            <div className="trust-row simple-trust-row">
              <span><CircleCheckBig size={17} /> No account needed</span>
              <span><ShieldCheck size={17} /> Nothing sends automatically</span>
            </div>
          </div>
          <WorkflowVisual />
        </div>
      </section>

      <section className="benchmark-section" aria-labelledby="benchmark-title">
        <div className="shell benchmark-card">
          <div className="benchmark-intro">
            <span className="eyebrow">DEMO BENCHMARK</span>
            <h2 id="benchmark-title">Working proof, not a mockup.</h2>
            <p>Results from the live portfolio workflow.</p>
          </div>
          <div className="benchmark-metric">
            <strong>&lt; 10 sec</strong>
            <span>Typical AI preparation</span>
          </div>
          <div className="benchmark-metric">
            <strong>~8 min</strong>
            <span>Estimated work saved per ticket</span>
          </div>
          <div className="benchmark-metric">
            <strong>100%</strong>
            <span>Human approval before sending</span>
          </div>
        </div>
        <p className="shell benchmark-note">
          Portfolio demo benchmark. Time saved is an estimate, not client production data.
        </p>
      </section>

      <section className="section simple-how-section" id="how-it-works">
        <div className="shell">
          <div className="section-heading centered simple-section-heading">
            <span className="eyebrow">HOW IT WORKS</span>
            <h2>One question. Four clear steps.</h2>
            <p>The AI does the repetitive work. A person stays in control.</p>
          </div>
          <div className="simple-steps">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <article className="simple-step" key={step.number}>
                  <span className="simple-step-number">{step.number}</span>
                  <span className="simple-step-icon"><Icon /></span>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </article>
              );
            })}
          </div>
          <div className="center-action">
            <Link className="text-link" href="/demo">
              Try these steps yourself <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section simple-benefits-section">
        <div className="shell">
          <div className="section-heading centered simple-section-heading">
            <span className="eyebrow">WHY A BUSINESS USES IT</span>
            <h2>Better support without giving AI full control.</h2>
          </div>
          <div className="simple-benefits">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <article className="simple-benefit" key={benefit.title}>
                  <span><Icon /></span>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.copy}</p>
                </article>
              );
            })}
          </div>
          <p className="simple-details-link">
            Want the technical details? <Link href="/case-study">Read the case study <ArrowRight size={15} /></Link>
          </p>
        </div>
      </section>

      <section className="section walkthrough-section" id="walkthrough">
        <div className="shell walkthrough-grid simple-walkthrough-grid">
          <div className="video-frame">
            <video controls preload="metadata" poster="/replypilot-walkthrough-poster.webp">
              <source src="/replypilot-walkthrough.mp4" type="video/mp4" />
              <track kind="captions" src="/replypilot-walkthrough.vtt" srcLang="en" label="English" />
              Your browser does not support embedded video.
            </video>
            <span className="video-label"><Play size={15} /> 1-minute product walkthrough</span>
          </div>
          <div className="walkthrough-copy">
            <span className="eyebrow">WATCH THE DEMO</span>
            <h2>See a real ticket go from question to sent email.</h2>
            <p>The video shows the actual form, AI draft, human approval, and email delivery.</p>
            <ul className="check-list">
              <li><Check /> Real form and button clicks</li>
              <li><Check /> Real AI-generated reply</li>
              <li><Check /> Real human approval</li>
            </ul>
            <Link className="text-link" href="/demo">
              Try it yourself <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="final-cta simple-final-cta">
        <div className="shell final-cta-inner">
          <div>
            <span className="eyebrow">READY TO TRY IT?</span>
            <h2>Submit one support question. Approve one reply.</h2>
            <p>No account needed. Nothing sends without your approval.</p>
          </div>
          <div className="final-actions">
            <Link className="button button-light" href="/demo">
              Try the demo <ArrowRight size={18} />
            </Link>
            <a className="button button-ghost-light" href="mailto:johnvenancio30@gmail.com">Contact me</a>
          </div>
        </div>
        <div className="builder-signature">Built by <b>John Venancio</b> — AI Automation Developer</div>
      </section>
    </>
  );
}
