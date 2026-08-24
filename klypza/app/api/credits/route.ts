import { consumeCredit, getVisitor, refundCredit } from "@/lib/server/visitor";

export async function GET() {
  const { visitor } = await getVisitor();
  return Response.json({ credits: visitor.credits, totalUses: visitor.totalUses });
}

export async function POST(request: Request) {
  let body: { action?: string } = {};
  try { body = await request.json() as { action?: string }; } catch {}
  if (body.action === "consume") {
    const visitor = await consumeCredit();
    if (!visitor) return Response.json({ error: "No credits left.", credits: 0 }, { status: 402 });
    return Response.json({ credits: visitor.credits, totalUses: visitor.totalUses });
  }
  if (body.action === "refund") {
    const visitor = await refundCredit();
    return Response.json({ credits: visitor.credits, totalUses: visitor.totalUses });
  }
  return Response.json({ error: "Unknown credit action." }, { status: 400 });
}
