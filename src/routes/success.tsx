import { createFileRoute, Link, useHydrated } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SUMMARY_KEY } from "@/lib/intake-schema";

type Summary = {
  intakeId?: string;
  business?: string;
  industry?: string;
  serviceArea?: string;
  requestedLeadVolume?: string;
  leadEmail?: string;
};

export const Route = createFileRoute("/success")({
  head: () => ({
    meta: [
      { title: "Intake Received — UTG Media" },
      {
        name: "description",
        content:
          "Your lead campaign intake has been received. Our team will review your service area and reach out with next steps.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Intake Received — UTG Media" },
      {
        property: "og:description",
        content: "Your lead campaign intake has been received.",
      },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const hydrated = useHydrated();
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    try {
      const raw = sessionStorage.getItem(SUMMARY_KEY);
      if (raw) setSummary(JSON.parse(raw) as Summary);
    } catch {
      /* ignore malformed summary */
    }
  }, [hydrated]);

  return (
    <div className="mx-auto max-w-xl px-5 py-16 sm:py-24">
      <div className="rounded-2xl border border-border/70 bg-card p-8 text-center shadow-lg shadow-black/[0.03] sm:p-10">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="size-9" strokeWidth={2} />
        </div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Intake Received
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          You're all set.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          We've received your information. Our team will review your service area and campaign
          details and reach out with the next steps.
        </p>

        {summary && (
          <div className="mt-8 space-y-2.5 rounded-xl border border-border/70 bg-background/60 p-5 text-left">
            <SummaryRow label="Business" value={summary.business} />
            <SummaryRow label="Industry" value={summary.industry} />
            <SummaryRow label="Service area" value={summary.serviceArea} />
            <SummaryRow label="Requested lead volume" value={summary.requestedLeadVolume} />
            <SummaryRow label="Lead delivery email" value={summary.leadEmail} />
            {summary.intakeId && (
              <p className="border-t border-border/70 pt-2.5 text-xs text-muted-foreground/70">
                Reference: {summary.intakeId}
              </p>
            )}
          </div>
        )}

        <div className="mt-8">
          <Button asChild size="lg" className="h-12 w-full text-base sm:w-auto">
            <Link to="/">
              <ArrowLeft className="size-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium text-foreground">{value || "—"}</span>
    </div>
  );
}
