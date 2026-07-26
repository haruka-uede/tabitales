import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { slugify } from "@/lib/slug";
import { getDestinationHref, getPlaceNameJa } from "@/lib/japanMap";
import { getAuthorNameJa } from "@/lib/authorProfiles";
import { getWorkNameJa } from "@/lib/workProfiles";
import { href as localeHref, type Locale } from "@/lib/i18n";
import type { Article } from "@/lib/articles";

// /authors and /destinations (and their JA equivalents) don't exist for
// locale="ja" yet, so author names and destination badges render as plain
// text there instead of links - see the same note in SiteHeader.tsx.
export default function ArticleCard({
  article,
  locale = "en" as Locale,
}: {
  article: Article;
  locale?: Locale;
}) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {article.frontmatter.authors.map((name, i) => {
            const slug = slugify(name);
            const label = locale === "ja" ? getAuthorNameJa(slug, name) : name;
            return (
              <span key={name}>
                {i > 0 && ", "}
                {locale === "en" ? (
                  <Link href={`/authors/${slug}`} className="hover:underline">
                    {label}
                  </Link>
                ) : (
                  label
                )}
              </span>
            );
          })}
        </p>
        <CardTitle>
          <Link href={localeHref(locale, `/articles/${article.slug}`)} className="hover:underline">
            {locale === "ja" ? getWorkNameJa(article.frontmatter.work) : article.frontmatter.work}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <p className="text-muted-foreground line-clamp-3">{article.frontmatter.description}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
          {article.frontmatter.destinations.map((name) => {
            const destHref = locale === "en" ? getDestinationHref(name) : undefined;
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
