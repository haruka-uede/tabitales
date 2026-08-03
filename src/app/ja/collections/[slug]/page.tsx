import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllCollections, getCollectionBySlug } from "@/lib/collections";
import { extractMapStops } from "@/lib/mapStops";
import { getAuthorNameJa } from "@/lib/authorProfiles";
import { getDestinationHref, getPlaceNameJa } from "@/lib/japanMap";
import { slugify } from "@/lib/slug";
import { OG_IMAGE, SITE_NAME, SITE_URL, jsonLdScript } from "@/lib/site";
import AffiliateDisclosureNoteJa from "@/components/AffiliateDisclosureNoteJa";
import AffiliateDisclosureBannerJa from "@/components/AffiliateDisclosureBannerJa";
import AuthorCorner from "@/components/AuthorCorner";
import BookList from "@/components/BookList";
import FeaturedWorks from "@/components/FeaturedWorks";
import MapRouteLinkJa from "@/components/MapRouteLinkJa";
import PlanYourTrip from "@/components/PlanYourTrip";
import StopImageJa from "@/components/StopImageJa";

export function generateStaticParams() {
  return getAllCollections({ locale: "ja" }).map((collection) => ({ slug: collection.slug }));
}

// Only slugs returned by generateStaticParams (i.e. status: "published" JA translations) are servable.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug, "ja");
  if (!collection) return {};

  const hasEnVersion = !!getCollectionBySlug(slug, "en");

  return {
    title: collection.frontmatter.title,
    description: collection.frontmatter.description,
    alternates: {
      canonical: `/ja/collections/${slug}`,
      languages: {
        ja: `/ja/collections/${slug}`,
        ...(hasEnVersion ? { en: `/collections/${slug}` } : {}),
        "x-default": hasEnVersion ? `/collections/${slug}` : `/ja/collections/${slug}`,
      },
    },
    openGraph: {
      title: collection.frontmatter.title,
      description: collection.frontmatter.description,
      type: "article",
      publishedTime: collection.frontmatter.publishedAt,
      images: [collection.frontmatter.image ?? OG_IMAGE],
    },
  };
}

export default async function JaCollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug, "ja");
  if (!collection) notFound();

  const canonicalUrl = `${SITE_URL}/ja/collections/${slug}`;

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: collection.frontmatter.title,
    description: collection.frontmatter.description,
    datePublished: collection.frontmatter.publishedAt,
    dateModified: collection.frontmatter.publishedAt,
    mainEntityOfPage: canonicalUrl,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    about: collection.frontmatter.works.map((work) => ({
      "@type": "Book",
      name: work,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "特集", item: `${SITE_URL}/ja/collections` },
      { "@type": "ListItem", position: 2, name: collection.frontmatter.title, item: canonicalUrl },
    ],
  };

  return (
    <article className="max-w-2xl mx-auto px-6 py-12 prose prose-neutral dark:prose-invert">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd) }}
      />
      {collection.frontmatter.image && (
        <Image
          src={collection.frontmatter.image}
          alt={collection.frontmatter.title}
          width={1672}
          height={941}
          priority
          className="not-prose w-full h-auto rounded-xl"
        />
      )}
      <p className="text-sm uppercase tracking-wide text-muted-foreground">
        {collection.frontmatter.authors.map((name, i) => {
          const authorSlug = slugify(name);
          return (
            <span key={name}>
              {i > 0 && "、"}
              <Link href={`/ja/authors/${authorSlug}`} className="underline">
                {getAuthorNameJa(authorSlug, name)}
              </Link>
            </span>
          );
        })}
        {" ・ "}
        {collection.frontmatter.destinations.map((name, i) => {
          const destHref = getDestinationHref(name, "ja");
          return (
            <span key={name}>
              {i > 0 && "、"}
              {destHref ? (
                <Link href={destHref} className="underline">
                  {getPlaceNameJa(name)}
                </Link>
              ) : (
                getPlaceNameJa(name)
              )}
            </span>
          );
        })}
      </p>
      <h1>{collection.frontmatter.title}</h1>

      <AffiliateDisclosureBannerJa />

      <p className="text-muted-foreground">{collection.frontmatter.description}</p>

      <FeaturedWorks works={collection.frontmatter.works} locale="ja" />

      <BookList
        works={collection.frontmatter.works}
        authors={collection.frontmatter.authors}
        locale="ja"
      />

      <MDXRemote
        source={collection.content}
        components={{
          AffiliateDisclosureNote: AffiliateDisclosureNoteJa,
          // MapLink stays a silent data source here (each stop's location,
          // consolidated into the one route link below) rather than a
          // per-stop button - see MapRouteLinkJa.tsx.
          MapLink: () => null,
          MapRouteLink: () => (
            <MapRouteLinkJa stops={extractMapStops(collection.content)} />
          ),
          StopImage: StopImageJa,
        }}
      />

      {collection.frontmatter.authors.map((name) => (
        <AuthorCorner key={name} name={name} locale="ja" />
      ))}

      <PlanYourTrip
        authors={collection.frontmatter.authors}
        destinations={collection.frontmatter.destinations}
        homeBase={collection.frontmatter.homeBase}
      />
    </article>
  );
}
