import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllAuthors } from "@/lib/articles";
import { AUTHOR_BLURBS } from "@/lib/authorProfiles";

export function generateStaticParams() {
  return getAllAuthors().map((author) => ({ slug: author.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = getAllAuthors().find((a) => a.slug === slug);
  if (!author) return {};

  return {
    title: author.name,
    alternates: { canonical: `/authors/${slug}` },
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = getAllAuthors().find((a) => a.slug === slug);
  if (!author) notFound();

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <p className="text-sm mb-6">
        <Link href="/authors" className="text-neutral-500 hover:underline">
          ← All authors
        </Link>
      </p>
      <h1 className="text-3xl font-semibold mb-4">{author.name}</h1>
      {AUTHOR_BLURBS[author.slug] && (
        <p className="text-neutral-600 mb-10">{AUTHOR_BLURBS[author.slug]}</p>
      )}
      <ul className="space-y-6">
        {author.articles.map((article) => (
          <li key={article.slug}>
            <Link href={`/articles/${article.slug}`} className="block group">
              <p className="text-sm uppercase tracking-wide text-neutral-500">
                {article.frontmatter.destinations.join(", ")}
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
