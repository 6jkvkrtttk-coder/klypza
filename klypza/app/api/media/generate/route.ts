type RequestBody = {
  mode?: "image" | "video";
  prompt?: string;
  aspect?: "16:9" | "9:16" | "1:1";
  duration?: string;
  quality?: "Fast" | "Studio";
};

const blockedLikeness = /\b(celebrity|public figure|famous actor|famous actress|president|prime minister|elon musk|taylor swift|cristiano ronaldo|lionel messi|tom cruise|shah rukh khan)\b/i;

function apiError(status: number, message: string) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return apiError(503, "Cloud models are not connected. Klypza Canvas remains available in the browser.");

  let body: RequestBody;
  try { body = await request.json() as RequestBody; }
  catch { return apiError(400, "Invalid request body."); }

  const prompt = body.prompt?.trim() || "";
  if (prompt.length < 4 || prompt.length > 1200) return apiError(400, "Prompt must be between 4 and 1,200 characters.");
  if (blockedLikeness.test(prompt)) return apiError(400, "Real-person and public-figure generation is not available. Describe a fictional subject instead.");

  if (body.mode === "image") {
    const imageSize = body.aspect === "9:16" ? "1024x1536" : body.aspect === "1:1" ? "1024x1024" : "1536x1024";
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-image-2",
        prompt: `${prompt}\n\nCreate an original image. Do not depict or imitate a real person or public figure. No watermark or signature.`,
        size: imageSize,
        quality: body.quality === "Fast" ? "low" : "medium",
      }),
    });
    const result = await response.json() as { data?: { b64_json?: string }[]; error?: { message?: string } };
    if (!response.ok || !result.data?.[0]?.b64_json) return apiError(response.status || 502, result.error?.message || "Image generation failed.");
    return Response.json({ kind: "image", url: `data:image/png;base64,${result.data[0].b64_json}` });
  }

  if (body.mode === "video") {
    const seconds = body.duration?.startsWith("12") ? "12" : body.duration?.startsWith("5") ? "4" : "8";
    const size = body.aspect === "9:16" ? "720x1280" : "1280x720";
    const form = new FormData();
    form.set("model", body.quality === "Studio" ? "sora-2-pro" : "sora-2");
    form.set("prompt", `${prompt}\n\nUse only fictional subjects; do not depict a real person, public figure, copyrighted character, or copyrighted music.`);
    form.set("seconds", seconds);
    form.set("size", size);
    const response = await fetch("https://api.openai.com/v1/videos", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}` },
      body: form,
    });
    const result = await response.json() as { id?: string; status?: string; progress?: number; error?: { message?: string } };
    if (!response.ok || !result.id) return apiError(response.status || 502, result.error?.message || "Video generation could not start.");
    return Response.json({ kind: "video", id: result.id, status: result.status || "queued", progress: result.progress || 0 });
  }

  return apiError(400, "Unsupported generation mode.");
}
