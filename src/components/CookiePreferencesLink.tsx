"use client";

import { openCookiePreferences } from "@/lib/consent";
import { dictionary, type Locale } from "@/lib/i18n";

export default function CookiePreferencesLink({ locale = "en" as Locale }: { locale?: Locale }) {
  const t = dictionary[locale].footer;

  return (
    <button
      type="button"
      onClick={openCookiePreferences}
      className="text-inherit hover:underline cursor-pointer"
    >
      {t.cookiePreferences}
    </button>
  );
}
