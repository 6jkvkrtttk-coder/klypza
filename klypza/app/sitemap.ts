import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.SITE_ORIGIN || "https://klypza.wassay2007.chatgpt.site";
  const routes = ["", "/about", "/pricing", "/advertise", "/contact", "/faq", "/safety", "/privacy", "/terms", "/status"];
  return routes.map((route, index) => ({
    url: `${origin}${route}`,
    lastModified: new Date(),
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : route === "/pricing" || route === "/advertise" ? .8 : .6,
  }));
}
