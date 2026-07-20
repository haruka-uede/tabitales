import japanMapData from "@svg-maps/japan";
import { slugify } from "./slug";

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

// A destination tag is always either a region name or a prefecture id, per
// the destination tagging rule (no municipality level yet) - so this always
// resolves to either /{region} or /{region}/{prefecture}.
export function getDestinationHref(name: string): string | null {
  const slug = slugify(name);
  if (REGION_NAMES.some((region) => slugify(region) === slug)) {
    return `/${slug}`;
  }
  if (PREFECTURE_IDS.has(slug)) {
    return `/${slugify(REGION_OF_PREFECTURE[slug])}/${slug}`;
  }
  return null;
}
