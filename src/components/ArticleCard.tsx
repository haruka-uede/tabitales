import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { slugify } from "@/lib/slug";
import { getDestinationHref } from "@/lib/japanMap";
import type { Article } from "@/lib/articles";

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {article.frontmatter.authors.map((name, i) => (
            <span key={name}>
              {i > 0 && ", "}
              <Link href={`/authors/${slugify(name)}`} className="hover:underline">
                {name}
              </Link>
            </span>
          ))}
        </p>
        <CardTitle>
          <Link href={`/articles/${article.slug}`} className="hover:underline">
            {article.frontmatter.work}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <p className="text-muted-foreground line-clamp-3">{article.frontmatter.description}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
          {article.frontmatter.destinations.map((name) => {
            const href = getDestinationHref(name);
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
