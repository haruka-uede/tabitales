import Link from "next/link";
import { getAllAuthors } from "@/lib/articles";
import { AUTHOR_BLURBS } from "@/lib/authorProfiles";

export const metadata = { title: "Authors" };

export default function AuthorsPage() {
  const authors = getAllAuthors();

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-4">Authors We Follow</h1>
      <p className="text-neutral-600 mb-10">
        Tabi Tales is an independent, unofficial fan project. We are not affiliated
        with or endorsed by any of the authors, publishers, or rights holders
        mentioned below.
      </p>
      <div className="space-y-10">
        {authors.map((author) => (
          <div key={author.slug} id={author.slug}>
            <h2 className="text-xl font-medium">{author.name}</h2>
            {AUTHOR_BLURBS[author.slug] && (
              <p className="text-neutral-600 mt-1">{AUTHOR_BLURBS[author.slug]}</p>
            )}
            <ul className="mt-3 space-y-1">
              {author.articles.map((article) => (
                <li key={article.slug}>
                  <Link href={`/articles/${article.slug}`} className="text-sm hover:underline">
                    {article.frontmatter.work}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
