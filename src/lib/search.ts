import { getAllArticles } from "./articles";
import { getAllCollections } from "./collections";
import { slugify } from "./slug";
import { getDestinationHref } from "./japanMap";

export type SearchEntry = {
  type: "work" | "author" | "destination" | "collection";
  label: string;
  href: string;
  subtitle?: string;
};

export function getSearchIndex(): SearchEntry[] {
  const articles = getAllArticles();
  const entries: SearchEntry[] = [];

  for (const article of articles) {
    entries.push({
      type: "work",
      label: article.frontmatter.work,
      href: `/articles/${article.slug}`,
      subtitle: article.frontmatter.authors.join(", "),
    });
  }

  for (const collection of getAllCollections()) {
    entries.push({
      type: "collection",
      label: collection.frontmatter.title,
      href: `/collections/${collection.slug}`,
      subtitle: collection.frontmatter.authors.join(", "),
    });
  }

  const authors = new Map<string, string>();
  const destinations = new Map<string, string>();
  for (const article of articles) {
    for (const name of article.frontmatter.authors) {
      authors.set(slugify(name), name);
    }
    for (const name of article.frontmatter.destinations) {
      destinations.set(slugify(name), name);
    }
  }

  for (const [slug, name] of authors) {
    entries.push({ type: "author", label: name, href: `/authors/${slug}` });
  }
  for (const [, name] of destinations) {
    entries.push({
      type: "destination",
      label: name,
      href: getDestinationHref(name) ?? "/destinations",
    });
  }

  return entries;
}
