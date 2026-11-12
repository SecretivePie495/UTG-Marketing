// Meta Pixel (browser side). Base code lives in __root.tsx.
export const META_PIXEL_ID = "1447757643454008";

type Fbq = (...args: unknown[]) => void;

// Fire "Lead" after /api/intake succeeds. eventId = the server's intake id,
// so Meta dedupes it against the server-side copy in meta-capi.ts.
export function trackMetaLead(
  d: { email: string; phone: string; firstName: string; lastName: string; city: string; state: string; industry?: string },
  eventId?: string,
) {
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  if (!fbq) return;
  // fbq hashes these itself before sending.
  fbq("init", META_PIXEL_ID, {
    em: d.email.trim().toLowerCase(),
    ph: d.phone.replace(/\D/g, ""),
    fn: d.firstName.trim().toLowerCase(),
    ln: d.lastName.trim().toLowerCase(),
    ct: d.city.toLowerCase().replace(/[^a-z]/g, ""),
    st: d.state.trim().toLowerCase().slice(0, 2),
  });
  fbq("track", "Lead", { content_name: "UTG intake", industry: d.industry }, eventId ? { eventID: eventId } : undefined);
}
