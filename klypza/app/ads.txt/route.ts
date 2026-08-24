export async function GET() {
  const body = process.env.ADS_TXT?.trim() || "# Klypza has no authorized programmatic advertising sellers yet.";
  return new Response(`${body}\n`, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
