import { startReward } from "@/lib/server/visitor";

export async function POST() {
  return Response.json(await startReward());
}
