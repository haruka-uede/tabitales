import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import { slugify } from "@/lib/slug";
import { SITE_NAME, SITE_URL, jsonLdScript } from "@/lib/site";
import AffiliateDisclosureNote from "@/components/AffiliateDisclosureNote";

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

// Only slugs returned by generateStaticParams (i.e. non-draft) are servable.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.frontmatter.title,
    description: article.frontmatter.description,
    alternates: { canonical: `/articles/${slug}` },
    openGraph: {
      title: article.frontmatter.title,
      description: article.frontmatter.description,
      type: "article",
      publishedTime: article.frontmatter.publishedAt,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const canonicalUrl = `${SITE_URL}/articles/${slug}`;

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
      { "@type": "ListItem", position: 1, name: "Guides", item: `${SITE_URL}/articles` },
      { "@type": "ListItem", position: 2, name: article.frontmatter.title, item: canonicalUrl },
    ],
  };

  return (
    <article className="max-w-2xl mx-auto px-6 py-12 prose prose-neutral">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd) }}
      />
      <p className="text-sm uppercase tracking-wide text-neutral-500">
        {article.frontmatter.authors.map((name, i) => (
          <span key={name}>
            {i > 0 && ", "}
            <Link href={`/authors/${slugify(name)}`} className="underline">
              {name}
            </Link>
          </span>
        ))}
        {" · "}
        {article.frontmatter.destinations.join(", ")}
      </p>
      <h1>{article.frontmatter.title}</h1>
      <p className="text-neutral-600">{article.frontmatter.description}</p>

      <MDXRemote
        source={article.content}
        components={{ AffiliateDisclosureNote }}
      />
    </article>
  );
}
