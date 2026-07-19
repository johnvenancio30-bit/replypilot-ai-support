import Link from "next/link";
import { ArrowUpRight, Code2, Mail } from "lucide-react";
import { Brand } from "@/components/brand";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <Brand />
          <p className="footer-copy">
            AI-powered customer support with human judgment built into every reply.
          </p>
        </div>
        <div className="footer-links">
          <Link href="/demo">Live demo</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/case-study">Case study</Link>
        </div>
        <div className="footer-links">
          <a href="mailto:johnvenancio30@gmail.com">
            <Mail size={16} /> Contact John
          </a>
          <a href="https://github.com/johnvenancio30-bit/replypilot-ai-support" target="_blank" rel="noreferrer">
            <Code2 size={16} /> GitHub
          </a>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>Built by John Venancio — AI Automation Developer</span>
        <a href="mailto:johnvenancio30@gmail.com">
          Available for projects <ArrowUpRight size={15} />
        </a>
      </div>
    </footer>
  );
}
