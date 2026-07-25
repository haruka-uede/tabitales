import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import { AUTHOR_NAMES_JA } from "@/lib/authorProfiles";
import { slugify } from "@/lib/slug";
import { SITE_NAME, SITE_URL, jsonLdScript } from "@/lib/site";
import AffiliateDisclosureNoteJa from "@/components/AffiliateDisclosureNoteJa";
import AffiliateDisclosureBannerJa from "@/components/AffiliateDisclosureBannerJa";
import BookCard from "@/components/BookCard";
import PlanYourTrip from "@/components/PlanYourTrip";

export function generateStaticParams() {
  return getAllArticles({ locale: "ja" }).map((article) => ({ slug: article.slug }));
}

// Only slugs returned by generateStaticParams (i.e. non-draft JA translations) are servable.
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
      { "@type": "ListItem", position: 1, name: "文学ガイド", item: `${SITE_URL}/ja/articles` },
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
      {/* /authors and /ja/authors don't exist yet, so author names render as
          plain text here rather than links - see plan note on not linking a
          JA reader into an English-only (or nonexistent) facet page. */}
      <p className="text-sm uppercase tracking-wide text-muted-foreground">
        {article.frontmatter.authors
          .map((name) => AUTHOR_NAMES_JA[slugify(name)] ?? name)
          .join("、")}
        {" ・ "}
        {article.frontmatter.destinations.join("、")}
      </p>
      <h1>{article.frontmatter.title}</h1>

      <AffiliateDisclosureBannerJa />

      <p className="text-muted-foreground">{article.frontmatter.description}</p>

      <BookCard work={article.frontmatter.work} authors={article.frontmatter.authors} />

      <MDXRemote
        source={article.content}
        components={{ AffiliateDisclosureNote: AffiliateDisclosureNoteJa }}
      />

      <PlanYourTrip
        work={article.frontmatter.work}
        authors={article.frontmatter.authors}
        destinations={article.frontmatter.destinations}
        homeBase={article.frontmatter.homeBase}
      />
    </article>
  );
}
