import { z } from "zod";

export const INDUSTRIES = [
  "Roofing",
  "HVAC",
  "Plumbing",
  "Remodeling",
  "Tree Service",
  "Gutters",
  "Landscaping",
  "Painting",
  "Concrete",
  "Garage Doors",
  "Pest Control",
  "Water Filtration",
  "Holiday / Permanent Lighting",
  "Moving",
  "Other",
] as const;

export const LEAD_VOLUMES = ["10 Leads", "20 Leads", "30 Leads", "40 Leads", "Uncapped"] as const;

export const LEAD_CALLERS = ["Me", "Sales Team", "Office Staff", "Call Center", "Other"] as const;

export const RESPONSE_TIMES = [
  "Under 5 minutes",
  "5–15 minutes",
  "15–30 minutes",
  "30–60 minutes",
  "Over 1 hour",
] as const;

export const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "District of Columbia",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
] as const;

export const SUMMARY_KEY = "utg_media_intake_summary";

export const AUTOSAVE_KEY = "utg_media_intake_draft";

export const INTAKE_STEP_COUNT = 5;

export function clampStep(n: unknown): number {
  const num = Number(n);
  if (!Number.isFinite(num)) return 0;
  return Math.min(Math.max(Math.trunc(num), 0), INTAKE_STEP_COUNT - 1);
}

export function isEmptyIntake(v: FormState): boolean {
  return (
    !v.firstName &&
    !v.lastName &&
    !v.businessName &&
    !v.email &&
    !v.phone &&
    !v.industry &&
    !v.customIndustry &&
    v.zipCodes.every((z) => !z) &&
    !v.city &&
    !v.state &&
    !v.leadEmail &&
    !v.callbackPhone &&
    !v.secondaryLeadEmail &&
    !v.leadCaller &&
    !v.customLeadCaller &&
    !v.requestedLeadVolume &&
    !v.dailyLeadCapacity &&
    !v.responseTime &&
    !v.hasCaller &&
    !v.usesCRM &&
    !v.crmName &&
    !v.agreement
  );
}

const phoneSchema = z
  .string()
  .refine((s) => s.replace(/\D/g, "").length === 10, "Enter a valid 10-digit phone number");

const emailSchema = z
  .string()
  .trim()
  .min(1, "Enter your email address")
  .email("Enter a valid email address");

export const intakeSchema = z
  .object({
    firstName: z.string().trim().min(1, "Enter your first name"),
    lastName: z.string().trim().min(1, "Enter your last name"),
    businessName: z.string().trim().min(1, "Enter your business name"),
    email: emailSchema,
    phone: phoneSchema,
    industry: z.enum(INDUSTRIES, { message: "Select your industry" }),
    customIndustry: z.string().optional(),
    zipCodes: z
      .array(
        z
          .string()
          .trim()
          .regex(/^\d{5}$/, "Enter a valid 5-digit ZIP code"),
      )
      .min(1, "Add at least one ZIP code"),
    city: z.string().trim().min(1, "Enter your primary city"),
    state: z.string().min(1, "Select your state"),
    leadEmail: z
      .string()
      .trim()
      .min(1, "Enter a lead notification email")
      .email("Enter a valid email address"),
    callbackPhone: phoneSchema,
    secondaryLeadEmail: z.string().optional(),
    leadCaller: z.enum(LEAD_CALLERS, { message: "Select who calls the leads" }),
    customLeadCaller: z.string().optional(),
    requestedLeadVolume: z.enum(LEAD_VOLUMES, { message: "Choose a lead volume" }),
    dailyLeadCapacity: z.coerce
      .number()
      .int({ message: "Enter a whole number" })
      .min(1, "Enter at least 1")
      .max(500, "Enter up to 500"),
    responseTime: z.enum(RESPONSE_TIMES, { message: "Select a response time" }),
    hasCaller: z.enum(["Yes", "No"], { message: "Select yes or no" }),
    usesCRM: z.enum(["Yes", "No"], { message: "Select yes or no" }),
    crmName: z.string().optional(),
    agreement: z.boolean().refine((v) => v === true, "Please confirm to continue"),
  })
  .superRefine((v, ctx) => {
    if (v.industry === "Other" && !v.customIndustry?.trim()) {
      ctx.addIssue({ path: ["customIndustry"], message: "Tell us your industry", code: "custom" });
    }
    if (v.leadCaller === "Other" && !v.customLeadCaller?.trim()) {
      ctx.addIssue({
        path: ["customLeadCaller"],
        message: "Tell us who calls the leads",
        code: "custom",
      });
    }
    if (v.usesCRM === "Yes" && !v.crmName?.trim()) {
      ctx.addIssue({ path: ["crmName"], message: "Tell us which CRM you use", code: "custom" });
    }
    if (v.secondaryLeadEmail && v.secondaryLeadEmail.trim().length > 0) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.secondaryLeadEmail.trim())) {
        ctx.addIssue({
          path: ["secondaryLeadEmail"],
          message: "Enter a valid email address",
          code: "custom",
        });
      }
    }
  });

export type IntakeData = z.output<typeof intakeSchema>;

export type FormState = {
  firstName: string;
  lastName: string;
  businessName: string;
  email: string;
  phone: string;
  industry?: string;
  customIndustry: string;
  zipCodes: string[];
  city: string;
  state: string;
  leadEmail: string;
  callbackPhone: string;
  secondaryLeadEmail: string;
  leadCaller?: string;
  customLeadCaller: string;
  requestedLeadVolume?: string;
  dailyLeadCapacity: string;
  responseTime?: string;
  hasCaller?: string;
  usesCRM?: string;
  crmName: string;
  agreement: boolean;
};

export const initialValues: FormState = {
  firstName: "",
  lastName: "",
  businessName: "",
  email: "",
  phone: "",
  industry: undefined,
  customIndustry: "",
  zipCodes: [""],
  city: "",
  state: "",
  leadEmail: "",
  callbackPhone: "",
  secondaryLeadEmail: "",
  leadCaller: undefined,
  customLeadCaller: "",
  requestedLeadVolume: undefined,
  dailyLeadCapacity: "",
  responseTime: undefined,
  hasCaller: undefined,
  usesCRM: undefined,
  crmName: "",
  agreement: false,
};

export function validateIntake(data: unknown): {
  success: boolean;
  fieldErrors: Record<string, string>;
} {
  const r = intakeSchema.safeParse(data);
  if (r.success) return { success: true, fieldErrors: {} };
  const fieldErrors: Record<string, string> = {};
  for (const issue of r.error.issues) {
    const key = String(issue.path[0] ?? "_");
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return { success: false, fieldErrors };
}

export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length < 4) return `(${digits}`;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function parseZipTokens(raw: string): string[] {
  return raw
    .split(/[,\s\n]+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

export type IntakePayload = {
  firstName: string;
  lastName: string;
  businessName: string;
  email: string;
  phone: string;
  industry: string;
  customIndustry?: string;
  city: string;
  state: string;
  zipCodes: string[];
  leadEmail: string;
  secondaryLeadEmail?: string;
  callbackPhone: string;
  leadCaller: string;
  customLeadCaller?: string;
  requestedLeadVolume: string;
  dailyLeadCapacity: number;
  responseTime: string;
  hasCaller: string;
  usesCRM: string;
  crmName?: string;
  agreement: boolean;
  createdAt: string;
};

export function buildIntakePayload(values: FormState): IntakePayload {
  const zipCodes = (values.zipCodes ?? []).map((z) => z.trim()).filter(Boolean);
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    businessName: values.businessName.trim(),
    email: values.email.trim(),
    phone: values.phone,
    industry: values.industry ?? "",
    customIndustry:
      values.industry === "Other" ? values.customIndustry.trim() || undefined : undefined,
    city: values.city.trim(),
    state: values.state,
    zipCodes,
    leadEmail: values.leadEmail.trim(),
    secondaryLeadEmail: values.secondaryLeadEmail.trim() || undefined,
    callbackPhone: values.callbackPhone,
    leadCaller: values.leadCaller ?? "",
    customLeadCaller:
      values.leadCaller === "Other" ? values.customLeadCaller.trim() || undefined : undefined,
    requestedLeadVolume: values.requestedLeadVolume ?? "",
    dailyLeadCapacity: Number(values.dailyLeadCapacity) || 0,
    responseTime: values.responseTime ?? "",
    hasCaller: values.hasCaller ?? "",
    usesCRM: values.usesCRM ?? "",
    crmName: values.usesCRM === "Yes" ? values.crmName.trim() || undefined : undefined,
    agreement: values.agreement,
    createdAt: new Date().toISOString(),
  };
}
