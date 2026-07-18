import Link from "next/link";
import { getAllArticles } from "@/lib/articles";

export default function ArticlesIndexPage() {
  const articles = getAllArticles();

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-8">Literary Travel Guides</h1>
      <ul className="space-y-6">
        {articles.map((article) => (
          <li key={article.slug}>
            <Link href={`/articles/${article.slug}`} className="block group">
              <p className="text-sm uppercase tracking-wide text-neutral-500">
                {article.frontmatter.authors.join(", ")} · {article.frontmatter.destinations.join(", ")}
              </p>
              <h2 className="text-xl font-medium group-hover:underline">
                {article.frontmatter.work}
              </h2>
              <p className="text-neutral-600">{article.frontmatter.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
