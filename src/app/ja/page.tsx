import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ArticleCard from "@/components/ArticleCard";

export default function JaHome() {
  const articles = getAllArticles({ locale: "ja" });

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight max-w-xl">
        日本の小説を、その舞台となった実在の場所へ。
      </h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-xl">
        Tabi Talesは、日本旅行を計画している読者のための文学旅行ガイドです。小説とその作者を、実際に着想を与えた町、寺院、鉄道路線へと結びつけます。
      </p>

      <section className="mt-16">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-6">
          探す
        </h2>
        <div className="grid sm:grid-cols-1 max-w-xs gap-6">
          <Link href="/ja/articles" className="block h-full">
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle>すべてのガイド</CardTitle>
                <CardDescription>すべての文学旅行ガイドを見る。</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </section>

      {articles.length > 0 && (
        <section className="mt-16">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-6">
            最新のガイド
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {articles.slice(0, 4).map((article) => (
              <ArticleCard key={article.slug} article={article} locale="ja" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
