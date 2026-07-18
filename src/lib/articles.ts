import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { slugify } from "./slug";

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

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

export function getAllArticles({ includeDrafts = false } = {}): Article[] {
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".mdx"));

  return files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      return { slug, frontmatter: data as ArticleFrontmatter, content };
    })
    .filter((article) => includeDrafts || !article.frontmatter.draft)
    .sort((a, b) => (a.frontmatter.publishedAt < b.frontmatter.publishedAt ? 1 : -1));
}

export function getArticleBySlug(slug: string): Article | null {
  const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { slug, frontmatter: data as ArticleFrontmatter, content };
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
