import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell, PageHero } from "@/app/components/marketing-shell";

export const metadata: Metadata = { title: "About Klypza", description: "Why Klypza is building an accessible, consent-aware AI media studio." };

export default function AboutPage() {
  return <MarketingShell><PageHero eyebrow="ABOUT" title="A small studio for big visual ideas." lead="Klypza brings images, concept clips, still-image motion and authorized likeness tools into one focused workspace."/><section className="manifesto-grid"><article><span>01</span><h2>Useful before perfect</h2><p>Klypza Canvas creates downloadable previews immediately. Connected OpenAI media models add full cloud rendering when configured.</p></article><article><span>02</span><h2>Consent is a feature</h2><p>The face workflow requires an explicit rights confirmation, blocks celebrity cloning, and labels AI-assisted likeness output.</p></article><article><span>03</span><h2>Transparent economics</h2><p>Ten starter credits make the product testable. Voluntary sponsor messages fund more credits without forced clicks.</p></article></section><section className="marketing-cta"><div><p className="kicker"><span>NEXT</span> / Your idea</p><h2>Make the first frame.</h2></div><Link href="/">Open the studio →</Link></section></MarketingShell>;
}
