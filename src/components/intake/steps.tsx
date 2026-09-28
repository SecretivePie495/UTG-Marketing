import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChoiceGroup, Field, inputErrorClass, YesNoGroup } from "@/components/intake/field";
import { LEAD_CALLERS, RESPONSE_TIMES } from "@/lib/intake-schema";
import { LeadVolumeCards } from "@/components/intake/lead-volume-cards";

type Values = Record<string, unknown> & {
  leadEmail: string;
  callbackPhone: string;
  secondaryLeadEmail: string;
  leadCaller?: string;
  customLeadCaller: string;
  requestedLeadVolume?: string;
  dailyLeadCapacity: string;
};

export const FIELD_INPUT_CLASS =
  "h-12 rounded-xl text-base sm:text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring/40";

type StepProps = {
  values: Values;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  update: <K extends keyof Values>(key: K, val: Values[K]) => void;
  setTouched: (updater: (p: Record<string, boolean>) => Record<string, boolean>) => void;
  fieldError: (key: string) => string;
};

export function StepLeadDelivery({ values, update, setTouched, fieldError }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 font-display text-base font-semibold tracking-tight text-foreground">
          Where Should We Send Your Leads?
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="leadEmail"
            label="Lead Notification Email"
            required
            error={fieldError("leadEmail")}
          >
            <Input
              id="leadEmail"
              name="leadEmail"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="leads@business.com"
              value={values.leadEmail}
              onChange={(e) => update("leadEmail", e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, leadEmail: true }))}
              className={cn(FIELD_INPUT_CLASS, inputErrorClass(fieldError("leadEmail")))}
            />
          </Field>
          <Field
            id="callbackPhone"
            label="Callback Phone Number"
            required
            error={fieldError("callbackPhone")}
          >
            <Input
              id="callbackPhone"
              name="callbackPhone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="(555) 123-4567"
              value={values.callbackPhone}
              onChange={(e) => update("callbackPhone", e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, callbackPhone: true }))}
              className={cn(FIELD_INPUT_CLASS, inputErrorClass(fieldError("callbackPhone")))}
            />
          </Field>
          <Field
            id="secondaryLeadEmail"
            label="Optional Secondary Email"
            error={fieldError("secondaryLeadEmail")}
            className="sm:col-span-2"
          >
            <Input
              id="secondaryLeadEmail"
              name="secondaryLeadEmail"
              type="email"
              inputMode="email"
              placeholder="backup@business.com"
              value={values.secondaryLeadEmail}
              onChange={(e) => update("secondaryLeadEmail", e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, secondaryLeadEmail: true }))}
              className={cn(FIELD_INPUT_CLASS, inputErrorClass(fieldError("secondaryLeadEmail")))}
            />
          </Field>
        </div>

        <Field
          id="leadCaller"
          label="Who will be calling the leads?"
          required
          error={fieldError("leadCaller")}
          className="mt-4"
        >
          <ChoiceGroup
            value={values.leadCaller}
            onValueChange={(v) => update("leadCaller", v)}
            options={LEAD_CALLERS.map((c) => ({ value: c, label: c }))}
          />
        </Field>
        {values.leadCaller === "Other" && (
          <Field
            id="customLeadCaller"
            label="Who calls the leads?"
            required
            error={fieldError("customLeadCaller")}
            className="mt-4"
          >
            <Input
              id="customLeadCaller"
              name="customLeadCaller"
              placeholder="Tell us who calls the leads"
              value={values.customLeadCaller}
              onChange={(e) => update("customLeadCaller", e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, customLeadCaller: true }))}
              className={cn(FIELD_INPUT_CLASS, inputErrorClass(fieldError("customLeadCaller")))}
            />
          </Field>
        )}
      </div>

      <div className="border-t border-border/70 pt-6">
        <h3 className="mb-1 font-display text-base font-semibold tracking-tight text-foreground">
          How Many Leads Can You Handle?
        </h3>
        <Field
          id="requestedLeadVolume"
          label="How many leads would you like to receive?"
          required
          error={fieldError("requestedLeadVolume")}
          className="mt-3"
        >
          <LeadVolumeCards
            value={values.requestedLeadVolume}
            onValueChange={(v) => update("requestedLeadVolume", v)}
          />
        </Field>

        <Field
          id="dailyLeadCapacity"
          label="What's the maximum number of new leads your team can handle per day?"
          required
          error={fieldError("dailyLeadCapacity")}
          hint="We'll use this to help control delivery volume."
          className="mt-4"
        >
          <Input
            id="dailyLeadCapacity"
            name="dailyLeadCapacity"
            type="number"
            inputMode="numeric"
            min={1}
            max={500}
            step={1}
            placeholder="5"
            value={values.dailyLeadCapacity}
            onChange={(e) => update("dailyLeadCapacity", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, dailyLeadCapacity: true }))}
            className={cn(
              FIELD_INPUT_CLASS,
              "max-w-[12rem]",
              inputErrorClass(fieldError("dailyLeadCapacity")),
            )}
          />
        </Field>
      </div>
    </div>
  );
}

export function StepFinalDetails({ values, update, setTouched, fieldError }: StepProps) {
  return (
    <div className="space-y-6">
      <Field
        id="responseTime"
        label="How quickly does your team normally contact a new lead?"
        required
        error={fieldError("responseTime")}
      >
        <ChoiceGroup
          value={values.responseTime as string | undefined}
          onValueChange={(v) => update("responseTime", v)}
          options={RESPONSE_TIMES.map((r) => ({ value: r, label: r }))}
        />
      </Field>

      <Field
        id="hasCaller"
        label="Do you currently have someone available to call new leads?"
        required
        error={fieldError("hasCaller")}
      >
        <YesNoGroup
          value={values.hasCaller as string | undefined}
          onValueChange={(v) => update("hasCaller", v)}
        />
      </Field>

      <Field
        id="usesCRM"
        label="Do you currently use a CRM?"
        required
        error={fieldError("usesCRM")}
      >
        <YesNoGroup
          value={values.usesCRM as string | undefined}
          onValueChange={(v) => update("usesCRM", v)}
        />
      </Field>

      {values.usesCRM === "Yes" && (
        <Field id="crmName" label="What CRM do you use?" required error={fieldError("crmName")}>
          <Input
            id="crmName"
            name="crmName"
            placeholder="e.g. HubSpot, Salesforce, GoHighLevel"
            value={values.crmName as string}
            onChange={(e) => update("crmName", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, crmName: true }))}
            className={cn(FIELD_INPUT_CLASS, inputErrorClass(fieldError("crmName")))}
          />
        </Field>
      )}
    </div>
  );
}
