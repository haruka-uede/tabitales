export const SITE_URL = "https://japanese-novel-journey.com";
export const SITE_NAME = "Tabi Tales";

export function jsonLdScript(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
