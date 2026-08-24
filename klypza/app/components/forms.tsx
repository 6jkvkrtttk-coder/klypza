"use client";

import { FormEvent, useState } from "react";

type FormState = { busy: boolean; message: string; ok: boolean };
const initial: FormState = { busy: false, message: "", ok: false };

async function submit(endpoint: string, payload: Record<string, unknown>) {
  const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Something went wrong.");
  return data.message as string;
}

export function NewsletterForm() {
  const [state, setState] = useState(initial);
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setState({ busy: true, message: "", ok: false });
    try {
      const message = await submit("/api/forms/newsletter", { email: data.get("email"), consent: data.get("consent") === "on" });
      form.reset(); setState({ busy: false, message, ok: true });
    } catch (error) { setState({ busy: false, message: error instanceof Error ? error.message : "Could not subscribe.", ok: false }); }
  }
  return <form className="newsletter-form" onSubmit={onSubmit}><div><label htmlFor="newsletter-email">Product updates</label><p>Occasional launch news. No bought lists, no spam.</p></div><div className="newsletter-controls"><input id="newsletter-email" name="email" type="email" inputMode="email" placeholder="you@company.com" required/><button disabled={state.busy}>{state.busy ? "Joining…" : "Join list"}</button></div><label className="mini-consent"><input name="consent" type="checkbox" required/> I agree to receive Klypza product emails and can unsubscribe.</label>{state.message && <p className={state.ok ? "form-success" : "form-error"}>{state.message}</p>}</form>;
}

export function ContactForm() {
  const [state, setState] = useState(initial);
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); setState({ busy: true, message: "", ok: false });
    try { const message = await submit("/api/forms/contact", { email: data.get("email"), topic: data.get("topic"), message: data.get("message") }); form.reset(); setState({ busy: false, message, ok: true }); }
    catch (error) { setState({ busy: false, message: error instanceof Error ? error.message : "Could not send your message.", ok: false }); }
  }
  return <form className="public-form" onSubmit={onSubmit}><label>Email<input name="email" type="email" required placeholder="you@company.com"/></label><label>Topic<select name="topic" defaultValue="Product help"><option>Product help</option><option>Safety report</option><option>Privacy request</option><option>Press</option><option>Partnership</option></select></label><label>Message<textarea name="message" rows={7} minLength={10} maxLength={3000} required placeholder="How can we help?"/></label><button className="form-submit" disabled={state.busy}>{state.busy ? "Sending…" : "Send message"}</button>{state.message && <p className={state.ok ? "form-success" : "form-error"}>{state.message}</p>}</form>;
}

export function SponsorForm() {
  const [state, setState] = useState(initial);
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); setState({ busy: true, message: "", ok: false });
    try { const message = await submit("/api/forms/sponsor", { name: data.get("name"), email: data.get("email"), company: data.get("company"), budget: data.get("budget"), message: data.get("message") }); form.reset(); setState({ busy: false, message, ok: true }); }
    catch (error) { setState({ busy: false, message: error instanceof Error ? error.message : "Could not send the inquiry.", ok: false }); }
  }
  return <form className="public-form" onSubmit={onSubmit}><div className="field-pair"><label>Name<input name="name" required maxLength={100}/></label><label>Work email<input name="email" type="email" required/></label></div><div className="field-pair"><label>Company<input name="company" required maxLength={140}/></label><label>Test budget<select name="budget" defaultValue="$250–$1,000"><option>Under $250</option><option>$250–$1,000</option><option>$1,000–$5,000</option><option>$5,000+</option><option>Product exchange</option></select></label></div><label>Campaign idea<textarea name="message" rows={6} minLength={10} maxLength={3000} required placeholder="Audience, offer, timing and destination…"/></label><button className="form-submit" disabled={state.busy}>{state.busy ? "Sending…" : "Request a media plan"}</button>{state.message && <p className={state.ok ? "form-success" : "form-error"}>{state.message}</p>}</form>;
}
