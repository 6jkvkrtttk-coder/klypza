import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell, PageHero } from "@/app/components/marketing-shell";

export const metadata: Metadata = { title: "Pricing — Klypza", description: "Start with 10 Klypza credits and earn more through optional rewarded sponsor messages." };

export default function PricingPage() {
  return <MarketingShell><PageHero eyebrow="PRICING" title="Ten ideas are on us." lead="The beta starts simple: ten free generation credits per browser, then three more for each completed voluntary sponsor message."/><section className="pricing-grid"><article className="price-card featured"><p className="plan-label">Creator beta</p><h2>Free</h2><p className="price-sub">No card required</p><ul><li>10 starter generations</li><li>+3 credits per reward message</li><li>Image, motion, video concept and face tools</li><li>Downloadable PNG and WebM output</li><li>Server-side cloud models when connected</li></ul><Link href="/">Start with 10 credits</Link></article><article className="price-card"><p className="plan-label">Rewarded access</p><h2>15 sec</h2><p className="price-sub">One voluntary sponsor message</p><ul><li>Clear sponsor label</li><li>+3 credits after completion</li><li>No forced ad clicks</li><li>No pop-ups or redirects</li><li>Replay-protected rewards</li></ul><Link href="/advertise">See sponsor inventory</Link></article></section><p className="fine-print">Cloud image and video generation can carry significant model costs and will remain subject to fair-use, safety, rate-limit and capacity controls. Paid plans are not yet offered.</p></MarketingShell>;
}
