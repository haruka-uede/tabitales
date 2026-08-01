import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import { OG_IMAGE } from "@/lib/site";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ArticleCard from "@/components/ArticleCard";

const TITLE = "Tabi Tales — 日本の小説とゆかりの地をめぐる旅";
const DESCRIPTION =
  "日本の小説とその舞台となった実在の場所を結びつける文学旅行ガイド。日本旅行を計画している読者のために。";

export const metadata: Metadata = {
  alternates: {
    canonical: "/ja",
    languages: {
      en: "/",
      ja: "/ja",
      "x-default": "/",
    },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    images: [OG_IMAGE],
  },
};

export default function JaHome() {
  const articles = getAllArticles({ locale: "ja" });

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <Image
        src={OG_IMAGE.url}
        alt="Tabi Tales — 日本の文学を巡る旅のガイド"
        width={OG_IMAGE.width}
        height={OG_IMAGE.height}
        priority
        className="w-full h-auto rounded-xl mb-10"
      />
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
