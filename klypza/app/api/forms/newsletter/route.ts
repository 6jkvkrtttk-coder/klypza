import { getDb } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { cleanText, emailPattern, formError } from "@/lib/server/forms";

export async function POST(request: Request) {
  let body: { email?: string; consent?: boolean } = {};
  try { body = await request.json() as typeof body; } catch { return formError("Invalid request."); }
  const email = cleanText(body.email, 200).toLowerCase();
  if (!emailPattern.test(email)) return formError("Enter a valid email address.");
  if (body.consent !== true) return formError("Please agree to receive Klypza updates.");
  await getDb().insert(newsletterSubscribers).values({ id: crypto.randomUUID(), email, consentAt: Date.now(), status: "subscribed" }).onConflictDoUpdate({ target: newsletterSubscribers.email, set: { consentAt: Date.now(), status: "subscribed" } });
  return Response.json({ ok: true, message: "You’re on the Klypza update list." });
}
