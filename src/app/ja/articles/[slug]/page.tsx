import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import { getAuthorNameJa } from "@/lib/authorProfiles";
import { getDestinationHref, getPlaceNameJa } from "@/lib/japanMap";
import { extractMapStops } from "@/lib/mapStops";
import { slugify } from "@/lib/slug";
import { OG_IMAGE, SITE_NAME, SITE_URL, jsonLdScript } from "@/lib/site";
import AffiliateDisclosureNoteJa from "@/components/AffiliateDisclosureNoteJa";
import AffiliateDisclosureBannerJa from "@/components/AffiliateDisclosureBannerJa";
import AuthorCorner from "@/components/AuthorCorner";
import BookCardJa from "@/components/BookCardJa";
import MapRouteLinkJa from "@/components/MapRouteLinkJa";
import PlanYourTrip from "@/components/PlanYourTrip";
import StopImageJa from "@/components/StopImageJa";

export function generateStaticParams() {
  return getAllArticles({ locale: "ja" }).map((article) => ({ slug: article.slug }));
}

// Only slugs returned by generateStaticParams (i.e. status: "published" JA translations) are servable.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug, "ja");
  if (!article) return {};

  const hasEnVersion = !!getArticleBySlug(slug, "en");

  return {
    title: article.frontmatter.title,
    description: article.frontmatter.description,
    alternates: {
      canonical: `/ja/articles/${slug}`,
      languages: {
        ja: `/ja/articles/${slug}`,
        ...(hasEnVersion ? { en: `/articles/${slug}` } : {}),
        "x-default": hasEnVersion ? `/articles/${slug}` : `/ja/articles/${slug}`,
      },
    },
    openGraph: {
      title: article.frontmatter.title,
      description: article.frontmatter.description,
      type: "article",
      publishedTime: article.frontmatter.publishedAt,
      images: [article.frontmatter.image ?? OG_IMAGE],
    },
  };
}

export default async function JaArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug, "ja");
  if (!article) notFound();

  const canonicalUrl = `${SITE_URL}/ja/articles/${slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.frontmatter.title,
    description: article.frontmatter.description,
    datePublished: article.frontmatter.publishedAt,
    dateModified: article.frontmatter.publishedAt,
    mainEntityOfPage: canonicalUrl,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    about: {
      "@type": "Book",
      name: article.frontmatter.work,
      author: article.frontmatter.authors.map((name) => ({
        "@type": "Person",
        name,
      })),
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "作品", item: `${SITE_URL}/ja/articles` },
      { "@type": "ListItem", position: 2, name: article.frontmatter.title, item: canonicalUrl },
    ],
  };

  return (
    <article className="max-w-2xl mx-auto px-6 py-12 prose prose-neutral dark:prose-invert">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd) }}
      />
      {article.frontmatter.image && (
        <Image
          src={article.frontmatter.image}
          alt={article.frontmatter.work}
          width={1672}
          height={941}
          priority
          className="not-prose w-full h-auto rounded-xl"
        />
      )}
      <p className="text-sm uppercase tracking-wide text-muted-foreground">
        {article.frontmatter.authors.map((name, i) => {
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
        {article.frontmatter.destinations.map((name, i) => {
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
      <h1>{article.frontmatter.title}</h1>

      <AffiliateDisclosureBannerJa />

      <p className="text-muted-foreground">{article.frontmatter.description}</p>

      <BookCardJa work={article.frontmatter.work} authors={article.frontmatter.authors} />

      <MDXRemote
        source={article.content}
        components={{
          AffiliateDisclosureNote: AffiliateDisclosureNoteJa,
          // MapLink stays a silent data source here (each stop's location,
          // consolidated into the one route link below) rather than a
          // per-stop button - see MapRouteLinkJa.tsx.
          MapLink: () => null,
          MapRouteLink: () => (
            <MapRouteLinkJa stops={extractMapStops(article.content)} />
          ),
          StopImage: StopImageJa,
        }}
      />

      {article.frontmatter.authors.map((name) => (
        <AuthorCorner key={name} name={name} excludeSlug={article.slug} locale="ja" />
      ))}

      <PlanYourTrip
        work={article.frontmatter.work}
        authors={article.frontmatter.authors}
        destinations={article.frontmatter.destinations}
        homeBase={article.frontmatter.homeBase}
      />
    </article>
  );
}
