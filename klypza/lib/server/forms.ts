export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function cleanText(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function formError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}
