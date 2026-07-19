"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { hasAnalyticsConsent } from "@/lib/consent";
import { GA_MEASUREMENT_ID } from "@/lib/site";

export default function Analytics() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const checkConsent = () => setConsented(hasAnalyticsConsent());
    checkConsent();
    window.addEventListener("consent-changed", checkConsent);
    return () => window.removeEventListener("consent-changed", checkConsent);
  }, []);

  if (!consented) return null;
  return <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />;
}
