import {
  ArrowRight,
  Check,
  Clock3,
  FileSearch,
  MailCheck,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { StatusBadge } from "@/components/status-badge";

export function WorkflowVisual() {
  return (
    <div className="product-window hero-product" aria-label="ReplyPilot workflow preview">
      <div className="window-bar">
        <div className="window-dots" aria-hidden="true"><i /><i /><i /></div>
        <span>Ticket RP-1048</span>
        <span className="live-indicator"><i /> Live workflow</span>
      </div>
      <div className="workflow-preview">
        <aside className="preview-sidebar" aria-hidden="true">
          <span className="mini-logo"><MessageSquareText size={16} /></span>
          <span className="active"><FileSearch size={16} /></span>
          <span><Sparkles size={16} /></span>
          <span><MailCheck size={16} /></span>
        </aside>
        <div className="preview-main">
          <div className="preview-heading">
            <div>
              <span className="eyebrow">INBOX / SHIPPING</span>
              <h3>Package tracking hasn’t updated</h3>
            </div>
            <StatusBadge value="high" />
          </div>
          <div className="customer-message">
            <span className="avatar">MR</span>
            <div>
              <b>Maya Rodriguez</b>
              <p>My tracking hasn’t changed for four days and the package was due yesterday.</p>
            </div>
          </div>
          <div className="analysis-strip">
            <div><span>Category</span><strong>Shipping</strong></div>
            <div><span>Sentiment</span><strong>Frustrated</strong></div>
            <div><span>Confidence</span><strong>94%</strong></div>
          </div>
          <div className="draft-card">
            <div className="draft-card-head">
              <span><Sparkles size={16} /> Grounded reply</span>
              <span className="source-chip"><FileSearch size={13} /> 2 sources</span>
            </div>
            <p>Hi Maya, I’m sorry your delivery is late. Your tracking has been unchanged long enough for us to open a courier investigation...</p>
          </div>
          <div className="approval-row">
            <div className="approval-note"><ShieldCheck size={18} /><span><b>Human review required</b><small>Nothing sends automatically</small></span></div>
            <button type="button" tabIndex={-1}><Check size={16} /> Approve reply</button>
          </div>
        </div>
      </div>
      <div className="workflow-timeline" aria-hidden="true">
        <span className="complete"><MessageSquareText size={15} /> Received</span><ArrowRight size={14} />
        <span className="complete"><Sparkles size={15} /> Analyzed</span><ArrowRight size={14} />
        <span className="current"><Clock3 size={15} /> Approval</span><ArrowRight size={14} />
        <span><MailCheck size={15} /> Send</span>
      </div>
    </div>
  );
}
