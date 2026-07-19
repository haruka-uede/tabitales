export const SITE_URL = "https://japanese-novel-journey.com";
export const SITE_NAME = "Tabi Tales";
export const GA_MEASUREMENT_ID = "G-RVKYBFMY88";

export function jsonLdScript(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
