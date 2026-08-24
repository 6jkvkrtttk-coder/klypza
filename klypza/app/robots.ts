import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const origin = process.env.SITE_ORIGIN || "https://klypza.wassay2007.chatgpt.site";
  return { rules: { userAgent: "*", allow: "/", disallow: ["/api/"] }, sitemap: `${origin}/sitemap.xml` };
}
