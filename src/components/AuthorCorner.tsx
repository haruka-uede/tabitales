import Link from "next/link";
import { getArticlesByAuthor, getAuthorDestinations } from "@/lib/articles";
import { AUTHOR_BLURBS } from "@/lib/authorProfiles";
import { getDestinationHref } from "@/lib/japanMap";
import { slugify } from "@/lib/slug";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AuthorCorner({
  name,
  excludeSlug,
}: {
  name: string;
  excludeSlug?: string;
}) {
  const slug = slugify(name);
  const blurb = AUTHOR_BLURBS[slug];
  const destinations = getAuthorDestinations(slug);
  const otherArticles = getArticlesByAuthor(slug).filter((a) => a.slug !== excludeSlug);

  return (
    <Card className="mt-8 not-prose">
      <CardHeader>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">About the author</p>
        <CardTitle>
          <Link href={`/authors/${slug}`} className="hover:underline">
            {name}
          </Link>
        </CardTitle>
        {blurb && <CardDescription>{blurb}</CardDescription>}
      </CardHeader>
      {(destinations.length > 0 || otherArticles.length > 0) && (
        <CardContent className="space-y-4">
          {destinations.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                Places connected to {name}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {destinations.map((destination) => {
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
          {otherArticles.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                More guides by {name}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {otherArticles.map((article) => (
                  <Link key={article.slug} href={`/articles/${article.slug}`}>
                    <Badge variant="outline" className="cursor-pointer">
                      {article.frontmatter.work}
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
