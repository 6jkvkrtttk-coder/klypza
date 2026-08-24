import type { Metadata } from "next";
import { SponsorForm } from "@/app/components/forms";
import { MarketingShell, PageHero } from "@/app/components/marketing-shell";

export const metadata: Metadata = { title: "Advertise with Klypza", description: "Request a clearly labeled, voluntary rewarded sponsorship placement in Klypza." };

export default function AdvertisePage() {
  return <MarketingShell><PageHero eyebrow="PARTNERS" title="Fund creativity, not interruption." lead="Klypza’s founding inventory is a voluntary rewarded message shown only after a creator asks for more credits."/><section className="inventory-grid"><article><span>01</span><h2>Rewarded spotlight</h2><p>15-second, full-focus sponsor story inside the credit flow. The user opts in and receives three credits after completion.</p></article><article><span>02</span><h2>Creator fit</h2><p>Best for creative software, production gear, education, design resources, sound libraries and creator services.</p></article><article><span>03</span><h2>Truthful reporting</h2><p>Early tests report delivered starts and completed rewards. Klypza does not publish invented traffic or audience numbers.</p></article></section><section className="split-panel"><div><p className="kicker"><span>MEDIA</span> / Founding partner</p><h2>Request a test placement.</h2><p>Tell us what you sell and who it helps. Submissions are stored privately for a direct response; they are not added to a marketing list.</p></div><SponsorForm/></section></MarketingShell>;
}
