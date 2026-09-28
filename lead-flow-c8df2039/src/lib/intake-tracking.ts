import type { IntakePayload } from "./intake-schema";

// trackingPayload.formData/formLabels are only for standard CRM field keys.
// Non-standard/custom fields must go through customFields/fileFields/imageDataFields
// using the id returned by register_custom_field. Labels stay human-readable.
type StandardTrackingFieldKey = string;
type RegisteredCustomFieldId = string;
type TrackingCustomField = { value?: unknown; label: string };
type TrackingFileField = { file?: File; label: string };
type TrackingImageDataField = { dataUrl?: string; label: string };

export const INTAKE_FORM_ID = "utg-media-intake";
export const INTAKE_FORM_NAME = "UTG Media Intake";
export const INTAKE_TRACKING_ID = "tk_018e3d79011b4c69bb53260b71e3f004";
export const INTAKE_LOCATION_ID = "efJj9AaTqCJlFOFsimRU";
export const INTAKE_PROJECT_ID = "1790574851436916324";

// Custom-field IDs returned by register_custom_field for this intake form.
const FIELD = {
  industry: "3lI6B9E1s7ltzSqUW97c",
  customIndustry: "mL6nrgSRzHpgSmoAfJaz",
  zipCodes: "am2sbpKugo14th7zU0QL",
  leadEmail: "dd3ulgzBcT3UtX47d4qh",
  callbackPhone: "OPSzu0qZvzVP4Uxjv5yi",
  secondaryLeadEmail: "CbzdLHWLNzbNpKjrTy5C",
  leadCaller: "TfAKv5TpTlZkf2DrFmsB",
  customLeadCaller: "f7A2kLiSjkr0ZU8bSBYy",
  requestedLeadVolume: "5YNkmnEFJANQWTZTa57g",
  dailyLeadCapacity: "zyXziSGsBJlB7SuIJvoo",
  responseTime: "bemeUxNCtJx4kLTKqbU8",
  hasCaller: "AjiaI3WAAyfJi0DM7kzg",
  usesCRM: "ASZ3P6Z05CdGyW0Whruk",
  crmName: "bLwzcCoImwCkCZ8r7e9R",
  agreement: "3QmkkGlL8rbooRa6X5oL",
} as const;

const postTrackingEvent = (
  trackingPayload: Record<string, unknown> & {
    formData: Record<StandardTrackingFieldKey, unknown>;
    formLabels: Record<StandardTrackingFieldKey, string>;
  },
  options: {
    customFields?: Record<RegisteredCustomFieldId, TrackingCustomField>;
    fileFields?: Record<RegisteredCustomFieldId, TrackingFileField>;
    imageDataFields?: Record<RegisteredCustomFieldId, TrackingImageDataField>;
  } = {},
) => {
  const { customFields = {}, fileFields = {}, imageDataFields = {} } = options;
  const eventPayload = {
    ...trackingPayload,
    formData: { ...trackingPayload.formData },
    formLabels: { ...trackingPayload.formLabels },
  };
  const body = new FormData();

  for (const [key, field] of Object.entries(customFields)) {
    if (field.value === undefined || field.value === "") continue;
    eventPayload.formData[key] = field.value;
    eventPayload.formLabels[key] = field.label;
  }

  for (const [key, field] of Object.entries(imageDataFields)) {
    const dataUrl = field.dataUrl;
    if (!dataUrl) continue;
    if (!dataUrl.startsWith("data:image/")) {
      throw new Error("Image data field must be a data:image/* base64 string");
    }
    eventPayload.formData[key] = dataUrl;
    eventPayload.formLabels[key] = field.label;
  }

  for (const [key, field] of Object.entries(fileFields)) {
    const file = field.file;
    if (!file) continue;
    if (file.size > 50 * 1024 * 1024) {
      throw new Error("File must be 50 MB or smaller");
    }
    eventPayload.formData[key] = {
      filename: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
    };
    eventPayload.formLabels[key] = field.label;
    body.append(key, file, file.name);
  }

  for (const key of Object.keys(eventPayload.formData)) {
    eventPayload.formLabels[key] ||= key;
  }

  body.append("event", JSON.stringify(eventPayload));

  fetch("https://backend.leadconnectorhq.com/external-tracking/events", {
    method: "POST",
    headers: {
      version: "2021-07-28",
    },
    body,
  }).catch(() => {}); // Fire-and-forget — don't block form UX
};

/**
 * Fire the CRM form-tracking event for a submitted intake. Safe to call from
 * a client event handler only — it reads browser globals.
 */
export function postIntakeTracking(payload: IntakePayload): void {
  if (typeof window === "undefined") return;

  const sessionId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : String(Date.now());

  const trackingPayload = {
    type: "external_form_submission",
    timestamp: Date.now(),
    formId: INTAKE_FORM_ID,
    formData: {
      first_name: payload.firstName,
      last_name: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      organization: payload.businessName,
      city: payload.city,
      state: payload.state,
    },
    formLabels: {
      first_name: "First Name",
      last_name: "Last Name",
      email: "Email Address",
      phone: "Phone Number",
      organization: "Business Name",
      city: "Primary City",
      state: "State",
    },
    url: window.location.href,
    title: document.title,
    path: window.location.pathname,
    userAgent: navigator.userAgent,
    trackingId: INTAKE_TRACKING_ID,
    locationId: INTAKE_LOCATION_ID,
    projectId: INTAKE_PROJECT_ID,
    sessionId,
    properties: {
      deviceType: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? "mobile" : "desktop",
      source: "ai_studio",
      projectId: INTAKE_PROJECT_ID,
      formName: INTAKE_FORM_NAME,
    },
  };

  postTrackingEvent(trackingPayload, {
    customFields: {
      [FIELD.industry]: { value: payload.industry, label: "Industry" },
      [FIELD.customIndustry]: { value: payload.customIndustry, label: "Custom Industry" },
      [FIELD.zipCodes]: { value: payload.zipCodes.join(", "), label: "Service Area ZIP Codes" },
      [FIELD.leadEmail]: { value: payload.leadEmail, label: "Lead Notification Email" },
      [FIELD.callbackPhone]: { value: payload.callbackPhone, label: "Callback Phone Number" },
      [FIELD.secondaryLeadEmail]: {
        value: payload.secondaryLeadEmail,
        label: "Secondary Lead Email",
      },
      [FIELD.leadCaller]: { value: payload.leadCaller, label: "Lead Caller" },
      [FIELD.customLeadCaller]: { value: payload.customLeadCaller, label: "Custom Lead Caller" },
      [FIELD.requestedLeadVolume]: {
        value: payload.requestedLeadVolume,
        label: "Requested Lead Volume",
      },
      [FIELD.dailyLeadCapacity]: { value: payload.dailyLeadCapacity, label: "Daily Lead Capacity" },
      [FIELD.responseTime]: { value: payload.responseTime, label: "Response Time" },
      [FIELD.hasCaller]: { value: payload.hasCaller, label: "Has Caller Available" },
      [FIELD.usesCRM]: { value: payload.usesCRM, label: "Uses CRM" },
      [FIELD.crmName]: { value: payload.crmName, label: "CRM Name" },
      [FIELD.agreement]: {
        value: payload.agreement ? "Confirmed" : undefined,
        label: "Intake Agreement Confirmed",
      },
    },
  });
}
