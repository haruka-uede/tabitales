import { getAllArticles } from "@/lib/articles";
import ArticleCard from "@/components/ArticleCard";

export default function ArticlesIndexPage() {
  const articles = getAllArticles();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-8">Literary Travel Guides</h1>
      <div className="grid sm:grid-cols-2 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
