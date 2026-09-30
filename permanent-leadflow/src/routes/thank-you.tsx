import { createFileRoute } from "@tanstack/react-router";
import { ReceiptText } from "lucide-react";
import type { ReactNode } from "react";

// TODO: Replace with your real support number.
const PHONE_DISPLAY = "(888) 555-0142";
const PHONE_HREF = "tel:+18885550142";
// TODO: Replace with your live calendar booking link (Calendly, Cal.com, etc.).
const STRATEGY_CALL_URL = "#";

export const Route = createFileRoute("/thank-you")({
  head: () => ({
    meta: [
      { title: "You're in — Permanent Lighting Lead Subscription Active" },
      {
        name: "description",
        content:
          "Your pay-per-lead subscription is active. Your first permanent-lighting lead typically lands within 24–48 hours.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "You're in — Permanent Lighting Leads" },
      {
        property: "og:description",
        content: "Your pay-per-lead subscription is active. First lead in 24–48 hours.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: async () => {
    if (typeof document !== "undefined") return null;
    const { fireLeadCreated } = await import("@/lib/oaiq-conversion");
    fireLeadCreated({
      eventId: `pl_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
      sourceUrl: "https://utgmedia.com/pl/thank-you",
    });
    return null;
  },
  component: ThankYouPage,
});

function ThankYouPage() {
  return (
    <div className="dark glow-bg min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      <div className="relative mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-5 py-16 text-foreground">
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">
          Permanent Lighting
        </p>

        <main className="w-full max-w-lg">
          <div className="animate-in fade-in slide-in-from-bottom-4 rounded-2xl border border-border bg-card p-8 shadow-2xl sm:p-10">
            <div className="mb-7 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-brand-gold to-brand-gold-glow shadow-lg">
                <ReceiptText className="h-7 w-7 text-brand-gold-foreground" strokeWidth={2.2} />
              </div>
              <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Order confirmed
              </span>
            </div>

            <h1 className="font-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              You're in! Your lead subscription is active.
            </h1>

            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              We've received your payment and your account is set up. Look for{" "}
              <span className="font-semibold text-brand-gold">"UTG MEDIA LLC"</span> on your
              statement — that's us.
            </p>

            <h2 className="mt-9 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              What happens next
            </h2>
            <ol className="mt-4 space-y-5">
              <Step n={1}>We source qualified permanent-lighting leads in your service area.</Step>
              <Step n={2}>The first leads typically land within 24–48 hours.</Step>
              <Step n={3}>
                You're only billed $50 per lead actually delivered — no fees, no commitments, cancel
                anytime.
              </Step>
            </ol>

            <p className="mt-8 rounded-lg border border-border bg-background/60 p-4 text-xs leading-relaxed text-muted-foreground">
              Your plan: <span className="font-medium text-foreground">$50 per qualified lead</span>
              , billed daily. Your $50 signup payment covers your first lead.
            </p>

            <div className="mt-8 space-y-3">
              <a
                href={PHONE_HREF}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-glow px-5 py-3.5 text-sm font-semibold text-brand-gold-foreground shadow-lg transition-transform hover:-translate-y-0.5"
              >
                Questions? Call or text {PHONE_DISPLAY}
              </a>
              <p className="text-center text-xs text-muted-foreground">
                A human answers — or reply to any email from us.
              </p>
              <a
                href={STRATEGY_CALL_URL}
                className="flex w-full items-center justify-center rounded-xl border border-border bg-background px-5 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
              >
                Book your free strategy call
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Step({ n, children }: { n: number; children: ReactNode }) {
  return (
    <li className="flex gap-4">
      <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand-gold/15 text-sm font-semibold text-brand-gold">
        {n}
      </span>
      <span className="pt-0.5 text-sm leading-relaxed text-foreground/90">{children}</span>
    </li>
  );
}
