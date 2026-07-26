import { slugify } from "./slug";

// Display-only Japanese titles for JA pages, keyed by the canonical `work`
// frontmatter value. The frontmatter itself stays romanized/untranslated on
// purpose - see .claude/commands/translate-article.md and src/lib/slug.ts.
// Falls back to the English title if unset. Same pattern as
// AUTHOR_PROFILES.nameJa in authorProfiles.ts.
export const WORK_NAMES_JA: Record<string, string> = {
  [slugify("No Longer Human")]: "人間失格",
  [slugify("Tsugaru")]: "津軽",
  [slugify("Cocktail Party")]: "カクテル・パーティー",
  [slugify("Black Rain")]: "黒い雨",
  [slugify("1Q84")]: "1Q84",
  [slugify("Kafka on the Shore")]: "海辺のカフカ",
  [slugify("Norwegian Wood")]: "ノルウェイの森",
  [slugify("A Wild Sheep Chase")]: "羊をめぐる冒険",
  [slugify("Botchan")]: "坊っちゃん",
  [slugify("I Am a Cat")]: "吾輩は猫である",
  [slugify("Kokoro")]: "こころ",
  [slugify("Kusamakura")]: "草枕",
  [slugify("Sanshiro")]: "三四郎",
  [slugify("Naomi")]: "痴人の愛",
  [slugify("A Portrait of Shunkin")]: "春琴抄",
};

export function getWorkNameJa(work: string): string {
  return WORK_NAMES_JA[slugify(work)] ?? work;
}
