import { getDb } from "@/db";
import { sponsorInquiries } from "@/db/schema";
import { cleanText, emailPattern, formError } from "@/lib/server/forms";

export async function POST(request: Request) {
  let body: { name?: string; email?: string; company?: string; budget?: string; message?: string } = {};
  try { body = await request.json() as typeof body; } catch { return formError("Invalid request."); }
  const name = cleanText(body.name, 100);
  const email = cleanText(body.email, 200).toLowerCase();
  const company = cleanText(body.company, 140);
  const budget = cleanText(body.budget, 80);
  const message = cleanText(body.message, 3000);
  if (name.length < 2 || company.length < 2) return formError("Add your name and company.");
  if (!emailPattern.test(email)) return formError("Enter a valid work email.");
  if (message.length < 10) return formError("Tell us a little about the campaign.");
  await getDb().insert(sponsorInquiries).values({ id: crypto.randomUUID(), name, email, company, budget: budget || "Not specified", message, status: "new", createdAt: Date.now() });
  return Response.json({ ok: true, message: "Sponsor inquiry received. We’ll follow up by email." });
}
