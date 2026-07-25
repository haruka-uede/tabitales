import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticlesByDestination } from "@/lib/articles";
import { JAPAN_MAP, REGION_OF_PREFECTURE } from "@/lib/japanMap";
import { slugify } from "@/lib/slug";
import ArticleCard from "@/components/ArticleCard";

export function generateStaticParams() {
  return JAPAN_MAP.locations
    .filter((location) => getArticlesByDestination(location.id).length > 0)
    .map((location) => ({
      region: slugify(REGION_OF_PREFECTURE[location.id]),
      prefecture: location.id,
    }));
}

export const dynamicParams = false;

function findPrefecture(regionSlug: string, prefectureSlug: string) {
  const location = JAPAN_MAP.locations.find((l) => l.id === prefectureSlug);
  if (!location || slugify(REGION_OF_PREFECTURE[location.id]) !== regionSlug) return undefined;
  return location;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string; prefecture: string }>;
}): Promise<Metadata> {
  const { region, prefecture } = await params;
  const location = findPrefecture(region, prefecture);
  if (!location) return {};
  return { title: location.name, alternates: { canonical: `/${region}/${prefecture}` } };
}

export default async function PrefecturePage({
  params,
}: {
  params: Promise<{ region: string; prefecture: string }>;
}) {
  const { region, prefecture } = await params;
  const location = findPrefecture(region, prefecture);
  if (!location) notFound();

  const articles = getArticlesByDestination(prefecture);
  const regionName = REGION_OF_PREFECTURE[location.id];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <p className="text-sm mb-6">
        <Link href={`/${region}`} className="text-muted-foreground hover:underline">
          ← {regionName}
        </Link>
      </p>
      <h1 className="text-3xl font-semibold mb-8">{location.name}</h1>
      <div className="grid sm:grid-cols-2 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
