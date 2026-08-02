import { getAllArticles } from "@/lib/articles";
import ArticleCard from "@/components/ArticleCard";

export default function JaArticlesIndexPage() {
  const articles = getAllArticles({ locale: "ja" });

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-4">本×旅行ガイド</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        一冊の本を軸にしたガイドです。一つの小説の舞台となった実在の場所を、順にたどります。
      </p>
      <div className="grid sm:grid-cols-2 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} locale="ja" />
        ))}
      </div>
    </div>
  );
}
