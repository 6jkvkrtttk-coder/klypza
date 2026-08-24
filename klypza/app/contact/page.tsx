import type { Metadata } from "next";
import { ContactForm } from "@/app/components/forms";
import { MarketingShell, PageHero } from "@/app/components/marketing-shell";

export const metadata: Metadata = { title: "Contact Klypza", description: "Contact Klypza about product help, safety, privacy, press or partnerships." };

export default function ContactPage() {
  return <MarketingShell><PageHero eyebrow="CONTACT" title="Tell us what you need." lead="Use this secure form for product help, privacy requests, safety reports, press and partnerships."/><section className="split-panel compact"><div><h2>A human-readable inbox.</h2><p>We do not publish a new email address until its mailbox and anti-spam protections are verified. This form stores your request directly in Klypza’s private site database.</p><p>For urgent safety reports, choose “Safety report” and include the affected page or asset details.</p></div><ContactForm/></section></MarketingShell>;
}
