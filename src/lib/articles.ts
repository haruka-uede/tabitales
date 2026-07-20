import { allArticles } from "content-collections";
import { slugify } from "./slug";

export type ArticleFrontmatter = {
  title: string;
  description: string;
  work: string;
  authors: string[];
  destinations: string[];
  publishedAt: string;
  draft?: boolean;
};

export type Article = {
  slug: string;
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
  const { title, description, work, authors, destinations, publishedAt, draft, content } = doc;
  return {
    slug: doc._meta.path,
    frontmatter: { title, description, work, authors, destinations, publishedAt, draft },
    content,
  };
}

export function getAllArticles({ includeDrafts = false } = {}): Article[] {
  return allArticles
    .map(toArticle)
    .filter((article) => includeDrafts || !article.frontmatter.draft)
    .sort((a, b) => (a.frontmatter.publishedAt < b.frontmatter.publishedAt ? 1 : -1));
}

export function getArticleBySlug(slug: string): Article | null {
  const doc = allArticles.find((a) => a._meta.path === slug);
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

export function getAllAuthors({ includeDrafts = false } = {}): Facet[] {
  return groupByFacet(getAllArticles({ includeDrafts }), (a) => a.frontmatter.authors);
}

export function getAllDestinations({ includeDrafts = false } = {}): Facet[] {
  return groupByFacet(getAllArticles({ includeDrafts }), (a) => a.frontmatter.destinations);
}

export function getArticlesByAuthor(slug: string): Article[] {
  return getAllAuthors().find((a) => a.slug === slug)?.articles ?? [];
}

export function getArticlesByDestination(slug: string): Article[] {
  return getAllDestinations().find((d) => d.slug === slug)?.articles ?? [];
}

// Capped and de-duplicated in article order, not alphabetically - keeps the
// list stable/predictable as an author's article count grows.
export function getAuthorDestinations(slug: string, limit = 5): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const article of getArticlesByAuthor(slug)) {
    for (const name of article.frontmatter.destinations) {
      if (seen.has(name)) continue;
      seen.add(name);
      result.push(name);
      if (result.length >= limit) return result;
    }
  }
  return result;
}
