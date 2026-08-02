import { getAllArticles } from "@/lib/articles";
import ArticleCard from "@/components/ArticleCard";

export default function ArticlesIndexPage() {
  const articles = getAllArticles();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-4">Literary Travel Guides</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Guides built around a single book — the real places behind one novel, retraced
        stop by stop.
      </p>
      <div className="grid sm:grid-cols-2 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
