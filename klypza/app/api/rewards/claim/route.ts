import { claimReward } from "@/lib/server/visitor";

export async function POST(request: Request) {
  let id = "";
  try { id = String((await request.json() as { id?: string }).id || ""); } catch {}
  if (!id) return Response.json({ error: "Missing reward session." }, { status: 400 });
  const visitor = await claimReward(id);
  if (!visitor) return Response.json({ error: "Reward is not ready or was already claimed." }, { status: 409 });
  return Response.json({ credits: visitor.credits, added: 3 });
}
