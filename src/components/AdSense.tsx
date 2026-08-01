"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { hasAnalyticsConsent } from "@/lib/consent";
import { ADSENSE_PUBLISHER_ID } from "@/lib/site";

// Auto ads: this one script is the entire integration - Google places ad
// units across the site itself, no per-page ad slots to maintain. Gated on
// the same cookie consent as Analytics.tsx, since AdSense also personalizes
// ads via cookies.
export default function AdSense() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const checkConsent = () => setConsented(hasAnalyticsConsent());
    checkConsent();
    window.addEventListener("consent-changed", checkConsent);
    return () => window.removeEventListener("consent-changed", checkConsent);
  }, []);

  if (!consented || !ADSENSE_PUBLISHER_ID) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
