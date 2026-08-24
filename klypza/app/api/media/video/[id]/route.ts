export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return Response.json({ error: "Cloud models are not connected." }, { status: 503 });
  const { id } = await context.params;
  if (!/^video_[A-Za-z0-9_-]+$/.test(id)) return Response.json({ error: "Invalid video id." }, { status: 400 });
  const response = await fetch(`https://api.openai.com/v1/videos/${encodeURIComponent(id)}`, { headers: { Authorization: `Bearer ${key}` } });
  const result = await response.json() as { status?: string; progress?: number; error?: { message?: string } };
  if (!response.ok) return Response.json({ error: result.error?.message || "Could not retrieve the video job." }, { status: response.status });
  return Response.json({ status: result.status, progress: result.progress || 0, url: result.status === "completed" ? `/api/media/video/${encodeURIComponent(id)}/content` : undefined, error: result.error?.message });
}
