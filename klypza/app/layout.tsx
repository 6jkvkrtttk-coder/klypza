import type { Metadata } from "next";
import "./globals.css";

const origin = process.env.SITE_ORIGIN || "https://klypza.wassay2007.chatgpt.site";
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: { default: "Klypza — AI Media Studio", template: "%s" },
  description: "Create AI images, concept videos, image animations, and consent-based face compositions in one cinematic studio.",
  applicationName: "Klypza",
  keywords: ["AI video generator", "AI image generator", "script to video", "animate image", "authorized face compositing"],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  other: { "codex-preview": "development" },
  verification: googleVerification ? { google: googleVerification } : undefined,
  openGraph: {
    title: "Klypza — AI Media Studio",
    description: "From a written idea to a frame, clip, or authorized character performance.",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "Klypza AI Media Studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Klypza — AI Media Studio",
    description: "From a written idea to a frame, clip, or authorized character performance.",
    images: ["/og.png"],
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "Klypza", applicationCategory: "MultimediaApplication", operatingSystem: "Web", url: origin, description: metadata.description, offers: { "@type": "Offer", price: "0", priceCurrency: "USD", description: "10 starter generation credits" } };
  return <html lang="en"><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}/></body></html>;
}
