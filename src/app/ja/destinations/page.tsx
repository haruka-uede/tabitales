import Link from "next/link";
import { getAllDestinations, getArticlesByDestination } from "@/lib/articles";
import { JAPAN_MAP, REGION_NAMES, getPlaceNameJa } from "@/lib/japanMap";
import { getWorkNameJa } from "@/lib/workProfiles";
import { slugify } from "@/lib/slug";
import DestinationsMap from "@/components/DestinationsMap";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "行き先から探す" };

export default function JaDestinationsPage() {
  const regionSlugs = new Set(REGION_NAMES.map(slugify));
  const destinations = getAllDestinations({ locale: "ja" }).filter((d) => regionSlugs.has(d.slug));
  const prefectures = JAPAN_MAP.locations.map((location) => ({
    id: location.id,
    name: location.name,
    articles: getArticlesByDestination(location.id, "ja"),
  }));

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-4">行き先から探す</h1>
      <p className="text-muted-foreground mb-10 max-w-2xl">
        訪れる地域がすでに決まっている方は、その土地にゆかりのある作品やガイドを探せます。
      </p>

      <DestinationsMap prefectures={prefectures} locale="ja" />

      <div className="grid sm:grid-cols-2 gap-6">
        {destinations.map((destination) => (
          <Card key={destination.slug}>
            <CardHeader>
              <CardTitle>
                <Link href={`/ja/destinations/${destination.slug}`} className="hover:underline">
                  {getPlaceNameJa(destination.name)}
                </Link>
              </CardTitle>
              <CardDescription>{destination.articles.length}件のガイド</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {destination.articles.map((article) => (
                  <Link key={article.slug} href={`/ja/articles/${article.slug}`}>
                    <Badge variant="outline" className="cursor-pointer">
                      {getWorkNameJa(article.frontmatter.work)}
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
