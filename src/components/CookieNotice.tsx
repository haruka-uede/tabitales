"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStoredConsent, setStoredConsent } from "@/lib/consent";
import { Button } from "@/components/ui/button";
import { dictionary, href, type Locale } from "@/lib/i18n";

export default function CookieNotice({ locale = "en" as Locale }: { locale?: Locale }) {
  const t = dictionary[locale].cookieNotice;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // localStorage isn't available during SSR, so consent must be read after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(getStoredConsent() === null);
  }, []);

  if (!visible) return null;

  function choose(value: "accepted" | "declined") {
    setStoredConsent(value);
    setVisible(false);
  }

  return (
    <div className="fixed bottom-0 inset-x-0 border-t border-border bg-background z-20">
      <div className="max-w-4xl mx-auto px-6 py-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <p className="flex-1">
          {t.message}{" "}
          <Link href={href(locale, "/privacy-policy")} className="underline">
            {t.privacyPolicy}
          </Link>{" "}
          {t.messageSuffix}
        </p>
        <div className="flex gap-3 shrink-0">
          <Button variant="ghost" onClick={() => choose("declined")}>
            {t.decline}
          </Button>
          <Button onClick={() => choose("accepted")}>{t.accept}</Button>
        </div>
      </div>
    </div>
  );
}
