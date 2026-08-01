import Image from "next/image";
import { getCachedBookInfo } from "@/lib/bookInfoCache";
import { getBookAffiliateLink } from "@/lib/affiliate";
import { Card, CardContent } from "@/components/ui/card";
import BuyBookButton from "@/components/BuyBookButton";
import type { Locale } from "@/lib/i18n";

const COPY = {
  en: { buyLabel: "Get the book" },
  ja: { buyLabel: "書籍を見る" },
} satisfies Record<Locale, unknown>;

// Collection counterpart to BookCard/BookCardJa: same cache lookup and same
// BuyBookButton (so it's gated on the same cookie consent), but rendered as
// one compact row per work instead of one full card each - a collection can
// feature anywhere from two to half a dozen works, and stacking full
// BookCards that many times would dominate the page.
export default function BookList({
  works,
  authors,
  locale = "en" as Locale,
}: {
  works: string[];
  authors: string[];
  locale?: Locale;
}) {
  const t = COPY[locale];
  const entries = works
    .map((work) => ({ work, book: getCachedBookInfo(locale, work) }))
    .filter((entry) => entry.book !== null);

  if (entries.length === 0) return null;

  return (
    <Card className="not-prose my-6">
      <CardContent className="divide-y divide-border">
        {entries.map(({ work, book }) => {
          const info = book!;
          const buyLink = getBookAffiliateLink(work, authors);
          return (
            <div key={work} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              {info.thumbnail && (
                <Image
                  src={info.thumbnail}
                  alt={info.title}
                  width={40}
                  height={60}
                  className="rounded shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium leading-snug truncate">{info.title}</p>
                {info.authors && (
                  <p className="text-xs text-muted-foreground truncate">{info.authors.join(", ")}</p>
                )}
              </div>
              {buyLink && <BuyBookButton href={buyLink} label={t.buyLabel} />}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
