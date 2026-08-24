import type { Metadata } from "next";
import { MarketingShell, PageHero } from "@/app/components/marketing-shell";

export const metadata: Metadata = { title: "Klypza FAQ", description: "Answers about Klypza credits, AI models, privacy, face tools and advertising." };

const questions = [
  ["Does Klypza generate real files?", "Yes. Klypza Canvas exports PNG images and WebM motion clips in the browser. When an OpenAI API key is connected, the server routes can also request cloud image and video output."],
  ["How do the 10 free trials work?", "A new browser receives 10 durable credits. Each generation reserves one credit, and a failed render refunds it. Completing a voluntary 15-second sponsor message adds three credits."],
  ["Can I use a celebrity face?", "No. Celebrity, public-figure and deceptive real-person cloning are blocked. You may use your own likeness or authorized talent after confirming permission."],
  ["Are uploads private?", "Concept-mode uploads are processed locally in the browser. Cloud features may send prompts or media to the configured model provider; the interface clearly identifies the active engine."],
  ["Do I have to click an ad?", "No. Sponsor messages are optional, clearly labeled, and grant credits for completion—not for clicking or visiting an advertiser."],
  ["Is there a paid plan?", "Not yet. Klypza is currently a free beta with starter and rewarded credits."],
];

export default function FaqPage() { return <MarketingShell><PageHero eyebrow="FAQ" title="Straight answers, no fine-print maze." lead="The practical details behind Klypza’s tools, credits and safeguards."/><section className="faq-list">{questions.map(([q,a],i)=><details key={q} open={i===0}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</section></MarketingShell>; }
