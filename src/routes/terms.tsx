import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — UTG Media" },
      {
        name: "description",
        content:
          "The terms that govern your use of UTG Media's lead-generation intake and campaign services.",
      },
      { property: "og:title", content: "Terms of Service — UTG Media" },
      {
        property: "og:description",
        content: "Terms governing UTG Media's lead-generation services.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground">
        <Link to="/">
          <ArrowLeft className="size-4" />
          Back to intake
        </Link>
      </Button>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: September 2026</p>
      <div className="prose-sm mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          These terms outline the agreement between you and UTG Media for the configuration and
          delivery of lead-generation campaigns. By submitting an intake you confirm the information
          provided is accurate.
        </p>
        <p>
          UTG Media works to deliver qualified opportunities to the service areas and volumes you
          specify. Delivery volume, lead quality, and campaign specifics are confirmed during
          onboarding.
        </p>
        <p>
          You agree to contact delivered leads in a timely manner and to use any provided contact
          information solely for the purpose of working the opportunities we send.
        </p>
        <p>
          This is a summary for demonstration. Final terms are provided during account setup. Please
          contact us for the complete agreement.
        </p>
      </div>
    </div>
  );
}
