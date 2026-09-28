import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  MapPin,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Field, inputErrorClass, RequiredStar, SectionHeading } from "@/components/intake/field";
import { ProgressIndicator, STEPS, STEP_FIELDS } from "@/components/intake/progress-indicator";
import { FIELD_INPUT_CLASS, StepFinalDetails, StepLeadDelivery } from "@/components/intake/steps";
import {
  buildIntakePayload,
  formatPhone,
  INDUSTRIES,
  initialValues,
  parseZipTokens,
  RESPONSE_TIMES,
  SUMMARY_KEY,
  US_STATES,
  validateIntake,
  type FormState,
} from "@/lib/intake-schema";
import { postIntakeTracking } from "@/lib/intake-tracking";
import { useIntakeAutosave } from "@/hooks/use-intake-autosave";

const SELECT_TRIGGER_CLASS =
  "h-12 rounded-xl text-base sm:text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring/40 data-[placeholder]:text-muted-foreground";

export function IntakeForm() {
  const navigate = useNavigate();
  const autosave = useIntakeAutosave();
  const [values, setValues] = useState<FormState>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const draftApplied = useRef(false);
  const [showRestoredBanner, setShowRestoredBanner] = useState(false);

  // Restore a saved draft once after mount (SSR-safe: reads localStorage in
  // an effect, not during render).
  useEffect(() => {
    if (draftApplied.current) return;
    if (!autosave.draft) return;
    draftApplied.current = true;
    setValues(autosave.draft.values);
    setStep(autosave.draft.step);
    setShowRestoredBanner(true);
  }, [autosave.draft]);

  // Keep the autosave hook in sync with the live form state (debounced write).
  useEffect(() => {
    autosave.sync(values, step);
  }, [values, step, autosave]);

  const update = useCallback(<K extends keyof FormState>(key: K, val: FormState[K]) => {
    setValues((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => (prev[key as string] ? { ...prev, [key as string]: "" } : prev));
  }, []);

  const scrollToTop = useCallback(() => {
    if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const fieldError = useCallback(
    (key: string): string => (touched[key] ? (errors[key] ?? "") : ""),
    [touched, errors],
  );

  const addZip = useCallback(() => {
    setValues((prev) => ({ ...prev, zipCodes: [...prev.zipCodes, ""] }));
  }, []);

  const removeZip = useCallback((index: number) => {
    setValues((prev) => {
      const next = prev.zipCodes.filter((_, i) => i !== index);
      return { ...prev, zipCodes: next.length ? next : [""] };
    });
  }, []);

  const updateZip = useCallback((index: number, raw: string) => {
    setValues((prev) => {
      if (/[, \n]/.test(raw)) {
        const tokens = parseZipTokens(raw);
        if (tokens.length > 1) {
          const cleaned = tokens.map((t) => t.replace(/\D/g, "").slice(0, 5)).filter(Boolean);
          const before = prev.zipCodes.slice(0, index);
          const after = prev.zipCodes.slice(index + 1);
          return { ...prev, zipCodes: [...before, ...cleaned, ...after] };
        }
      }
      const digits = raw.replace(/\D/g, "").slice(0, 5);
      const next = [...prev.zipCodes];
      next[index] = digits;
      return { ...prev, zipCodes: next };
    });
  }, []);

  const validateStep = useCallback(
    (stepIndex: number): Record<string, string> => {
      const all = validateIntake(values);
      const result: Record<string, string> = {};
      for (const f of STEP_FIELDS[stepIndex] ?? []) {
        if (all.fieldErrors[f]) result[f] = all.fieldErrors[f];
      }
      return result;
    },
    [values],
  );

  const markStepTouched = useCallback((stepIndex: number) => {
    const next: Record<string, boolean> = {};
    for (const f of STEP_FIELDS[stepIndex] ?? []) next[f] = true;
    setTouched((prev) => ({ ...prev, ...next }));
  }, []);

  const next = useCallback(() => {
    const stepErrors = validateStep(step);
    if (Object.keys(stepErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...stepErrors }));
      markStepTouched(step);
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    scrollToTop();
  }, [step, validateStep, markStepTouched, scrollToTop]);

  const back = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0));
    scrollToTop();
  }, [scrollToTop]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const all = validateIntake(values);
      if (!all.success) {
        setErrors(all.fieldErrors);
        markStepTouched(4);
        for (let s = 0; s < 5; s++) {
          if ((STEP_FIELDS[s] ?? []).some((f) => all.fieldErrors[f])) {
            setStep(s);
            break;
          }
        }
        scrollToTop();
        return;
      }

      setSubmitting(true);
      setSubmitError(null);
      const payload = buildIntakePayload(values);
      postIntakeTracking(payload);
      try {
        const res = await fetch("/api/intake", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        let json: { ok?: boolean; id?: string } | null = null;
        try {
          json = (await res.json()) as { ok?: boolean; id?: string };
        } catch {
          /* ignore parse errors */
        }
        if (!res.ok || !json?.ok) throw new Error("Submission failed");

        try {
          const summary = {
            intakeId: json?.id,
            business: payload.businessName,
            industry:
              payload.industry === "Other" ? (payload.customIndustry ?? "Other") : payload.industry,
            serviceArea: payload.zipCodes.join(", "),
            requestedLeadVolume: payload.requestedLeadVolume,
            leadEmail: payload.leadEmail,
          };
          sessionStorage.setItem(SUMMARY_KEY, JSON.stringify(summary));
        } catch {
          /* ignore storage errors */
        }

        autosave.clear();
        await navigate({ to: "/success" });
      } catch {
        setSubmitError("Something went wrong submitting your intake. Please try again.");
        setSubmitting(false);
      }
    },
    [values, markStepTouched, navigate, scrollToTop, autosave],
  );

  const handleStartOver = useCallback(() => {
    autosave.discard();
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setStep(0);
    setSubmitError(null);
    setShowRestoredBanner(false);
    draftApplied.current = true;
    scrollToTop();
  }, [autosave, scrollToTop]);

  const hasDraft = showRestoredBanner;

  const zipError = touched.zipCodes ? errors.zipCodes : "";
  const stepProps = {
    values,
    errors,
    touched,
    update,
    setTouched,
    fieldError,
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div
        ref={topRef}
        className="rounded-2xl border border-border/70 bg-card p-6 shadow-lg shadow-black/[0.03] sm:p-8"
      >
        <ProgressIndicator current={step} />

        {hasDraft && (
          <div className="-mt-2 mb-6 flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/40 px-3.5 py-2.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="size-3.5 text-primary" />
              We saved your progress — keep going where you left off.
            </span>
            <button
              type="button"
              onClick={handleStartOver}
              disabled={submitting}
              className="inline-flex items-center gap-1 font-medium text-foreground/70 underline-offset-2 transition-colors hover:text-foreground hover:underline disabled:opacity-50"
            >
              <RotateCcw className="size-3" />
              Start over
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-10">
          {/* STEP 1 — Your Information */}
          {step === 0 && (
            <section>
              <SectionHeading
                index={1}
                title="Your Information"
                subtitle="So we know who to set up and how to reach you."
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="firstName" label="First Name" required error={fieldError("firstName")}>
                  <Input
                    id="firstName"
                    name="firstName"
                    autoComplete="given-name"
                    placeholder="Jordan"
                    value={values.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                    onBlur={() => setTouched((p) => ({ ...p, firstName: true }))}
                    className={cn(FIELD_INPUT_CLASS, inputErrorClass(fieldError("firstName")))}
                  />
                </Field>
                <Field id="lastName" label="Last Name" required error={fieldError("lastName")}>
                  <Input
                    id="lastName"
                    name="lastName"
                    autoComplete="family-name"
                    placeholder="Rivera"
                    value={values.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                    onBlur={() => setTouched((p) => ({ ...p, lastName: true }))}
                    className={cn(FIELD_INPUT_CLASS, inputErrorClass(fieldError("lastName")))}
                  />
                </Field>
                <Field
                  id="businessName"
                  label="Business Name"
                  required
                  error={fieldError("businessName")}
                  className="sm:col-span-2"
                >
                  <Input
                    id="businessName"
                    name="businessName"
                    autoComplete="organization"
                    placeholder="Rivera Roofing & Exteriors"
                    value={values.businessName}
                    onChange={(e) => update("businessName", e.target.value)}
                    onBlur={() => setTouched((p) => ({ ...p, businessName: true }))}
                    className={cn(FIELD_INPUT_CLASS, inputErrorClass(fieldError("businessName")))}
                  />
                </Field>
                <Field id="email" label="Email Address" required error={fieldError("email")}>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="you@business.com"
                    value={values.email}
                    onChange={(e) => update("email", e.target.value)}
                    onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                    className={cn(FIELD_INPUT_CLASS, inputErrorClass(fieldError("email")))}
                  />
                </Field>
                <Field id="phone" label="Phone Number" required error={fieldError("phone")}>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="(555) 123-4567"
                    value={values.phone}
                    onChange={(e) => update("phone", formatPhone(e.target.value))}
                    onBlur={() => setTouched((p) => ({ ...p, phone: true }))}
                    className={cn(FIELD_INPUT_CLASS, inputErrorClass(fieldError("phone")))}
                  />
                </Field>
              </div>
            </section>
          )}

          {/* STEP 2 — Business Information */}
          {step === 1 && (
            <section>
              <SectionHeading
                index={2}
                title="Tell Us About Your Business"
                subtitle="We tailor lead sources to your industry."
              />
              <Field id="industry" label="Industry" required error={fieldError("industry")}>
                <Select
                  value={values.industry}
                  onValueChange={(v) => update("industry", v)}
                  onOpenChange={() => setTouched((p) => ({ ...p, industry: true }))}
                >
                  <SelectTrigger
                    id="industry"
                    aria-label="Industry"
                    className={cn(SELECT_TRIGGER_CLASS, inputErrorClass(fieldError("industry")))}
                  >
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((ind) => (
                      <SelectItem key={ind} value={ind}>
                        {ind}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {values.industry === "Other" && (
                <Field
                  id="customIndustry"
                  label="What industry are you in?"
                  required
                  error={fieldError("customIndustry")}
                  className="mt-4"
                >
                  <Input
                    id="customIndustry"
                    name="customIndustry"
                    placeholder="e.g. Solar Installation"
                    value={values.customIndustry}
                    onChange={(e) => update("customIndustry", e.target.value)}
                    onBlur={() => setTouched((p) => ({ ...p, customIndustry: true }))}
                    className={cn(FIELD_INPUT_CLASS, inputErrorClass(fieldError("customIndustry")))}
                  />
                </Field>
              )}
            </section>
          )}

          {/* STEP 3 — Service Area */}
          {step === 2 && (
            <section>
              <SectionHeading
                index={3}
                title="Where Do You Want Leads?"
                subtitle="Enter the ZIP codes or areas where you want us to generate opportunities. You can paste several ZIPs separated by commas."
              />

              <div className="mb-4 flex items-start gap-2 rounded-xl border border-border/70 bg-background/60 p-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Tip: paste multiple ZIP codes at once — e.g.{" "}
                  <span className="font-medium text-foreground">75001, 75007, 75010</span> — and
                  we'll split them into separate entries automatically.
                </p>
              </div>

              <div className="space-y-2.5">
                {values.zipCodes.map((zip, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex-1">
                      <label htmlFor={`zip-${i}`} className="sr-only">
                        ZIP Code #{i + 1}
                      </label>
                      <div className="relative">
                        <Input
                          id={`zip-${i}`}
                          inputMode="numeric"
                          pattern="\d{5}"
                          placeholder={`ZIP Code #${i + 1}`}
                          value={zip}
                          onChange={(e) => updateZip(i, e.target.value)}
                          className={cn(
                            "h-12 rounded-xl pl-12 text-base sm:text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring/40",
                            inputErrorClass(fieldError("zipCodes")),
                          )}
                        />
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                          {`#${i + 1}`}
                        </span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-12 shrink-0 rounded-xl"
                      onClick={() => removeZip(i)}
                      aria-label={`Remove ZIP code #${i + 1}`}
                      disabled={values.zipCodes.length === 1}
                    >
                      <Trash2 className="size-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={addZip}
                className="mt-3 h-11 w-full rounded-xl border-dashed text-sm font-medium"
              >
                <Plus className="size-4" />
                Add Another ZIP Code
              </Button>

              {zipError && (
                <p role="alert" className="mt-2 text-xs font-medium text-destructive">
                  {zipError}
                </p>
              )}

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field id="city" label="Primary City" required error={fieldError("city")}>
                  <Input
                    id="city"
                    name="city"
                    autoComplete="address-level2"
                    placeholder="Dallas"
                    value={values.city}
                    onChange={(e) => update("city", e.target.value)}
                    onBlur={() => setTouched((p) => ({ ...p, city: true }))}
                    className={cn(FIELD_INPUT_CLASS, inputErrorClass(fieldError("city")))}
                  />
                </Field>
                <Field id="state" label="State" required error={fieldError("state")}>
                  <Select
                    value={values.state}
                    onValueChange={(v) => update("state", v)}
                    onOpenChange={() => setTouched((p) => ({ ...p, state: true }))}
                  >
                    <SelectTrigger
                      id="state"
                      aria-label="State"
                      className={cn(SELECT_TRIGGER_CLASS, inputErrorClass(fieldError("state")))}
                    >
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      {US_STATES.map((st) => (
                        <SelectItem key={st} value={st}>
                          {st}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </section>
          )}

          {/* STEP 4 — Lead Delivery & Volume */}
          {step === 3 && (
            <section>
              <SectionHeading
                index={4}
                title="Lead Setup"
                subtitle="Where your leads go, who calls them, and how many you can take."
              />
              <StepLeadDelivery {...stepProps} />
            </section>
          )}

          {/* STEP 5 — Final Details + Agreement */}
          {step === 4 && (
            <section>
              <SectionHeading
                index={5}
                title="A Few Final Details"
                subtitle="Last few questions to finalize your campaign setup."
              />
              <StepFinalDetails {...stepProps} />

              <div className="mt-6 rounded-xl border border-border/70 bg-background/60 p-4">
                <label
                  htmlFor="agreement"
                  className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-foreground"
                >
                  <input
                    id="agreement"
                    type="checkbox"
                    checked={values.agreement}
                    onChange={(e) => update("agreement", e.target.checked)}
                    onBlur={() => setTouched((p) => ({ ...p, agreement: true }))}
                    className="mt-0.5 size-4 shrink-0 rounded border-input accent-[color:var(--color-primary)]"
                  />
                  <span>
                    I confirm that the information above is accurate and that my team is prepared to
                    contact the leads delivered to us.
                    <RequiredStar />
                  </span>
                </label>
                {fieldError("agreement") && (
                  <p role="alert" className="mt-2 pl-7 text-xs font-medium text-destructive">
                    {fieldError("agreement")}
                  </p>
                )}
                <p className="mt-3 pl-7 text-xs leading-relaxed text-muted-foreground">
                  By submitting, you agree to our{" "}
                  <a
                    href="/terms"
                    className="font-medium text-primary underline-offset-2 hover:underline"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    className="font-medium text-primary underline-offset-2 hover:underline"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </section>
          )}

          {/* Error + Navigation */}
          {submitError && (
            <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
              <X className="size-4 shrink-0" />
              {submitError}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-border/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {step > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  onClick={back}
                  disabled={submitting}
                  className="h-12 rounded-xl px-5 text-sm font-medium"
                >
                  <ArrowLeft className="size-4" />
                  Back
                </Button>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2 sm:flex-none sm:items-center sm:gap-3">
              {step < STEPS.length - 1 ? (
                <Button
                  type="button"
                  size="lg"
                  onClick={next}
                  className="h-12 rounded-xl px-8 text-base font-semibold"
                >
                  Continue
                  <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="lg"
                  disabled={submitting}
                  className="h-12 rounded-xl px-8 text-base font-semibold"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>Submit My Intake</>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>

      <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
        Your information is kept private and only used to set up and manage your lead campaign.
      </p>
    </div>
  );
}
