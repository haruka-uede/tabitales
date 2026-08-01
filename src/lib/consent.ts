const STORAGE_KEY = "cookie-consent";

// After a decline, ask again on the next visit past this many hours - people
// change their minds, and a stale decline shouldn't be permanent.
const RECONSENT_AFTER_MS = 3 * 60 * 60 * 1000;

export type ConsentValue = "accepted" | "declined";

interface StoredConsent {
  value: ConsentValue;
  ts: number;
}

function readStored(): StoredConsent | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  // Pre-timestamp storage was a bare "accepted"/"declined" string; treat
  // that as timestamp 0 so existing decliners get re-prompted right away.
  if (raw === "accepted" || raw === "declined") return { value: raw, ts: 0 };
  try {
    const parsed = JSON.parse(raw);
    if (parsed && (parsed.value === "accepted" || parsed.value === "declined")) {
      return { value: parsed.value, ts: typeof parsed.ts === "number" ? parsed.ts : 0 };
    }
  } catch {
    // ignore malformed storage
  }
  return null;
}

export function getStoredConsent(): ConsentValue | null {
  return readStored()?.value ?? null;
}

export function setStoredConsent(value: ConsentValue): void {
  const stored: StoredConsent = { value, ts: Date.now() };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  window.dispatchEvent(new Event("consent-changed"));
}

export function hasAnalyticsConsent(): boolean {
  return getStoredConsent() === "accepted";
}

// Whether the cookie banner should be showing right now: no decision yet,
// or a decline old enough that it's worth asking again.
export function shouldShowConsentBanner(): boolean {
  const stored = readStored();
  if (!stored) return true;
  return stored.value === "declined" && Date.now() - stored.ts > RECONSENT_AFTER_MS;
}

// Lets UI outside the banner (e.g. a footer link) reopen it on demand,
// regardless of what's currently stored.
export function openCookiePreferences(): void {
  window.dispatchEvent(new Event("open-cookie-preferences"));
}
