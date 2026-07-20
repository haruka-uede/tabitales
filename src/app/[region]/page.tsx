import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticlesByDestination } from "@/lib/articles";
import { JAPAN_MAP, REGION_NAMES, REGION_OF_PREFECTURE } from "@/lib/japanMap";
import { slugify } from "@/lib/slug";
import { Badge } from "@/components/ui/badge";

export function generateStaticParams() {
  return REGION_NAMES.filter((name) => getArticlesByDestination(slugify(name)).length > 0).map(
    (name) => ({ region: slugify(name) })
  );
}

export const dynamicParams = false;

function findRegion(regionSlug: string) {
  return REGION_NAMES.find((name) => slugify(name) === regionSlug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string }>;
}): Promise<Metadata> {
  const { region } = await params;
  const name = findRegion(region);
  if (!name) return {};
  return { title: name, alternates: { canonical: `/${region}` } };
}

export default async function RegionPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region } = await params;
  const name = findRegion(region);
  if (!name) notFound();

  const prefectures = JAPAN_MAP.locations
    .filter((location) => REGION_OF_PREFECTURE[location.id] === name)
    .map((location) => ({
      id: location.id,
      name: location.name,
      articles: getArticlesByDestination(location.id),
    }))
    .filter((prefecture) => prefecture.articles.length > 0);

  const shownSlugs = new Set(prefectures.flatMap((p) => p.articles.map((a) => a.slug)));
  const otherArticles = getArticlesByDestination(region).filter((a) => !shownSlugs.has(a.slug));

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <p className="text-sm mb-6">
        <Link href="/destinations" className="text-muted-foreground hover:underline">
          ← All destinations
        </Link>
      </p>
      <h1 className="text-3xl font-semibold mb-8">{name}</h1>

      <div className="space-y-10">
        {prefectures.map((prefecture) => (
          <div key={prefecture.id}>
            <h2 className="text-xl font-medium">
              <Link href={`/${region}/${prefecture.id}`} className="hover:underline">
                {prefecture.name}
              </Link>
            </h2>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {prefecture.articles.map((article) => (
                <Link key={article.slug} href={`/articles/${article.slug}`}>
                  <Badge variant="outline" className="cursor-pointer">
                    {article.frontmatter.work}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {otherArticles.length > 0 && (
          <div>
            <h2 className="text-xl font-medium">Elsewhere in {name}</h2>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {otherArticles.map((article) => (
                <Link key={article.slug} href={`/articles/${article.slug}`}>
                  <Badge variant="outline" className="cursor-pointer">
                    {article.frontmatter.work}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
