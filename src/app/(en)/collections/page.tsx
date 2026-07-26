import { getAllCollections } from "@/lib/collections";
import CollectionCard from "@/components/CollectionCard";

export default function CollectionsIndexPage() {
  const collections = getAllCollections();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-4">Collections</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Themed guides that span more than one book — an author&apos;s work across a whole
        city, or a region seen through several different writers.
      </p>
      <div className="grid sm:grid-cols-2 gap-6">
        {collections.map((collection) => (
          <CollectionCard key={collection.slug} collection={collection} />
        ))}
      </div>
    </div>
  );
}
