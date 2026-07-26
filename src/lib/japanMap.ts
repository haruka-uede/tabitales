import japanMapData from "@svg-maps/japan";
import { slugify } from "./slug";
import { href, type Locale } from "./i18n";

export type JapanMapLocation = {
  id: string;
  name: string;
  path: string;
};

export type JapanMap = {
  label: string;
  viewBox: string;
  locations: JapanMapLocation[];
};

export const JAPAN_MAP = japanMapData as unknown as JapanMap;

export const PREFECTURE_IDS = new Set(JAPAN_MAP.locations.map((location) => location.id));

export const REGION_OF_PREFECTURE: Record<string, string> = {
  hokkaido: "Hokkaido",
  aomori: "Tohoku",
  iwate: "Tohoku",
  miyagi: "Tohoku",
  akita: "Tohoku",
  yamagata: "Tohoku",
  fukushima: "Tohoku",
  tokyo: "Kanto",
  kanagawa: "Kanto",
  chiba: "Kanto",
  saitama: "Kanto",
  ibaraki: "Kanto",
  tochigi: "Kanto",
  gunma: "Kanto",
  niigata: "Chubu",
  toyama: "Chubu",
  ishikawa: "Chubu",
  fukui: "Chubu",
  yamanashi: "Chubu",
  nagano: "Chubu",
  gifu: "Chubu",
  shizuoka: "Chubu",
  aichi: "Chubu",
  mie: "Kansai",
  shiga: "Kansai",
  kyoto: "Kansai",
  osaka: "Kansai",
  hyogo: "Kansai",
  nara: "Kansai",
  wakayama: "Kansai",
  tottori: "Chugoku",
  shimane: "Chugoku",
  okayama: "Chugoku",
  hiroshima: "Chugoku",
  yamaguchi: "Chugoku",
  tokushima: "Shikoku",
  kagawa: "Shikoku",
  ehime: "Shikoku",
  kochi: "Shikoku",
  fukuoka: "Kyushu",
  saga: "Kyushu",
  nagasaki: "Kyushu",
  kumamoto: "Kyushu",
  oita: "Kyushu",
  miyazaki: "Kyushu",
  kagoshima: "Kyushu",
  okinawa: "Kyushu",
};

export const REGION_NAMES = [...new Set(Object.values(REGION_OF_PREFECTURE))];

// Display-only Japanese names for regions and prefectures, keyed by the same
// slug/id used everywhere else (region slug or prefecture id - they don't
// collide). Same pattern as AUTHOR_PROFILES.nameJa: filled in as JA articles
// reference new places, falls back to the English name if unset.
export const PLACE_NAMES_JA: Record<string, string> = {
  // Regions
  [slugify("Hokkaido")]: "北海道",
  [slugify("Tohoku")]: "東北",
  [slugify("Kanto")]: "関東",
  [slugify("Chubu")]: "中部",
  [slugify("Kansai")]: "関西",
  [slugify("Chugoku")]: "中国",
  [slugify("Shikoku")]: "四国",
  [slugify("Kyushu")]: "九州",
  // Prefectures
  hokkaido: "北海道",
  aomori: "青森",
  iwate: "岩手",
  miyagi: "宮城",
  akita: "秋田",
  yamagata: "山形",
  fukushima: "福島",
  tokyo: "東京",
  kanagawa: "神奈川",
  chiba: "千葉",
  saitama: "埼玉",
  ibaraki: "茨城",
  tochigi: "栃木",
  gunma: "群馬",
  niigata: "新潟",
  toyama: "富山",
  ishikawa: "石川",
  fukui: "福井",
  yamanashi: "山梨",
  nagano: "長野",
  gifu: "岐阜",
  shizuoka: "静岡",
  aichi: "愛知",
  mie: "三重",
  shiga: "滋賀",
  kyoto: "京都",
  osaka: "大阪",
  hyogo: "兵庫",
  nara: "奈良",
  wakayama: "和歌山",
  tottori: "鳥取",
  shimane: "島根",
  okayama: "岡山",
  hiroshima: "広島",
  yamaguchi: "山口",
  tokushima: "徳島",
  kagawa: "香川",
  ehime: "愛媛",
  kochi: "高知",
  fukuoka: "福岡",
  saga: "佐賀",
  nagasaki: "長崎",
  kumamoto: "熊本",
  oita: "大分",
  miyazaki: "宮崎",
  kagoshima: "鹿児島",
  okinawa: "沖縄",
};

export function getPlaceNameJa(name: string): string {
  return PLACE_NAMES_JA[slugify(name)] ?? name;
}

// A destination tag is always either a region name or a prefecture id, per
// the destination tagging rule (no municipality level yet) - so this always
// resolves to either /{region} or /{region}/{prefecture} (with a /ja prefix
// for locale "ja").
export function getDestinationHref(name: string, locale: Locale = "en"): string | null {
  const slug = slugify(name);
  if (REGION_NAMES.some((region) => slugify(region) === slug)) {
    return href(locale, `/${slug}`);
  }
  if (PREFECTURE_IDS.has(slug)) {
    return href(locale, `/${slugify(REGION_OF_PREFECTURE[slug])}/${slug}`);
  }
  return null;
}
