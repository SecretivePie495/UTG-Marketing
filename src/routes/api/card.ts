import { createFileRoute } from "@tanstack/react-router";

// Pay-per-lead "put your card on file" → Stripe Checkout (subscription to a metered price).
// Leads are billed later via meter events (lead_api), so painting pays $0 today.
const PLANS: Record<string, string[]> = {
  painting: ["price_1Ub1McBloipCiuKdOLMcNCs2"], // $80/lead metered, nothing due today
  lighting: ["price_1UKgccBloipCiuKdyDUDGRCQ", "price_1UKgeqBloipCiuKdjtN5wV5Y"], // $50 first lead + $50/lead metered
};

export const Route = createFileRoute("/api/card")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const prices = PLANS[url.searchParams.get("plan") ?? ""];
        const key = process.env.STRIPE_SECRET_KEY;
        if (!prices || !key) return Response.redirect(new URL("/success", url), 303);

        const body = new URLSearchParams({
          mode: "subscription",
          success_url: `${url.origin}/success?card=on-file`,
          cancel_url: `${url.origin}/success`,
        });
        prices.forEach((price, i) => {
          body.append(`line_items[${i}][price]`, price);
          // metered prices take no quantity; the one-time signup price needs 1
          if (price === "price_1UKgccBloipCiuKdyDUDGRCQ") body.append(`line_items[${i}][quantity]`, "1");
        });
        const email = url.searchParams.get("email")?.trim();
        if (email && email.includes("@")) body.append("customer_email", email);

        const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" },
          body,
        });
        const session = (await res.json()) as { url?: string; error?: { message?: string } };
        if (!res.ok || !session.url) {
          console.error("Stripe checkout failed:", session.error?.message);
          return Response.redirect(new URL("/success", url), 303);
        }
        return Response.redirect(session.url, 303);
      },
    },
  },
});
