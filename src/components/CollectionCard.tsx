import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { slugify } from "@/lib/slug";
import { getDestinationHref, getPlaceNameJa } from "@/lib/japanMap";
import { getAuthorNameJa } from "@/lib/authorProfiles";
import { href as localeHref, type Locale } from "@/lib/i18n";
import type { ThemeCollection } from "@/lib/collections";

export default function CollectionCard({
  collection,
  locale = "en" as Locale,
}: {
  collection: ThemeCollection;
  locale?: Locale;
}) {
  return (
    <Card className="flex h-full flex-col">
      {collection.frontmatter.image && (
        <Image
          src={collection.frontmatter.image}
          alt={collection.frontmatter.title}
          width={800}
          height={450}
          className="h-48 w-full object-cover"
        />
      )}
      <CardHeader>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {collection.frontmatter.authors.map((name, i) => {
            const slug = slugify(name);
            const label = locale === "ja" ? getAuthorNameJa(slug, name) : name;
            return (
              <span key={name}>
                {i > 0 && ", "}
                <Link href={localeHref(locale, `/authors/${slug}`)} className="hover:underline">
                  {label}
                </Link>
              </span>
            );
          })}
        </p>
        <CardTitle>
          <Link
            href={localeHref(locale, `/collections/${collection.slug}`)}
            className="hover:underline"
          >
            {collection.frontmatter.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <p className="text-muted-foreground line-clamp-3">{collection.frontmatter.description}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
          {collection.frontmatter.destinations.map((name) => {
            const destHref = getDestinationHref(name, locale);
            const label = locale === "ja" ? getPlaceNameJa(name) : name;
            return destHref ? (
              <Link key={name} href={destHref}>
                <Badge variant="secondary" className="cursor-pointer">
                  {label}
                </Badge>
              </Link>
            ) : (
              <Badge key={name} variant="outline">
                {label}
              </Badge>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
