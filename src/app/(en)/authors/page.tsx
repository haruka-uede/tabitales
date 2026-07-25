import Link from "next/link";
import { getAllAuthors, getAuthorDestinations } from "@/lib/articles";
import { AUTHOR_BLURBS } from "@/lib/authorProfiles";
import { getDestinationHref } from "@/lib/japanMap";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Authors" };

export default function AuthorsPage() {
  const authors = getAllAuthors();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-4">Authors We Follow</h1>
      <p className="text-muted-foreground mb-10 max-w-2xl">
        Tabi Tales is an independent, unofficial fan project. We are not affiliated
        with or endorsed by any of the authors, publishers, or rights holders
        mentioned below.
      </p>
      <div className="grid sm:grid-cols-2 gap-6">
        {authors.map((author) => (
          <Card key={author.slug} id={author.slug}>
            <CardHeader>
              <CardTitle>
                <Link href={`/authors/${author.slug}`} className="hover:underline">
                  {author.name}
                </Link>
              </CardTitle>
              {AUTHOR_BLURBS[author.slug] && (
                <CardDescription>{AUTHOR_BLURBS[author.slug]}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-1.5">
                {author.articles.map((article) => (
                  <Link key={article.slug} href={`/articles/${article.slug}`}>
                    <Badge variant="outline" className="cursor-pointer">
                      {article.frontmatter.work}
                    </Badge>
                  </Link>
                ))}
              </div>
              {getAuthorDestinations(author.slug).length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">
                    Places connected to {author.name}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {getAuthorDestinations(author.slug).map((destination) => {
                      const href = getDestinationHref(destination);
                      return href ? (
                        <Link key={destination} href={href}>
                          <Badge variant="secondary" className="cursor-pointer">
                            {destination}
                          </Badge>
                        </Link>
                      ) : (
                        <Badge key={destination} variant="outline">
                          {destination}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
