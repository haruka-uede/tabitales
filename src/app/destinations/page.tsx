import Link from "next/link";
import { getAllDestinations, getArticlesByDestination } from "@/lib/articles";
import { JAPAN_MAP, REGION_NAMES } from "@/lib/japanMap";
import { slugify } from "@/lib/slug";
import DestinationsMap from "@/components/DestinationsMap";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Destinations" };

export default function DestinationsPage() {
  // Only the region-level heading is shown for now - once municipality-level
  // coverage grows, revisit whether it needs its own listing here too.
  const regionSlugs = new Set(REGION_NAMES.map(slugify));
  const destinations = getAllDestinations().filter((d) => regionSlugs.has(d.slug));
  const prefectures = JAPAN_MAP.locations.map((location) => ({
    id: location.id,
    name: location.name,
    articles: getArticlesByDestination(location.id),
  }));

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-4">Browse by Destination</h1>
      <p className="text-muted-foreground mb-10 max-w-2xl">
        Already know where you&rsquo;re headed in Japan? Find the novels and guides tied to
        that region.
      </p>

      <DestinationsMap prefectures={prefectures} />

      <div className="grid sm:grid-cols-2 gap-6">
        {destinations.map((destination) => (
          <Card key={destination.slug}>
            <CardHeader>
              <CardTitle>
                <Link href={`/${destination.slug}`} className="hover:underline">
                  {destination.name}
                </Link>
              </CardTitle>
              <CardDescription>
                {destination.articles.length} guide{destination.articles.length === 1 ? "" : "s"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {destination.articles.map((article) => (
                  <Link key={article.slug} href={`/articles/${article.slug}`}>
                    <Badge variant="outline" className="cursor-pointer">
                      {article.frontmatter.work}
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
