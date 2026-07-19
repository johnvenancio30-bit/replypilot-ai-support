import Link from "next/link";
import { Menu } from "lucide-react";
import { Brand } from "@/components/brand";

const nav = [
  { href: "/demo", label: "Live demo" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/case-study", label: "Case study" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {nav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link className="button button-primary button-small desktop-cta" href="/demo">
            Try the workflow
          </Link>
          <details className="mobile-menu">
            <summary aria-label="Open navigation menu">
              <Menu size={22} />
            </summary>
            <nav aria-label="Mobile navigation">
              {nav.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
