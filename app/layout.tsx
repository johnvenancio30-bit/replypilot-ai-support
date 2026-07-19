import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: { default: "ReplyPilot — AI Customer Support Copilot", template: "%s | ReplyPilot" },
  description:
    "A live AI customer-support workflow that classifies tickets, grounds replies in company knowledge, requires human approval, and sends the final response.",
  keywords: ["AI automation", "customer support", "human in the loop", "portfolio", "ReplyPilot"],
  authors: [{ name: "John Venancio" }],
  openGraph: {
    title: "ReplyPilot — AI support, human approved",
    description: "See a real support ticket move from intake to a grounded, approved email reply.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jakarta.variable} data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
