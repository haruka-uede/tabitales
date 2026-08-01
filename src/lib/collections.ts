import { allCollections } from "content-collections";
import type { Locale, ArticleStatus } from "./articles";

export type CollectionFrontmatter = {
  title: string;
  description: string;
  works: string[];
  authors: string[];
  destinations: string[];
  homeBase?: string;
  publishedAt: string;
  status: ArticleStatus;
};

export type ThemeCollection = {
  slug: string;
  locale: Locale;
  frontmatter: CollectionFrontmatter;
  content: string;
};

function toCollection(doc: (typeof allCollections)[number]): ThemeCollection {
  const { title, description, works, authors, destinations, homeBase, publishedAt, status, content } =
    doc;
  return {
    slug: doc.slug,
    locale: doc.locale,
    frontmatter: { title, description, works, authors, destinations, homeBase, publishedAt, status },
    content,
  };
}

export function getAllCollections({
  locale = "en" as Locale,
  includeUnpublished = false,
} = {}): ThemeCollection[] {
  return allCollections
    .filter((doc) => doc.locale === locale)
    .map(toCollection)
    .filter((collection) => includeUnpublished || collection.frontmatter.status === "published")
    .sort((a, b) => (a.frontmatter.publishedAt < b.frontmatter.publishedAt ? 1 : -1));
}

export function getCollectionBySlug(slug: string, locale: Locale = "en"): ThemeCollection | null {
  const doc = allCollections.find((c) => c.slug === slug && c.locale === locale);
  return doc ? toCollection(doc) : null;
}

// Each stop's <MapLink q="..." /> tag in the MDX body is the single source of
// truth for that stop's location - this scans the raw content for them (in
// document order) so page.tsx can build one combined route link without the
// author ever having to retype the list separately. Runs on the raw string,
// before MDXRemote parses it, so it isn't subject to next-mdx-remote/rsc
// silently dropping array-valued JSX props (see src/lib/affiliate.ts's
// sibling gotcha note) - there's no array in the .mdx source at all.
export function extractMapStops(content: string): string[] {
  return [...content.matchAll(/<MapLink\s+q="([^"]*)"\s*\/>/g)].map((match) => match[1]);
}
