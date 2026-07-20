import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllAuthors } from "@/lib/articles";
import { AUTHOR_BLURBS, getAuthorInitials } from "@/lib/authorProfiles";
import { jsonLdScript } from "@/lib/site";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ArticleCard from "@/components/ArticleCard";

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

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(personJsonLd) }}
      />
      <p className="text-sm mb-6">
        <Link href="/authors" className="text-muted-foreground hover:underline">
          ← All authors
        </Link>
      </p>
      <div className="flex items-center gap-4 mb-10">
        <Avatar size="lg">
          <AvatarFallback>{getAuthorInitials(author.name)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-semibold">{author.name}</h1>
          {AUTHOR_BLURBS[author.slug] && (
            <p className="text-muted-foreground mt-1">{AUTHOR_BLURBS[author.slug]}</p>
          )}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        {author.articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
