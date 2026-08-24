export async function GET() {
  return Response.json({
    live: Boolean(process.env.OPENAI_API_KEY),
    imageModel: "gpt-image-2",
    videoModel: "sora-2",
    fallback: "klypza-canvas",
  });
}
