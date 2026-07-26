import Image from "next/image";
import { fetchBookInfo } from "@/lib/googleBooks";
import { getBookAffiliateLink } from "@/lib/affiliate";
import { getWorkNameJa } from "@/lib/workProfiles";
import { getAuthorNameJa } from "@/lib/authorProfiles";
import { slugify } from "@/lib/slug";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function BookCardJa({
  work,
  authors,
}: {
  work: string;
  authors: string[];
}) {
  const workJa = getWorkNameJa(work);
  const authorsJa = authors.map((name) => getAuthorNameJa(slugify(name), name));

  const book =
    (await fetchBookInfo(workJa, authorsJa, { langRestrict: "ja" })) ??
    (await fetchBookInfo(work, authors));
  if (!book) return null;

  const buyLink = getBookAffiliateLink(work, authors);

  return (
    <Card className="not-prose my-6">
      <CardContent className="flex items-start gap-4">
        {book.thumbnail && (
          <Image
            src={book.thumbnail}
            alt={book.title}
            width={80}
            height={120}
            className="rounded shrink-0"
          />
        )}
        <div className="flex flex-col gap-2">
          <div>
            <p className="font-medium leading-snug">{book.title}</p>
            {book.authors && (
              <p className="text-sm text-muted-foreground">{book.authors.join(", ")}</p>
            )}
          </div>
          {book.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">{book.description}</p>
          )}
          {buyLink && (
            <Button
              size="sm"
              className="w-fit"
              nativeButton={false}
              render={<a href={buyLink} target="_blank" rel="sponsored noopener" />}
            >
              書籍を見る
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
