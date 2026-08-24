import type { Metadata } from "next";
import { MarketingShell, PageHero } from "@/app/components/marketing-shell";

export const metadata: Metadata = { title: "Status — Klypza", description: "Current Klypza beta service status and model connection details." };

export default function StatusPage() { const aiLive=Boolean(process.env.OPENAI_API_KEY); return <MarketingShell><PageHero eyebrow="STATUS" title="Klypza systems." lead="A direct summary of what is available in the current production environment."/><section className="status-board"><div><span className="status-dot live"/><b>Studio interface</b><em>Operational</em></div><div><span className="status-dot live"/><b>Klypza Canvas</b><em>Operational</em></div><div><span className="status-dot live"/><b>Credits and rewards</b><em>Operational</em></div><div><span className={`status-dot ${aiLive ? "live" : ""}`}/><b>OpenAI cloud rendering</b><em>{aiLive ? "Connected" : "Awaiting secure API key"}</em></div></section><p className="fine-print">This is a beta status summary, not a historical uptime guarantee.</p></MarketingShell>; }
