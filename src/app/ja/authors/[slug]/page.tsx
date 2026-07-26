import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllAuthors, getAuthorDestinations } from "@/lib/articles";
import { AUTHOR_PROFILES, getAuthorNameJa } from "@/lib/authorProfiles";
import { jsonLdScript } from "@/lib/site";
import { getDestinationHref, getPlaceNameJa } from "@/lib/japanMap";
import ArticleCard from "@/components/ArticleCard";
import { Badge } from "@/components/ui/badge";

export function generateStaticParams() {
  return getAllAuthors({ locale: "ja" }).map((author) => ({ slug: author.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = getAllAuthors({ locale: "ja" }).find((a) => a.slug === slug);
  if (!author) return {};

  return {
    title: getAuthorNameJa(slug, author.name),
    alternates: { canonical: `/ja/authors/${slug}` },
  };
}

export default async function JaAuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = getAllAuthors({ locale: "ja" }).find((a) => a.slug === slug);
  if (!author) notFound();

  const displayName = getAuthorNameJa(slug, author.name);
  const destinations = getAuthorDestinations(slug, "ja");

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: displayName,
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(personJsonLd) }}
      />
      <p className="text-sm mb-6">
        <Link href="/ja/authors" className="text-muted-foreground hover:underline">
          ← 著者一覧に戻る
        </Link>
      </p>
      <div className="mb-10">
        <h1 className="text-3xl font-semibold">{displayName}</h1>
        {AUTHOR_PROFILES[slug]?.blurbJa && (
          <p className="text-muted-foreground mt-1">{AUTHOR_PROFILES[slug].blurbJa}</p>
        )}
        {destinations.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {destinations.map((destination) => {
              const destHref = getDestinationHref(destination, "ja");
              const label = getPlaceNameJa(destination);
              return destHref ? (
                <Link key={destination} href={destHref}>
                  <Badge variant="secondary" className="cursor-pointer">
                    {label}
                  </Badge>
                </Link>
              ) : (
                <Badge key={destination} variant="outline">
                  {label}
                </Badge>
              );
            })}
          </div>
        )}
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        {author.articles.map((article) => (
          <ArticleCard key={article.slug} article={article} locale="ja" />
        ))}
      </div>
    </div>
  );
}
