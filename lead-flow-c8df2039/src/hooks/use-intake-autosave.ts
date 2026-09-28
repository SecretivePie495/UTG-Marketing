import { useCallback, useEffect, useRef, useState } from "react";

import {
  AUTOSAVE_KEY,
  clampStep,
  initialValues,
  isEmptyIntake,
  type FormState,
} from "@/lib/intake-schema";

type StoredDraft = {
  v: number;
  values: FormState;
  step: number;
  savedAt: number;
};

const DRAFT_VERSION = 1;

function isFreshDraft(d: StoredDraft | null): d is StoredDraft {
  if (!d) return false;
  if (d.v !== DRAFT_VERSION) return false;
  if (!d.values || typeof d.values !== "object") return false;
  if (!Array.isArray(d.values.zipCodes)) return false;
  return true;
}

function readDraft(): { values: FormState; step: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTOSAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredDraft;
    if (!isFreshDraft(parsed)) return null;
    return { values: { ...initialValues, ...parsed.values }, step: clampStep(parsed.step) };
  } catch {
    return null;
  }
}

function writeDraft(values: FormState, step: number) {
  if (typeof window === "undefined") return;
  try {
    if (isEmptyIntake(values)) {
      window.localStorage.removeItem(AUTOSAVE_KEY);
      return;
    }
    const draft: StoredDraft = {
      v: DRAFT_VERSION,
      values,
      step: clampStep(step),
      savedAt: Date.now(),
    };
    window.localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(draft));
  } catch {
    /* quota / privacy mode — ignore */
  }
}

/**
 * Autosave the in-progress intake to localStorage so a refresh or accidental
 * tab close doesn't lose entered data.
 *
 * - `draft` is `null` until the component mounts and reads storage (SSR-safe:
 *   the first client render matches the server render, then the draft is
 *   restored in an effect). Apply it once via the returned `applyDraft`
 *   helper inside a useEffect.
 * - Call `sync(values, step)` whenever the live form state changes — it
 *   schedules a debounced write (400ms).
 * - `clear()` wipes the draft after a successful submit; `discard()` also
 *   clears the in-memory snapshot (for "Start over").
 */
export function useIntakeAutosave() {
  const [draft, setDraft] = useState<{ values: FormState; step: number } | null>(null);

  // Read any saved draft once, after mount (browser-only, post first paint).
  useEffect(() => {
    const restored = readDraft();
    if (restored) setDraft(restored);
  }, []);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestRef = useRef<{ values: FormState; step: number }>({
    values: initialValues,
    step: 0,
  });

  const sync = useCallback((values: FormState, step: number) => {
    latestRef.current = { values, step };
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      writeDraft(latestRef.current.values, latestRef.current.step);
    }, 400);
  }, []);

  const clear = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    latestRef.current = { values: initialValues, step: 0 };
    setDraft(null);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(AUTOSAVE_KEY);
      } catch {
        /* ignore */
      }
    }
  }, []);

  const discard = useCallback(() => {
    clear();
  }, [clear]);

  // Flush on tab close / navigation away.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      writeDraft(latestRef.current.values, latestRef.current.step);
    };
    window.addEventListener("pagehide", handler);
    return () => {
      window.removeEventListener("pagehide", handler);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return {
    draft,
    sync,
    clear,
    discard,
  };
}
