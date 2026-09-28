import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — UTG Media" },
      {
        name: "description",
        content:
          "How UTG Media collects, uses, and protects the information you submit through our intake form.",
      },
      { property: "og:title", content: "Privacy Policy — UTG Media" },
      {
        property: "og:description",
        content: "How UTG Media handles the information you submit.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground">
        <Link to="/">
          <ArrowLeft className="size-4" />
          Back to intake
        </Link>
      </Button>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: September 2026</p>
      <div className="prose-sm mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          Your information is kept private and only used to set up and manage your lead campaign. We
          do not sell the details you submit in this intake.
        </p>
        <p>
          We collect your contact details, business information, service area, and lead-handling
          preferences to configure delivery and to follow up with next steps.
        </p>
        <p>
          You may request correction or deletion of your information at any time by contacting us.
          This is a summary for demonstration; the full policy is provided during account setup.
        </p>
      </div>
    </div>
  );
}
