export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return Response.json({ error: "Cloud models are not connected." }, { status: 503 });
  const { id } = await context.params;
  if (!/^video_[A-Za-z0-9_-]+$/.test(id)) return Response.json({ error: "Invalid video id." }, { status: 400 });
  const response = await fetch(`https://api.openai.com/v1/videos/${encodeURIComponent(id)}/content`, { headers: { Authorization: `Bearer ${key}` } });
  if (!response.ok || !response.body) return Response.json({ error: "The rendered video is not ready." }, { status: response.status || 502 });
  return new Response(response.body, {
    headers: {
      "Content-Type": response.headers.get("Content-Type") || "video/mp4",
      "Content-Disposition": `inline; filename="klypza-${id}.mp4"`,
      "Cache-Control": "private, max-age=300",
    },
  });
}
