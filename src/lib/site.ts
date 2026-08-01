export const SITE_URL = "https://www.tabitales.jp";
export const SITE_NAME = "Tabi Tales";
// Next.js doesn't merge `openGraph.images` from a layout into a page/segment
// that declares its own `openGraph` object (the child's openGraph replaces
// the parent's wholesale, not field-by-field) - so every page that sets its
// own openGraph must include this explicitly rather than relying on the
// root layout's default.
export const OG_IMAGE = { url: "/og-image.png", width: 1731, height: 909 };
export const GA_MEASUREMENT_ID = "G-RVKYBFMY88";
// Set once the AdSense account is approved and the publisher ID is known
// (ca-pub-... - not secret, it's meant to appear in every page's HTML).
// Empty string means AdSense.tsx renders nothing, same graceful-degradation
// pattern as the affiliate links in affiliate.ts.
export const ADSENSE_PUBLISHER_ID = "ca-pub-9552432993225643";

export function jsonLdScript(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
