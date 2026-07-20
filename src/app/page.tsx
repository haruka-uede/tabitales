import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ArticleCard from "@/components/ArticleCard";

const EXPLORE_LINKS = [
  {
    href: "/authors",
    label: "By Author",
    blurb: "Start with a writer you already know.",
  },
  {
    href: "/destinations",
    label: "By Destination",
    blurb: "Already know where you're headed in Japan?",
  },
  {
    href: "/articles",
    label: "All Guides",
    blurb: "Browse every literary travel guide.",
  },
];

export default function Home() {
  const articles = getAllArticles();

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight max-w-xl">
        Follow Japanese novels to the real places behind them.
      </h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-xl">
        Tabi Tales is a literary travel guide for readers planning a trip to Japan —
        connecting novels and their authors to the towns, temples, and train lines
        that inspired them.
      </p>

      <section className="mt-16">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-6">
          Explore
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {EXPLORE_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="block h-full">
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle>{link.label}</CardTitle>
                  <CardDescription>{link.blurb}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {articles.length > 0 && (
        <section className="mt-16">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-6">
            Latest guides
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {articles.slice(0, 4).map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
