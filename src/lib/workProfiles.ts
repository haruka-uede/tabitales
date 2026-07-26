import { slugify } from "./slug";

// Display-only Japanese titles for JA pages, keyed by the canonical `work`
// frontmatter value. The frontmatter itself stays romanized/untranslated on
// purpose - see .claude/commands/translate-article.md and src/lib/slug.ts.
// Falls back to the English title if unset. Same pattern as
// AUTHOR_PROFILES.nameJa in authorProfiles.ts.
export const WORK_NAMES_JA: Record<string, string> = {
  [slugify("No Longer Human")]: "人間失格",
  [slugify("Tsugaru")]: "津軽",
};

export function getWorkNameJa(work: string): string {
  return WORK_NAMES_JA[slugify(work)] ?? work;
}
