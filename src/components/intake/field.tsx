import * as React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function inputErrorClass(error?: string): string {
  return error
    ? "border-destructive/70 focus-visible:ring-destructive/40"
    : "border-input focus-visible:ring-ring";
}

export function RequiredStar({ className }: { className?: string }) {
  return <span className={cn("ml-0.5 text-destructive", className)}>*</span>;
}

export function SectionHeading({
  index,
  title,
  subtitle,
}: {
  index: number;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {index}
        </span>
        <h2 className="font-display text-lg font-semibold tracking-tight text-foreground sm:text-xl">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="mt-2 pl-8 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}

type FieldProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
};

export function Field({ id, label, required, error, hint, className, children }: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id} className="text-sm font-medium leading-none text-foreground">
        {label}
        {required && <RequiredStar />}
      </Label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs leading-relaxed text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type ChoiceOption = { value: string; label: string };

export function ChoiceGroup({
  value,
  onValueChange,
  options,
  columns = 2,
  className,
}: {
  value?: string;
  onValueChange: (v: string) => void;
  options: ChoiceOption[];
  columns?: 1 | 2;
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      className={cn(
        "grid gap-2",
        columns === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1",
        className,
      )}
    >
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onValueChange(opt.value)}
            className={cn(
              "flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all duration-150",
              selected
                ? "border-primary bg-primary/5 text-foreground shadow-sm"
                : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-accent/40",
            )}
          >
            <span>{opt.label}</span>
            <span
              className={cn(
                "flex size-4 items-center justify-center rounded-full border transition-colors",
                selected ? "border-primary" : "border-muted-foreground/30",
              )}
              aria-hidden
            >
              {selected && <span className="size-2 rounded-full bg-primary" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function YesNoGroup({
  value,
  onValueChange,
}: {
  value?: string;
  onValueChange: (v: string) => void;
}) {
  return (
    <ChoiceGroup
      value={value}
      onValueChange={onValueChange}
      columns={2}
      options={[
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
      ]}
    />
  );
}
