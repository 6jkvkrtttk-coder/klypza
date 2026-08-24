import { getDb } from "@/db";
import { contactMessages } from "@/db/schema";
import { cleanText, emailPattern, formError } from "@/lib/server/forms";

export async function POST(request: Request) {
  let body: { email?: string; topic?: string; message?: string } = {};
  try { body = await request.json() as typeof body; } catch { return formError("Invalid request."); }
  const email = cleanText(body.email, 200).toLowerCase();
  const topic = cleanText(body.topic, 80);
  const message = cleanText(body.message, 3000);
  if (!emailPattern.test(email)) return formError("Enter a valid email address.");
  if (topic.length < 2 || message.length < 10) return formError("Add a topic and a message of at least 10 characters.");
  await getDb().insert(contactMessages).values({ id: crypto.randomUUID(), email, topic, message, status: "new", createdAt: Date.now() });
  return Response.json({ ok: true, message: "Message received. We’ll reply by email." });
}
