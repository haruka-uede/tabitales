import Link from "next/link";
import { getArticlesByAuthor, getAuthorDestinations } from "@/lib/articles";
import { AUTHOR_PROFILES, getAuthorNameJa } from "@/lib/authorProfiles";
import { getDestinationHref, getPlaceNameJa } from "@/lib/japanMap";
import { getWorkNameJa } from "@/lib/workProfiles";
import { href as localeHref, type Locale } from "@/lib/i18n";
import { slugify } from "@/lib/slug";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const COPY = {
  en: {
    aboutTheAuthor: "About the author",
    places: (name: string) => `Places connected to ${name}`,
    moreGuides: (name: string) => `More guides by ${name}`,
  },
  ja: {
    aboutTheAuthor: "著者について",
    places: (name: string) => `${name}にゆかりの地`,
    moreGuides: (name: string) => `${name}のその他のガイド`,
  },
} satisfies Record<Locale, unknown>;

export default function AuthorCorner({
  name,
  excludeSlug,
  locale = "en" as Locale,
}: {
  name: string;
  excludeSlug?: string;
  locale?: Locale;
}) {
  const slug = slugify(name);
  const displayName = locale === "ja" ? getAuthorNameJa(slug, name) : name;
  const blurb = AUTHOR_PROFILES[slug]?.blurb;
  const destinations = getAuthorDestinations(slug, locale);
  const otherArticles = getArticlesByAuthor(slug, locale).filter((a) => a.slug !== excludeSlug);
  const t = COPY[locale];

  return (
    <Card className="mt-8 not-prose">
      <CardHeader>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {t.aboutTheAuthor}
        </p>
        <CardTitle>
          <Link href={localeHref(locale, `/authors/${slug}`)} className="hover:underline">
            {displayName}
          </Link>
        </CardTitle>
        {blurb && locale === "en" && <CardDescription>{blurb}</CardDescription>}
      </CardHeader>
      {(destinations.length > 0 || otherArticles.length > 0) && (
        <CardContent className="space-y-4">
          {destinations.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                {t.places(displayName)}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {destinations.map((destination) => {
                  const destHref = getDestinationHref(destination, locale);
                  const label = locale === "ja" ? getPlaceNameJa(destination) : destination;
                  return destHref ? (
                    <Link key={destination} href={destHref}>
                      <Badge variant="secondary" className="cursor-pointer">
                        {label}
                      </Badge>
                    </Link>
                  ) : (
                    <Badge key={destination} variant="outline">
                      {label}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
          {otherArticles.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                {t.moreGuides(displayName)}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {otherArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={localeHref(locale, `/articles/${article.slug}`)}
                  >
                    <Badge variant="outline" className="cursor-pointer">
                      {locale === "ja"
                        ? getWorkNameJa(article.frontmatter.work)
                        : article.frontmatter.work}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
