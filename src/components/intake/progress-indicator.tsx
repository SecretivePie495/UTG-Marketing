import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export const STEPS = [
  { id: 0, label: "Your Info" },
  { id: 1, label: "Business" },
  { id: 2, label: "Service Area" },
  { id: 3, label: "Lead Setup" },
  { id: 4, label: "Finish" },
] as const;

export const STEP_FIELDS: Record<number, string[]> = {
  0: ["firstName", "lastName", "businessName", "email", "phone"],
  1: ["industry", "customIndustry"],
  2: ["zipCodes", "city", "state"],
  3: [
    "leadEmail",
    "callbackPhone",
    "secondaryLeadEmail",
    "leadCaller",
    "customLeadCaller",
    "requestedLeadVolume",
    "dailyLeadCapacity",
  ],
  4: ["responseTime", "hasCaller", "usesCRM", "crmName", "agreement"],
};

export function ProgressIndicator({ current }: { current: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {STEPS.map((step, i) => {
          const completed = i < current;
          const active = i === current;
          return (
            <div key={step.id} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full border text-xs font-semibold transition-all duration-200",
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : completed
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground",
                  )}
                >
                  {completed ? <Check className="size-4" /> : i + 1}
                </div>
                <span
                  className={cn(
                    "hidden text-xs font-medium transition-colors sm:block",
                    active
                      ? "text-foreground"
                      : completed
                        ? "text-primary"
                        : "text-muted-foreground",
                  )}
                >
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "mx-1 h-px flex-1 transition-colors duration-300 sm:mx-2",
                    completed ? "bg-primary" : "bg-border",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs font-medium text-muted-foreground sm:hidden">
        Step {current + 1} of {STEPS.length} — {STEPS[current].label}
      </p>
    </div>
  );
}
