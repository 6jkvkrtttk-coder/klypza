import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return { name: "Klypza AI Studio", short_name: "Klypza", description: "Create AI images, concept videos and authorized face compositions.", start_url: "/", display: "standalone", background_color: "#0b0b09", theme_color: "#ff5a1f", icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }] };
}
