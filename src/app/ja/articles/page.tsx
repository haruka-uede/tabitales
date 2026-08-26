import { Suspense } from "react";
import { getAllArticles, getAllAuthors, getAllDestinations } from "@/lib/articles";
import { buildArticleSearchIndex } from "@/lib/articleSearch";
import { REGION_NAMES } from "@/lib/japanMap";
import { slugify } from "@/lib/slug";
import ArticlesExplorer from "@/components/ArticlesExplorer";

export const metadata = { title: "本×旅行ガイド" };

export default function JaArticlesIndexPage() {
  const articles = getAllArticles({ locale: "ja" });
  const authors = getAllAuthors({ locale: "ja" });
  const regionSlugs = new Set(REGION_NAMES.map(slugify));
  const regions = getAllDestinations({ locale: "ja" }).filter((d) => regionSlugs.has(d.slug));
  const searchIndex = buildArticleSearchIndex(articles, "ja");

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-4">本×旅行ガイド</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        一冊の本を軸にしたガイドです。一つの小説の舞台となった実在の場所を、順にたどります。
      </p>
      <Suspense>
        <ArticlesExplorer
          articles={articles}
          searchIndex={searchIndex}
          authors={authors}
          regions={regions}
          locale="ja"
        />
      </Suspense>
    </div>
  );
}
