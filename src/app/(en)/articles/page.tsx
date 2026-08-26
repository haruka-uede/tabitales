import { Suspense } from "react";
import { getAllArticles, getAllAuthors, getAllDestinations } from "@/lib/articles";
import { buildArticleSearchIndex } from "@/lib/articleSearch";
import { topAuthorsByPageviews } from "@/lib/authorPopularity";
import { REGION_NAMES } from "@/lib/japanMap";
import { slugify } from "@/lib/slug";
import ArticlesExplorer from "@/components/ArticlesExplorer";

export default function ArticlesIndexPage() {
  const articles = getAllArticles();
  const authors = topAuthorsByPageviews(getAllAuthors());
  const regionSlugs = new Set(REGION_NAMES.map(slugify));
  const regions = getAllDestinations().filter((d) => regionSlugs.has(d.slug));
  const searchIndex = buildArticleSearchIndex(articles, "en");

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-4">Literary Travel Guides</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Guides built around a single book — the real places behind one novel, retraced
        stop by stop.
      </p>
      <Suspense>
        <ArticlesExplorer
          articles={articles}
          searchIndex={searchIndex}
          authors={authors}
          regions={regions}
        />
      </Suspense>
    </div>
  );
}
