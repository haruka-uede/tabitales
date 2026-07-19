"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { JAPAN_MAP, REGION_OF_PREFECTURE } from "@/lib/japanMap";
import { slugify } from "@/lib/slug";
import type { Article } from "@/lib/articles";

type PrefectureData = {
  id: string;
  name: string;
  articles: Article[];
};

type Box = { x: number; y: number; width: number; height: number };

export default function DestinationsMap({
  prefectures,
}: {
  prefectures: PrefectureData[];
}) {
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
    setRegionBoxes(boxes);
  }, []);

  const regionArticleCount = (region: string) =>
    (byRegion.get(region) ?? []).reduce((sum, p) => sum + p.articles.length, 0);

  return (
    <div className="grid sm:grid-cols-[1fr_260px] gap-6 mb-12">
      <svg
        viewBox={JAPAN_MAP.viewBox}
        className="w-full h-auto border border-neutral-200 rounded-lg bg-neutral-50"
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
                isHovered ? "fill-neutral-900" : hasArticles ? "fill-neutral-500" : "fill-neutral-200"
              }
            />
          );
        })}

        {Object.entries(regionBoxes)
          .filter(([region]) => regionArticleCount(region) > 0)
          .map(([region, box]) => (
            <Link key={region} href={`/${slugify(region)}`} aria-label={region}>
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
            <h3 className="text-lg font-medium mb-1">{hoveredRegion}</h3>
            <p className="text-neutral-500">
              {regionArticleCount(hoveredRegion)} guide{regionArticleCount(hoveredRegion) === 1 ? "" : "s"}
            </p>
          </div>
        ) : (
          <p className="text-neutral-500">Tap a highlighted region to see its guides.</p>
        )}
      </div>
    </div>
  );
}
