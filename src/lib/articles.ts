import { allArticles } from "content-collections";
import { slugify } from "./slug";

export type Locale = "en" | "ja";

export type ArticleFrontmatter = {
  title: string;
  description: string;
  work: string;
  authors: string[];
  destinations: string[];
  homeBase?: string;
  publishedAt: string;
  draft?: boolean;
};

export type Article = {
  slug: string;
  locale: Locale;
  frontmatter: ArticleFrontmatter;
  content: string;
};

export type Facet = {
  slug: string;
  name: string;
  articles: Article[];
};

// content-collections validates and parses every .mdx file's frontmatter at
// build time (via the Zod schema in content-collections.ts), so a malformed
// or missing field fails the build instead of shipping a broken page.
function toArticle(doc: (typeof allArticles)[number]): Article {
  const { title, description, work, authors, destinations, homeBase, publishedAt, draft, content } = doc;
  return {
    slug: doc.slug,
    locale: doc.locale,
    frontmatter: { title, description, work, authors, destinations, homeBase, publishedAt, draft },
    content,
  };
}

export function getAllArticles({
  locale = "en" as Locale,
  includeDrafts = false,
} = {}): Article[] {
  return allArticles
    .filter((doc) => doc.locale === locale)
    .map(toArticle)
    .filter((article) => includeDrafts || !article.frontmatter.draft)
    .sort((a, b) => (a.frontmatter.publishedAt < b.frontmatter.publishedAt ? 1 : -1));
}

export function getArticleBySlug(slug: string, locale: Locale = "en"): Article | null {
  const doc = allArticles.find((a) => a.slug === slug && a.locale === locale);
  return doc ? toArticle(doc) : null;
}

function groupByFacet(
  articles: Article[],
  getValues: (article: Article) => string[]
): Facet[] {
  const facets = new Map<string, Facet>();

  for (const article of articles) {
    for (const name of getValues(article)) {
      const slug = slugify(name);
      const existing = facets.get(slug);
      if (existing) {
        existing.articles.push(article);
      } else {
        facets.set(slug, { slug, name, articles: [article] });
      }
    }
  }

  return [...facets.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function getAllAuthors({ locale = "en" as Locale, includeDrafts = false } = {}): Facet[] {
  return groupByFacet(getAllArticles({ locale, includeDrafts }), (a) => a.frontmatter.authors);
}

export function getAllDestinations({ locale = "en" as Locale, includeDrafts = false } = {}): Facet[] {
  return groupByFacet(getAllArticles({ locale, includeDrafts }), (a) => a.frontmatter.destinations);
}

export function getArticlesByAuthor(slug: string, locale: Locale = "en"): Article[] {
  return getAllAuthors({ locale }).find((a) => a.slug === slug)?.articles ?? [];
}

export function getArticlesByDestination(slug: string, locale: Locale = "en"): Article[] {
  return getAllDestinations({ locale }).find((d) => d.slug === slug)?.articles ?? [];
}

// Capped and de-duplicated in article order, not alphabetically - keeps the
// list stable/predictable as an author's article count grows.
export function getAuthorDestinations(slug: string, locale: Locale = "en", limit = 5): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const article of getArticlesByAuthor(slug, locale)) {
    for (const name of article.frontmatter.destinations) {
      if (seen.has(name)) continue;
      seen.add(name);
      result.push(name);
      if (result.length >= limit) return result;
    }
  }
  return result;
}
