"use client";

import { useState } from "react";
import Link from "next/link";
import { JAPAN_MAP, REGION_OF_PREFECTURE } from "@/lib/japanMap";
import { slugify } from "@/lib/slug";
import type { Article } from "@/lib/articles";

type PrefectureData = {
  id: string;
  name: string;
  articles: Article[];
};

export default function DestinationsMap({
  prefectures,
}: {
  prefectures: PrefectureData[];
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const byId = new Map(prefectures.map((p) => [p.id, p]));
  const active = activeId ? byId.get(activeId) : undefined;
  const activeRegion = active ? REGION_OF_PREFECTURE[active.id] : null;

  return (
    <div className="grid sm:grid-cols-[1fr_260px] gap-6 mb-12">
      <svg
        viewBox={JAPAN_MAP.viewBox}
        className="w-full h-auto border border-neutral-200 rounded-lg bg-neutral-50"
      >
        {JAPAN_MAP.locations.map((location) => {
          const data = byId.get(location.id);
          const hasArticles = !!data && data.articles.length > 0;
          const isActiveRegion =
            !!activeRegion && REGION_OF_PREFECTURE[location.id] === activeRegion;

          return (
            <path
              key={location.id}
              d={location.path}
              tabIndex={hasArticles ? 0 : -1}
              role={hasArticles ? "button" : undefined}
              aria-label={hasArticles ? location.name : undefined}
              onMouseEnter={() => hasArticles && setActiveId(location.id)}
              onFocus={() => hasArticles && setActiveId(location.id)}
              onClick={() => hasArticles && setActiveId(location.id)}
              className={[
                isActiveRegion
                  ? "fill-neutral-900"
                  : hasArticles
                    ? "fill-neutral-500 hover:fill-neutral-700"
                    : "fill-neutral-200",
                hasArticles ? "cursor-pointer outline-none" : "",
              ].join(" ")}
            />
          );
        })}
      </svg>

      <div className="text-sm">
        {active ? (
          <div>
            <Link href={`/${slugify(REGION_OF_PREFECTURE[active.id])}`} className="text-neutral-500 hover:underline">
              {REGION_OF_PREFECTURE[active.id]}
            </Link>
            <h3 className="text-lg font-medium mb-3">
              <Link href={`/${slugify(REGION_OF_PREFECTURE[active.id])}/${active.id}`} className="hover:underline">
                {active.name}
              </Link>
            </h3>

            <ul className="space-y-3">
              {active.articles.map((article) => (
                <li key={article.slug}>
                  <Link href={`/articles/${article.slug}`} className="hover:underline">
                    {article.frontmatter.work}
                  </Link>
                  <p className="text-neutral-500">
                    {article.frontmatter.authors.map((name, i) => (
                      <span key={name}>
                        {i > 0 && ", "}
                        <Link href={`/authors/${slugify(name)}`} className="hover:underline">
                          {name}
                        </Link>
                      </span>
                    ))}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-neutral-500">
            Hover or tap a highlighted prefecture to see its guides.
          </p>
        )}
      </div>
    </div>
  );
}
