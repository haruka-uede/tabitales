import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllCollections, getCollectionBySlug } from "@/lib/collections";
import { extractMapStops } from "@/lib/mapStops";
import { slugify } from "@/lib/slug";
import { getDestinationHref } from "@/lib/japanMap";
import { SITE_NAME, SITE_URL, jsonLdScript } from "@/lib/site";
import AffiliateDisclosureNote from "@/components/AffiliateDisclosureNote";
import AuthorCorner from "@/components/AuthorCorner";
import BookList from "@/components/BookList";
import FeaturedWorks from "@/components/FeaturedWorks";
import MapRouteLink from "@/components/MapRouteLink";
import PlanYourTrip from "@/components/PlanYourTrip";
import StopImage from "@/components/StopImage";

export function generateStaticParams() {
  return getAllCollections().map((collection) => ({ slug: collection.slug }));
}

// Only slugs returned by generateStaticParams (i.e. status: "published") are servable.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return {};

  const hasJaVersion = !!getCollectionBySlug(slug, "ja");

  return {
    title: collection.frontmatter.title,
    description: collection.frontmatter.description,
    alternates: {
      canonical: `/collections/${slug}`,
      languages: {
        en: `/collections/${slug}`,
        ...(hasJaVersion ? { ja: `/ja/collections/${slug}` } : {}),
        "x-default": `/collections/${slug}`,
      },
    },
    openGraph: {
      title: collection.frontmatter.title,
      description: collection.frontmatter.description,
      type: "article",
      publishedTime: collection.frontmatter.publishedAt,
    },
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  const canonicalUrl = `${SITE_URL}/collections/${slug}`;

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
      { "@type": "ListItem", position: 1, name: "Collections", item: `${SITE_URL}/collections` },
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
      <p className="text-sm uppercase tracking-wide text-muted-foreground">
        {collection.frontmatter.authors.map((name, i) => (
          <span key={name}>
            {i > 0 && ", "}
            <Link href={`/authors/${slugify(name)}`} className="underline">
              {name}
            </Link>
          </span>
        ))}
        {" · "}
        {collection.frontmatter.destinations.map((name, i) => {
          const destHref = getDestinationHref(name);
          return (
            <span key={name}>
              {i > 0 && ", "}
              {destHref ? (
                <Link href={destHref} className="underline">
                  {name}
                </Link>
              ) : (
                name
              )}
            </span>
          );
        })}
      </p>
      <h1>{collection.frontmatter.title}</h1>
      <p className="text-muted-foreground">{collection.frontmatter.description}</p>

      <FeaturedWorks works={collection.frontmatter.works} />

      <BookList works={collection.frontmatter.works} authors={collection.frontmatter.authors} />

      <MDXRemote
        source={collection.content}
        components={{
          AffiliateDisclosureNote,
          // MapLink stays a silent data source here (each stop's location,
          // consolidated into the one route link below) rather than a
          // per-stop button - see MapRouteLink.tsx.
          MapLink: () => null,
          MapRouteLink: () => (
            <MapRouteLink stops={extractMapStops(collection.content)} />
          ),
          StopImage,
        }}
      />

      {collection.frontmatter.authors.map((name) => (
        <AuthorCorner key={name} name={name} />
      ))}

      <PlanYourTrip
        authors={collection.frontmatter.authors}
        destinations={collection.frontmatter.destinations}
        homeBase={collection.frontmatter.homeBase}
      />
    </article>
  );
}
