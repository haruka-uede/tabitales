import Link from "next/link";
import { getAllAuthors, getAuthorDestinations } from "@/lib/articles";
import { AUTHOR_PROFILES, getAuthorNameJa } from "@/lib/authorProfiles";
import { getWorkNameJa } from "@/lib/workProfiles";
import { getDestinationHref, getPlaceNameJa } from "@/lib/japanMap";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "著者から探す" };

export default function JaAuthorsPage() {
  const authors = getAllAuthors({ locale: "ja" });

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-4">著者から探す</h1>
      <p className="text-muted-foreground mb-10 max-w-2xl">
        Tabi Talesは独立系のファンサイトであり、以下に掲載する作家・出版社・権利者とは一切提携していません。
      </p>
      <div className="grid sm:grid-cols-2 gap-6">
        {authors.map((author) => {
          const displayName = getAuthorNameJa(author.slug, author.name);
          const destinations = getAuthorDestinations(author.slug, "ja");
          return (
            <Card key={author.slug} id={author.slug}>
              <CardHeader>
                <CardTitle>
                  <Link href={`/ja/authors/${author.slug}`} className="hover:underline">
                    {displayName}
                  </Link>
                </CardTitle>
                {AUTHOR_PROFILES[author.slug]?.blurbJa && (
                  <CardDescription>{AUTHOR_PROFILES[author.slug].blurbJa}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {author.articles.map((article) => (
                    <Link key={article.slug} href={`/ja/articles/${article.slug}`}>
                      <Badge variant="outline" className="cursor-pointer">
                        {getWorkNameJa(article.frontmatter.work)}
                      </Badge>
                    </Link>
                  ))}
                </div>
                {destinations.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">
                      {displayName}にゆかりの地
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {destinations.map((destination) => {
                        const destHref = getDestinationHref(destination, "ja");
                        const label = getPlaceNameJa(destination);
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
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
