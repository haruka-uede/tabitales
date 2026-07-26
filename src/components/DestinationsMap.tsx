"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { JAPAN_MAP, REGION_OF_PREFECTURE, getPlaceNameJa } from "@/lib/japanMap";
import { slugify } from "@/lib/slug";
import { href as localeHref, type Locale } from "@/lib/i18n";
import type { Article } from "@/lib/articles";

type PrefectureData = {
  id: string;
  name: string;
  articles: Article[];
};

type Box = { x: number; y: number; width: number; height: number };

const COPY = {
  en: {
    guide: (count: number) => `${count} guide${count === 1 ? "" : "s"}`,
    prompt: "Tap a highlighted region to see its guides.",
  },
  ja: {
    guide: (count: number) => `${count}件のガイド`,
    prompt: "地図の色付きのエリアをタップすると、そのガイド一覧が表示されます。",
  },
} satisfies Record<Locale, unknown>;

export default function DestinationsMap({
  prefectures,
  locale = "en" as Locale,
}: {
  prefectures: PrefectureData[];
  locale?: Locale;
}) {
  const t = COPY[locale];
  const pathRefs = useRef<Record<string, SVGPathElement | null>>({});
  const [regionBoxes, setRegionBoxes] = useState<Record<string, Box>>({});
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const byRegion = new Map<string, PrefectureData[]>();
  for (const prefecture of prefectures) {
    const region = REGION_OF_PREFECTURE[prefecture.id];
    byRegion.set(region, [...(byRegion.get(region) ?? []), prefecture]);
  }

  // Tap targets follow each region's bounding box rather than the exact
  // coastline shape - a concave prefecture outline (e.g. Tokyo Bay) can leave
  // its own visual center unfilled, which makes precise taps miss entirely
  // on touch devices. A bounding box spanning the whole region is far more
  // forgiving, and since every prefecture in a region now leads to the same
  // page, there's no precision to lose by being generous here.
  useEffect(() => {
    const boxes: Record<string, Box> = {};
    for (const location of JAPAN_MAP.locations) {
      const el = pathRefs.current[location.id];
      if (!el) continue;
      const bbox = el.getBBox();
      const region = REGION_OF_PREFECTURE[location.id];
      const existing = boxes[region];
      boxes[region] = existing
        ? {
            x: Math.min(existing.x, bbox.x),
            y: Math.min(existing.y, bbox.y),
            width: Math.max(existing.x + existing.width, bbox.x + bbox.width) - Math.min(existing.x, bbox.x),
            height: Math.max(existing.y + existing.height, bbox.y + bbox.height) - Math.min(existing.y, bbox.y),
          }
        : { x: bbox.x, y: bbox.y, width: bbox.width, height: bbox.height };
    }
    // getBBox() needs the SVG paths to be painted first, so this can only run post-mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRegionBoxes(boxes);
  }, []);

  const regionArticleCount = (region: string) =>
    (byRegion.get(region) ?? []).reduce((sum, p) => sum + p.articles.length, 0);

  return (
    <div className="grid sm:grid-cols-[1fr_260px] gap-6 mb-12">
      <svg
        viewBox={JAPAN_MAP.viewBox}
        className="w-full h-auto border border-border rounded-lg bg-muted"
      >
        {JAPAN_MAP.locations.map((location) => {
          const region = REGION_OF_PREFECTURE[location.id];
          const hasArticles = regionArticleCount(region) > 0;
          const isHovered = hoveredRegion === region;

          return (
            <path
              key={location.id}
              ref={(el) => {
                pathRefs.current[location.id] = el;
              }}
              d={location.path}
              className={
                isHovered ? "fill-foreground" : hasArticles ? "fill-muted-foreground" : "fill-border"
              }
            />
          );
        })}

        {Object.entries(regionBoxes)
          .filter(([region]) => regionArticleCount(region) > 0)
          .map(([region, box]) => (
            <Link
              key={region}
              href={localeHref(locale, `/${slugify(region)}`)}
              aria-label={locale === "ja" ? getPlaceNameJa(region) : region}
            >
              <rect
                x={box.x}
                y={box.y}
                width={box.width}
                height={box.height}
                fill="transparent"
                style={{ pointerEvents: "all" }}
                className="cursor-pointer outline-none"
                onMouseEnter={() => setHoveredRegion(region)}
                onMouseLeave={() => setHoveredRegion((r) => (r === region ? null : r))}
                onFocus={() => setHoveredRegion(region)}
                onBlur={() => setHoveredRegion((r) => (r === region ? null : r))}
              />
            </Link>
          ))}
      </svg>

      <div className="text-sm">
        {hoveredRegion ? (
          <div>
            <h3 className="text-lg font-medium mb-1">
              {locale === "ja" ? getPlaceNameJa(hoveredRegion) : hoveredRegion}
            </h3>
            <p className="text-muted-foreground">{t.guide(regionArticleCount(hoveredRegion))}</p>
          </div>
        ) : (
          <p className="text-muted-foreground">{t.prompt}</p>
        )}
      </div>
    </div>
  );
}
