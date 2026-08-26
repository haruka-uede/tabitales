import { slugify } from "./slug";
import type { Article, Locale } from "./articles";
import { getAuthorNameJa } from "./authorProfiles";
import { getWorkNameJa } from "./workProfiles";
import { getPlaceNameJa } from "./japanMap";

export type ArticleSearchEntry = {
  slug: string;
  text: string;
};

// Metadata-only index (title, work, description, author/destination display
// names) - cheap to build and ship per locale at the catalog's current size.
// Once the catalog grows large enough that readers need to search inside
// article bodies rather than just titles/tags, replace this with a
// build-time full-text indexer (e.g. Pagefind) instead of growing this
// in-memory/client-shipped index.
export function buildArticleSearchIndex(articles: Article[], locale: Locale): ArticleSearchEntry[] {
  return articles.map((article) => {
    const { title, description, work, authors, destinations } = article.frontmatter;
    const workLabel = locale === "ja" ? getWorkNameJa(work) : work;
    const authorLabels = authors.map((name) =>
      locale === "ja" ? getAuthorNameJa(slugify(name), name) : name
    );
    const destinationLabels = destinations.map((name) => (locale === "ja" ? getPlaceNameJa(name) : name));

    return {
      slug: article.slug,
      text: [title, workLabel, description, ...authorLabels, ...destinationLabels].join(" "),
    };
  });
}
