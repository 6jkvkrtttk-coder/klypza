import Link from "next/link";
import { MarketingShell, PageHero } from "@/app/components/marketing-shell";

export default function NotFound() { return <MarketingShell><PageHero eyebrow="404" title="That frame isn’t here." lead="The page may have moved, or the link may be incomplete."/><section className="marketing-cta"><h2>Return to the studio.</h2><Link href="/">Open Klypza →</Link></section></MarketingShell>; }
