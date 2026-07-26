import { getAllCollections } from "@/lib/collections";
import CollectionCard from "@/components/CollectionCard";

export const metadata = { title: "特集" };

export default function JaCollectionsIndexPage() {
  const collections = getAllCollections({ locale: "ja" });

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-4">特集</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        一冊の本にとどまらず、一人の作家のゆかりの地を街ごとたどったり、一つの土地を複数の作家の視点から見てみたりする、テーマ別のガイドです。
      </p>
      <div className="grid sm:grid-cols-2 gap-6">
        {collections.map((collection) => (
          <CollectionCard key={collection.slug} collection={collection} locale="ja" />
        ))}
      </div>
    </div>
  );
}
