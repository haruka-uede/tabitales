"use client";

import { useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Fuse from "fuse.js";
import ArticleCard from "@/components/ArticleCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/slug";
import { getAuthorNameJa, getAuthorSortKeyJa } from "@/lib/authorProfiles";
import { getPlaceNameJa } from "@/lib/japanMap";
import { type Locale } from "@/lib/i18n";
import type { Article, Facet } from "@/lib/articles";
import type { ArticleSearchEntry } from "@/lib/articleSearch";

const PAGE_SIZE = 12;

type SortKey = "newest" | "author";

const COPY = {
  en: {
    searchPlaceholder: "Search by title, author, place…",
    author: "Popular authors",
    region: "Region",
    allAuthors: "All authors",
    allRegions: "All regions",
    sortNewest: "Newest",
    sortAuthor: "Author (A–Z)",
    noResults: "No guides match your filters.",
    clear: "Clear filters",
    resultCount: (n: number) => `${n} guide${n === 1 ? "" : "s"}`,
    prev: "Previous",
    next: "Next",
    pageOf: (page: number, total: number) => `Page ${page} of ${total}`,
  },
  ja: {
    searchPlaceholder: "タイトル・著者・地名で検索",
    author: "人気の著者",
    region: "地域",
    allAuthors: "すべての著者",
    allRegions: "すべての地域",
    sortNewest: "新着順",
    sortAuthor: "著者順（あいうえお順）",
    noResults: "条件に一致するガイドが見つかりませんでした。",
    clear: "条件をクリア",
    resultCount: (n: number) => `${n}件のガイド`,
    prev: "前へ",
    next: "次へ",
    pageOf: (page: number, total: number) => `${page} / ${total}ページ`,
  },
} satisfies Record<Locale, unknown>;

export default function ArticlesExplorer({
  articles,
  searchIndex,
  authors,
  regions,
  locale = "en" as Locale,
}: {
  articles: Article[];
  searchIndex: ArticleSearchEntry[];
  authors: Facet[];
  regions: Facet[];
  locale?: Locale;
}) {
  const t = COPY[locale];
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const authorSlug = searchParams.get("author") ?? "";
  const regionSlug = searchParams.get("region") ?? "";
  const sort: SortKey = searchParams.get("sort") === "author" ? "author" : "newest";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  function updateParams(patch: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    if (!("page" in patch)) params.delete("page");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const fuse = useMemo(
    () => new Fuse(searchIndex, { keys: ["text"], threshold: 0.35, ignoreLocation: true }),
    [searchIndex]
  );

  const authorLabel = (name: string) => (locale === "ja" ? getAuthorNameJa(slugify(name), name) : name);

  // For ja, sort by reading (yomiJa) rather than the displayed kanji name -
  // kanji have no inherent phonetic order, so comparing kanji strings sorts
  // by glyph shape instead of あいうえお order. See authorProfiles.ts.
  const authorSortKey = (name: string) =>
    locale === "ja" ? getAuthorSortKeyJa(slugify(name), name) : name;

  const filtered = useMemo(() => {
    let result = articles;

    if (authorSlug) {
      result = result.filter((a) => a.frontmatter.authors.some((name) => slugify(name) === authorSlug));
    }
    if (regionSlug) {
      result = result.filter((a) => a.frontmatter.destinations.some((name) => slugify(name) === regionSlug));
    }

    const trimmedQuery = q.trim();
    if (trimmedQuery) {
      const matches = fuse.search(trimmedQuery);
      const rank = new Map(matches.map((m, i) => [m.item.slug, i]));
      result = result.filter((a) => rank.has(a.slug)).sort((a, b) => rank.get(a.slug)! - rank.get(b.slug)!);
    } else if (sort === "author") {
      result = [...result].sort((a, b) =>
        authorSortKey(a.frontmatter.authors[0] ?? "").localeCompare(
          authorSortKey(b.frontmatter.authors[0] ?? ""),
          locale === "ja" ? "ja" : "en"
        )
      );
    }

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articles, authorSlug, regionSlug, q, sort, fuse, locale]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const hasActiveFilters = Boolean(q || authorSlug || regionSlug || sort !== "newest");

  return (
    <div>
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <input
            type="search"
            value={q}
            onChange={(e) => updateParams({ q: e.target.value || null })}
            placeholder={t.searchPlaceholder}
            className="flex-1 text-sm border border-border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <select
            value={sort}
            onChange={(e) => updateParams({ sort: e.target.value === "author" ? "author" : null })}
            className="text-sm border border-border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="newest">{t.sortNewest}</option>
            <option value="author">{t.sortAuthor}</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-muted-foreground mr-1">{t.author}:</span>
          <Badge
            variant={authorSlug ? "outline" : "secondary"}
            className="cursor-pointer"
            onClick={() => updateParams({ author: null })}
          >
            {t.allAuthors}
          </Badge>
          {authors.map((facet) => (
            <Badge
              key={facet.slug}
              variant={authorSlug === facet.slug ? "secondary" : "outline"}
              className="cursor-pointer"
              onClick={() => updateParams({ author: authorSlug === facet.slug ? null : facet.slug })}
            >
              {authorLabel(facet.name)}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-muted-foreground mr-1">{t.region}:</span>
          <Badge
            variant={regionSlug ? "outline" : "secondary"}
            className="cursor-pointer"
            onClick={() => updateParams({ region: null })}
          >
            {t.allRegions}
          </Badge>
          {regions.map((facet) => (
            <Badge
              key={facet.slug}
              variant={regionSlug === facet.slug ? "secondary" : "outline"}
              className="cursor-pointer"
              onClick={() => updateParams({ region: regionSlug === facet.slug ? null : facet.slug })}
            >
              {locale === "ja" ? getPlaceNameJa(facet.name) : facet.name}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{t.resultCount(filtered.length)}</span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => router.replace(pathname, { scroll: false })}
              className="underline hover:no-underline"
            >
              {t.clear}
            </button>
          )}
        </div>
      </div>

      {pageItems.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center">{t.noResults}</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {pageItems.map((article) => (
            <ArticleCard key={article.slug} article={article} locale={locale} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-10">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => updateParams({ page: String(currentPage - 1) })}
          >
            {t.prev}
          </Button>
          <span className="text-sm text-muted-foreground">{t.pageOf(currentPage, totalPages)}</span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => updateParams({ page: String(currentPage + 1) })}
          >
            {t.next}
          </Button>
        </div>
      )}
    </div>
  );
}
