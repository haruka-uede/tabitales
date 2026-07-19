import Link from "next/link";
import { getAllDestinations, getArticlesByDestination } from "@/lib/articles";
import { JAPAN_MAP } from "@/lib/japanMap";
import DestinationsMap from "@/components/DestinationsMap";

export const metadata = { title: "Destinations" };

export default function DestinationsPage() {
  const destinations = getAllDestinations();
  const prefectures = JAPAN_MAP.locations.map((location) => ({
    id: location.id,
    name: location.name,
    articles: getArticlesByDestination(location.id),
  }));

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-4">Browse by Destination</h1>
      <p className="text-neutral-600 mb-10">
        Already know where you&rsquo;re headed in Japan? Find the novels and guides tied to
        that region.
      </p>

      <DestinationsMap prefectures={prefectures} />

      <div className="max-w-2xl space-y-10">
        {destinations.map((destination) => (
          <div key={destination.slug} id={destination.slug}>
            <h2 className="text-xl font-medium">{destination.name}</h2>
            <ul className="mt-3 space-y-1">
              {destination.articles.map((article) => (
                <li key={article.slug}>
                  <Link href={`/articles/${article.slug}`} className="text-sm hover:underline">
                    {article.frontmatter.work}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
