import Link from "next/link";
import { MessageSquareReply } from "lucide-react";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="brand" aria-label="ReplyPilot home">
      <span className="brand-mark" aria-hidden="true">
        <MessageSquareReply size={21} strokeWidth={2.25} />
      </span>
      {!compact && <span>ReplyPilot</span>}
    </Link>
  );
}
