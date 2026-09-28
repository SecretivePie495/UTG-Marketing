import { useMemo } from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { LEAD_VOLUMES } from "@/lib/intake-schema";

export function LeadVolumeCards({
  value,
  onValueChange,
}: {
  value?: string;
  onValueChange: (v: string) => void;
}) {
  const cards = useMemo(
    () =>
      LEAD_VOLUMES.map((v) => {
        const numeric = /^(10|20|30|40)/.test(v);
        return {
          value: v,
          count: numeric ? v.split(" ")[0] : null,
          label: v === "Uncapped" ? "Uncapped" : "Leads",
        };
      }),
    [],
  );

  return (
    <div
      role="radiogroup"
      aria-label="Requested lead volume"
      className="grid grid-cols-2 gap-2.5 sm:grid-cols-3"
    >
      {cards.map((card) => {
        const selected = value === card.value;
        return (
          <button
            key={card.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onValueChange(card.value)}
            className={cn(
              "relative flex flex-col items-center justify-center rounded-xl border px-4 py-4 text-center transition-all duration-150",
              selected
                ? "border-primary bg-primary/5 text-foreground shadow-sm ring-1 ring-primary/30"
                : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-accent/40",
            )}
          >
            {selected && (
              <span className="absolute right-2 top-2 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="size-3" />
              </span>
            )}
            {card.count ? (
              <span className="font-display text-2xl font-semibold tracking-tight">
                {card.count}
              </span>
            ) : (
              <span className="font-display text-lg font-semibold tracking-tight">
                {card.label}
              </span>
            )}
            {card.count && (
              <span className="text-xs font-medium text-muted-foreground">{card.label}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
