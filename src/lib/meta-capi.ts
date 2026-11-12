// Meta Conversions API (server side) "Lead" — same event_id as the browser
// pixel so Meta counts it once. No-op until META_CAPI_TOKEN is set in Netlify.
import { createHash } from "node:crypto";
import { META_PIXEL_ID } from "./meta-pixel";

const sha = (v: string) => createHash("sha256").update(v).digest("hex");

export function buildMetaLead(
  d: { email: string; phone: string; firstName: string; lastName: string; city: string; state: string },
  opts: { eventId: string; sourceUrl: string; ip?: string | null; ua?: string | null; fbp?: string; fbc?: string },
  now = Date.now(),
) {
  const digits = d.phone.replace(/\D/g, "");
  const user_data: { [k: string]: string[] | string } = {
    em: [sha(d.email.trim().toLowerCase())],
    ph: [sha(digits.length === 10 ? `1${digits}` : digits)],
    fn: [sha(d.firstName.trim().toLowerCase())],
    ln: [sha(d.lastName.trim().toLowerCase())],
    ct: [sha(d.city.toLowerCase().replace(/[^a-z]/g, ""))],
    st: [sha(d.state.trim().toLowerCase().slice(0, 2))],
    country: [sha("us")],
  };
  if (opts.ip) user_data["client_ip_address"] = opts.ip;
  if (opts.ua) user_data["client_user_agent"] = opts.ua;
  if (opts.fbp) user_data["fbp"] = opts.fbp;
  if (opts.fbc) user_data["fbc"] = opts.fbc;
  return {
    event_name: "Lead",
    event_time: Math.floor(now / 1000),
    event_id: opts.eventId,
    action_source: "website",
    event_source_url: opts.sourceUrl,
    user_data,
    custom_data: { content_name: "UTG intake" },
  };
}

export async function fireMetaLead(...args: Parameters<typeof buildMetaLead>) {
  const token = process.env["META_CAPI_TOKEN"];
  if (!token) return;
  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${META_PIXEL_ID}/events?access_token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [buildMetaLead(...args)] }),
    });
    if (!res.ok) console.error("[meta-capi]", res.status, (await res.text()).slice(0, 300));
  } catch {
    // Never let tracking break the funnel.
  }
}
