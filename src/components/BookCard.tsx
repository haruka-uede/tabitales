import Image from "next/image";
import { getCachedBookInfo } from "@/lib/bookInfoCache";
import { getBookAffiliateLink } from "@/lib/affiliate";
import { Card, CardContent } from "@/components/ui/card";
import BuyBookButton from "@/components/BuyBookButton";

export default function BookCard({
  work,
  authors,
}: {
  work: string;
  authors: string[];
}) {
  const book = getCachedBookInfo("en", work);
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
          {buyLink && <BuyBookButton href={buyLink} label="Get the book" />}
        </div>
      </CardContent>
    </Card>
  );
}
