import { and, eq, gt, lte, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { getDb } from "@/db";
import { rewardSessions, visitors } from "@/db/schema";

const VISITOR_COOKIE = "klypza_visitor";

export async function getVisitor() {
  const cookieStore = await cookies();
  let visitorId = cookieStore.get(VISITOR_COOKIE)?.value;
  let isNew = false;
  if (!visitorId || !/^[a-f0-9-]{36}$/i.test(visitorId)) {
    visitorId = crypto.randomUUID();
    isNew = true;
  }

  const db = getDb();
  const now = Date.now();
  await db.insert(visitors).values({ id: visitorId, credits: 10, totalUses: 0, createdAt: now, updatedAt: now }).onConflictDoNothing();
  const [visitor] = await db.select().from(visitors).where(eq(visitors.id, visitorId)).limit(1);

  if (isNew) {
    cookieStore.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return { db, visitorId, visitor };
}

export async function consumeCredit() {
  const { db, visitorId } = await getVisitor();
  const [visitor] = await db.update(visitors).set({
    credits: sql`${visitors.credits} - 1`,
    totalUses: sql`${visitors.totalUses} + 1`,
    updatedAt: Date.now(),
  }).where(and(eq(visitors.id, visitorId), gt(visitors.credits, 0))).returning();
  return visitor ?? null;
}

export async function refundCredit() {
  const { db, visitorId } = await getVisitor();
  const [visitor] = await db.update(visitors).set({
    credits: sql`${visitors.credits} + 1`,
    totalUses: sql`max(0, ${visitors.totalUses} - 1)`,
    updatedAt: Date.now(),
  }).where(eq(visitors.id, visitorId)).returning();
  return visitor;
}

export async function startReward() {
  const { db, visitorId } = await getVisitor();
  const now = Date.now();
  const id = crypto.randomUUID();
  const claimAfter = now + 15_000;
  await db.insert(rewardSessions).values({ id, visitorId, startedAt: now, claimAfter, claimed: false, advertiserId: "klypza-house" });
  return { id, claimAfter, seconds: 15 };
}

export async function claimReward(id: string) {
  const { db, visitorId } = await getVisitor();
  const [session] = await db.update(rewardSessions).set({ claimed: true }).where(and(
    eq(rewardSessions.id, id),
    eq(rewardSessions.visitorId, visitorId),
    eq(rewardSessions.claimed, false),
    lte(rewardSessions.claimAfter, Date.now()),
  )).returning();
  if (!session) return null;
  const [visitor] = await db.update(visitors).set({
    credits: sql`${visitors.credits} + 3`,
    updatedAt: Date.now(),
  }).where(eq(visitors.id, visitorId)).returning();
  return visitor;
}
