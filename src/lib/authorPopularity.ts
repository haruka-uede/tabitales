import cache from "@/data/author-popularity.json";

type PopularityEntry = { slug: string; name: string; pageviews: number };
type PopularityCache = { generatedAt: string | null; windowDays: number; authors: PopularityEntry[] };

const popularity = cache as PopularityCache;

// Populated by `npm run fetch-author-popularity` (scripts/fetch-author-popularity.ts),
// not at request/build time - same pre-fetch-into-cache pattern as bookInfoCache.ts.
// Before that script has ever run, `authors` is empty and this returns
// `facets` unchanged (rather than an empty top-N), so the filter degrades to
// "show everyone" instead of "show nobody" pre-launch.
export function topAuthorsByPageviews<T extends { slug: string }>(facets: T[], limit = 5): T[] {
  if (popularity.authors.length === 0) return facets;

  const views = new Map(popularity.authors.map((a) => [a.slug, a.pageviews]));
  return [...facets].sort((a, b) => (views.get(b.slug) ?? 0) - (views.get(a.slug) ?? 0)).slice(0, limit);
}
