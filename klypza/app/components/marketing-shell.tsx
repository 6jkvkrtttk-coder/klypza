import Link from "next/link";
import { NewsletterForm } from "./forms";

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return <div className="marketing-shell"><header className="marketing-header"><Link className="marketing-brand" href="/"><span className="brand-mark"><span/></span><b>KLYPZA</b></Link><nav aria-label="Main navigation"><Link href="/">Studio</Link><Link href="/pricing">Pricing</Link><Link href="/advertise">Advertise</Link><Link href="/about">About</Link><Link href="/faq">FAQ</Link></nav><Link className="header-cta" href="/">Start creating</Link></header><main className="marketing-main">{children}</main><footer className="marketing-footer"><NewsletterForm/><div className="footer-row"><Link className="marketing-brand" href="/"><span className="brand-mark"><span/></span><b>KLYPZA</b></Link><nav><Link href="/contact">Contact</Link><Link href="/safety">Safety</Link><Link href="/status">Status</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></nav><p>© {new Date().getFullYear()} Klypza. AI media, clearly labeled.</p></div></footer></div>;
}

export function PageHero({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
  return <section className="page-hero"><p className="kicker"><span>{eyebrow}</span> / Klypza</p><h1>{title}</h1><p>{lead}</p></section>;
}

export function ProsePage({ children }: { children: React.ReactNode }) {
  return <article className="prose-page">{children}</article>;
}
