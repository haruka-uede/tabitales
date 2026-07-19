const STORAGE_KEY = "cookie-consent";

export type ConsentValue = "accepted" | "declined";

export function getStoredConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === "accepted" || value === "declined" ? value : null;
}

export function setStoredConsent(value: ConsentValue): void {
  window.localStorage.setItem(STORAGE_KEY, value);
}

export function hasAnalyticsConsent(): boolean {
  return getStoredConsent() === "accepted";
}
