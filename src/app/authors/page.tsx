import Link from "next/link";
import { getAllAuthors } from "@/lib/articles";
import { AUTHOR_BLURBS, getAuthorInitials } from "@/lib/authorProfiles";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
            <CardHeader className="flex-row items-center gap-3 space-y-0">
              <Avatar size="lg">
                <AvatarFallback>{getAuthorInitials(author.name)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>
                  <Link href={`/authors/${author.slug}`} className="hover:underline">
                    {author.name}
                  </Link>
                </CardTitle>
                {AUTHOR_BLURBS[author.slug] && (
                  <CardDescription className="mt-1">{AUTHOR_BLURBS[author.slug]}</CardDescription>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {author.articles.map((article) => (
                  <Link key={article.slug} href={`/articles/${article.slug}`}>
                    <Badge variant="outline" className="cursor-pointer">
                      {article.frontmatter.work}
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
