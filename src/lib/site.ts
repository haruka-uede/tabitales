export const SITE_URL = "https://www.tabitales.jp";
export const SITE_NAME = "Tabi Tales";
export const GA_MEASUREMENT_ID = "G-RVKYBFMY88";
// Set once the AdSense account is approved and the publisher ID is known
// (ca-pub-... - not secret, it's meant to appear in every page's HTML).
// Empty string means AdSense.tsx renders nothing, same graceful-degradation
// pattern as the affiliate links in affiliate.ts.
export const ADSENSE_PUBLISHER_ID = "ca-pub-9552432993225643";

export function jsonLdScript(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
