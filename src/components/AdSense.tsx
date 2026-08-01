import Script from "next/script";
import { ADSENSE_PUBLISHER_ID } from "@/lib/site";

// Auto ads: this one script is the entire integration - Google places ad
// units across the site itself, no per-page ad slots to maintain. Not
// gated on cookie consent (unlike Analytics.tsx and BuyBookButton.tsx) -
// the target audience (US/JP) doesn't carry a legal requirement to gate ad
// personalization on opt-in consent the way EEA/UK/CH visitors would, and
// implementing that properly means Google Consent Mode + a certified CMP,
// which isn't worth the complexity for now. Revisit if EU/UK/CH traffic
// becomes significant - the rest of the consent infrastructure
// (consent.ts, CookieNotice, the footer preferences link) is untouched and
// ready to gate this again then.
export default function AdSense() {
  if (!ADSENSE_PUBLISHER_ID) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
