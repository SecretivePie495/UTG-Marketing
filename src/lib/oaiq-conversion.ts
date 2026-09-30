// Server-side "lead_created" conversion post to the OpenAI Conversions API.
// Requires OAIQ_API_KEY (set via Netlify env); silently no-ops without it.
const PIXEL_ID = "EaXMLRocQJkjHJ8uJt5yuQ";

export function fireLeadCreated(opts: { eventId: string; sourceUrl: string }) {
  const apiKey = process.env.OAIQ_API_KEY;
  if (!apiKey) return;

  const payload = {
    validate_only: false,
    events: [
      {
        id: opts.eventId,
        type: "lead_created",
        timestamp_ms: Date.now(),
        source_url: opts.sourceUrl,
        action_source: "web",
        data: { type: "customer_action" },
      },
    ],
  };

  fetch(`https://bzr.openai.com/v1/events?pid=${PIXEL_ID}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }).catch(() => {
    // Never let conversion tracking break the funnel.
  });
}
