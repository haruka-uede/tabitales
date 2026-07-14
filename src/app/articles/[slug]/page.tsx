import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import AffiliateDisclosureNote from "@/components/AffiliateDisclosureNote";

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <article className="max-w-2xl mx-auto px-6 py-12 prose prose-neutral">
      <p className="text-sm uppercase tracking-wide text-neutral-500">
        {article.frontmatter.destination}
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
