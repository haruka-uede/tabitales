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
