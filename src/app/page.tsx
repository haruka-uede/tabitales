import Link from "next/link";
import { getAllArticles } from "@/lib/articles";

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
      <p className="mt-4 text-lg text-neutral-600 max-w-xl">
        Tabi Tales is a literary travel guide for readers planning a trip to Japan —
        connecting novels and their authors to the towns, temples, and train lines
        that inspired them.
      </p>

      <section className="mt-16">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-6">
          Explore
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {EXPLORE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border border-neutral-200 rounded-lg p-5 hover:border-neutral-400 transition-colors"
            >
              <h3 className="font-medium">{link.label}</h3>
              <p className="text-sm text-neutral-600 mt-2">{link.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {articles.length > 0 && (
        <section className="mt-16">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-6">
            Latest guides
          </h2>
          <ul className="space-y-4">
            {articles.map((article) => (
              <li key={article.slug}>
                <Link href={`/articles/${article.slug}`} className="hover:underline">
                  {article.frontmatter.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
