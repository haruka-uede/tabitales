import { slugify } from "./slug";

export type AuthorProfile = {
  // Display-only Japanese name for JA pages. The canonical `authors`
  // frontmatter field (used for slugs and Booking.com lookups) stays
  // romanized/untranslated on purpose - see .claude/commands/translate-article.md
  // and src/lib/slug.ts. Falls back to the romanized name if unset.
  nameJa?: string;
  blurb?: string;
  // JA equivalent of blurb, not a translation pulled at render time - filled
  // in as needed, same incremental pattern as nameJa. Only shown on JA pages
  // (blurb itself stays EN-only); no fallback, since showing the EN blurb on
  // a JA page reintroduces the exact "written for foreigners" tone problem
  // .claude/commands/translate-article.md's tone pass exists to avoid.
  blurbJa?: string;
};

export const AUTHOR_PROFILES: Record<string, AuthorProfile> = {
  [slugify("Haruki Murakami")]: {
    nameJa: "村上春樹",
    blurb:
      "One of the most internationally recognized Japanese novelists. His Tokyo — jazz bars, quiet cafés, city walks — is a recurring backdrop across his fiction.",
  },
  [slugify("Osamu Dazai")]: {
    nameJa: "太宰治",
    blurb:
      "Dazai's memoir Tsugaru retraces his rural hometown in northern Japan, from his family's preserved mansion in Kanagi to the remote coastal village of Kodomari.",
    blurbJa:
      "紀行文『津軽』では、生家のある金木から、幼い頃の太宰を育てた「たけ」と再会した小泊まで、青森県北部の故郷を辿る旅の道のりが描かれている。",
  },
  [slugify("Keigo Higashino")]: {
    blurb:
      "A contemporary mystery writer whose novels — several adapted into hit films and shows — are tied to real, specific settings across Japan.",
  },
  [slugify("Natsume Soseki")]: {
    nameJa: "夏目漱石",
    blurb:
      "Widely considered the most important novelist of modern Japan. His novels map onto real places he lived and taught — from a Shikoku bathhouse to a Tokyo cemetery where he's actually buried.",
  },
  [slugify("Junichiro Tanizaki")]: {
    nameJa: "谷崎潤一郎",
    blurb:
      "Tanizaki lived out much of what he wrote in Naomi: in the early 1920s he moved to Yokohama's Westernized Yamate district and took up the same ballroom dancing and fashion he later gave his characters, before the 1923 Great Kanto Earthquake forced him to relocate to the Kansai region.",
  },
  [slugify("Tatsuhiro Oshiro")]: {
    nameJa: "大城立裕",
    blurb:
      "Oshiro grew up in central Okinawa under the decades of U.S. military administration that followed the war, and became the first Okinawan-born author to win the Akutagawa Prize, for Cocktail Party in 1967.",
    blurbJa:
      "大城立裕は、戦後の沖縄で27年間続いた米軍統治のもとで育った。1967年、『カクテル・パーティー』で沖縄出身作家として初めて芥川賞を受賞している。",
  },
  [slugify("Masuji Ibuse")]: {
    nameJa: "井伏鱒二",
    blurb:
      "Ibuse wrote about ordinary lives with a dry, understated humor across a long career, most famously in Black Rain (1966) — built from a real atomic-bomb survivor's diary rather than an invented account.",
    blurbJa:
      "井伏鱒二は、生涯を通じて市井の人々の暮らしを、抑えた筆致とユーモアで描き続けた作家である。代表作『黒い雨』(1966年)は、実在する被爆者の日記をもとに書かれている。",
  },
};

export function getAuthorNameJa(slug: string, fallback: string): string {
  return AUTHOR_PROFILES[slug]?.nameJa ?? fallback;
}
