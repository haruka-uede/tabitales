import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllAuthors, getAuthorDestinations } from "@/lib/articles";
import { AUTHOR_BLURBS } from "@/lib/authorProfiles";
import { jsonLdScript } from "@/lib/site";
import { getDestinationHref } from "@/lib/japanMap";
import ArticleCard from "@/components/ArticleCard";
import { Badge } from "@/components/ui/badge";

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
      <div className="mb-10">
        <h1 className="text-3xl font-semibold">{author.name}</h1>
        {AUTHOR_BLURBS[author.slug] && (
          <p className="text-muted-foreground mt-1">{AUTHOR_BLURBS[author.slug]}</p>
        )}
        {getAuthorDestinations(author.slug).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {getAuthorDestinations(author.slug).map((destination) => {
              const href = getDestinationHref(destination);
              return href ? (
                <Link key={destination} href={href}>
                  <Badge variant="secondary" className="cursor-pointer">
                    {destination}
                  </Badge>
                </Link>
              ) : (
                <Badge key={destination} variant="outline">
                  {destination}
                </Badge>
              );
            })}
          </div>
        )}
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        {author.articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
