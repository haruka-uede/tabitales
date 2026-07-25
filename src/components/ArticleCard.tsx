import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { slugify } from "@/lib/slug";
import { getDestinationHref } from "@/lib/japanMap";
import { AUTHOR_NAMES_JA } from "@/lib/authorProfiles";
import { href as localeHref, type Locale } from "@/lib/i18n";
import type { Article } from "@/lib/articles";

// /authors and /destinations (and their JA equivalents) don't exist for
// locale="ja" yet, so author names and destination badges render as plain
// text there instead of links - see the plan's note on not linking a JA
// reader into an English-only facet page.
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
          {article.frontmatter.authors.map((name, i) => (
            <span key={name}>
              {i > 0 && ", "}
              {locale === "en" ? (
                <Link href={`/authors/${slugify(name)}`} className="hover:underline">
                  {name}
                </Link>
              ) : (
                (AUTHOR_NAMES_JA[slugify(name)] ?? name)
              )}
            </span>
          ))}
        </p>
        <CardTitle>
          <Link href={localeHref(locale, `/articles/${article.slug}`)} className="hover:underline">
            {article.frontmatter.work}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <p className="text-muted-foreground line-clamp-3">{article.frontmatter.description}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
          {article.frontmatter.destinations.map((name) => {
            const href = locale === "en" ? getDestinationHref(name) : undefined;
            return href ? (
              <Link key={name} href={href}>
                <Badge variant="secondary" className="cursor-pointer">
                  {name}
                </Badge>
              </Link>
            ) : (
              <Badge key={name} variant="outline">
                {name}
              </Badge>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
