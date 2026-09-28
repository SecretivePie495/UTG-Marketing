import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin, ShieldCheck, Sparkles } from "lucide-react";

import { IntakeForm } from "@/components/intake/intake-form";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Start Your Lead Campaign — UTG Media" },
      {
        name: "description",
        content:
          "Tell us about your business, where you want customers, and how many leads your team can handle. We'll configure your lead campaign — takes about 2 minutes.",
      },
      { property: "og:title", content: "Start Your Lead Campaign — UTG Media" },
      {
        property: "og:description",
        content:
          "Tell us about your business, service area, and capacity. We'll configure a lead campaign that fits your team.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative">
      <section className="hero-glow px-5 pt-10 pb-6 text-center sm:pt-16">
        <div className="mx-auto max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
            <span className="size-1.5 rounded-full bg-primary" />
            Lead intake · configure your campaign
          </span>
          <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Let's start sending you <span className="text-gradient-brand">leads.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Tell us a little about your business, where you want customers, and how many
            opportunities your team can handle.
          </p>
          <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground/80">
            <Clock className="size-4 text-primary" />
            Takes about 2 minutes
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-primary" /> No setup fees
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5 text-primary" /> Target by ZIP code
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-primary" /> Private &amp; secure
            </span>
          </div>
        </div>
      </section>

      <div className="px-5 pb-24">
        <IntakeForm />
      </div>
    </div>
  );
}
