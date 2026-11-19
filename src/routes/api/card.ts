import { createFileRoute } from "@tanstack/react-router";

// Pay-per-lead "put your card on file" → Stripe Checkout.
// Painting: one-time $80 + saved card. Lighting: $50 + metered subscription.
const PLANS: Record<string, string[]> = {
  // $80 first lead today, card saved; later leads charged manually ($80) from the Stripe dashboard
  painting: ["price_1UdGGJBloipCiuKdeeCs0SQ7"],
  lighting: ["price_1UKgccBloipCiuKdyDUDGRCQ", "price_1UKgeqBloipCiuKdjtN5wV5Y"], // $50 first lead + $50/lead metered
};
const ONE_TIME = new Set(["price_1UKgccBloipCiuKdyDUDGRCQ", "price_1UdGGJBloipCiuKdeeCs0SQ7"]);

export const Route = createFileRoute("/api/card")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const prices = PLANS[url.searchParams.get("plan") ?? ""];
        const key = process.env.STRIPE_SECRET_KEY;
        if (!prices || !key) return Response.redirect(new URL("/success", url), 303);

        const oneTimeOnly = prices.every((p) => ONE_TIME.has(p));
        const body = new URLSearchParams({
          mode: oneTimeOnly ? "payment" : "subscription",
          success_url: `${url.origin}/success?card=on-file`,
          cancel_url: `${url.origin}/success`,
          // card or US bank account (ACH); Cash App/Klarna declined $0 setups and can't be charged per lead later
          "payment_method_types[0]": "card",
          "payment_method_types[1]": "us_bank_account",
        });
        if (oneTimeOnly) {
          // save the card so later leads can be charged off-session
          body.append("payment_intent_data[setup_future_usage]", "off_session");
          body.append("customer_creation", "always");
        }
        prices.forEach((price, i) => {
          body.append(`line_items[${i}][price]`, price);
          // metered prices take no quantity; one-time first-lead prices need 1
          if (ONE_TIME.has(price)) body.append(`line_items[${i}][quantity]`, "1");
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
