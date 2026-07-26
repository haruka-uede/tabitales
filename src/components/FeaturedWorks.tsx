import Link from "next/link";
import { getArticleByWork } from "@/lib/articles";
import { getWorkNameJa } from "@/lib/workProfiles";
import { href as localeHref, type Locale } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";

const COPY = {
  en: { heading: "Works featured in this guide" },
  ja: { heading: "この記事で紹介した作品" },
} satisfies Record<Locale, unknown>;

// Links each work a collection mentions back to its own single-work article,
// where one exists on this site - otherwise just shows the title as plain text.
export default function FeaturedWorks({
  works,
  locale = "en" as Locale,
}: {
  works: string[];
  locale?: Locale;
}) {
  const t = COPY[locale];

  return (
    <div className="not-prose my-6">
      <p className="text-xs font-medium text-muted-foreground mb-1.5">{t.heading}</p>
      <div className="flex flex-wrap gap-1.5">
        {works.map((work) => {
          const article = getArticleByWork(work, locale);
          const label = locale === "ja" ? getWorkNameJa(work) : work;
          return article ? (
            <Link key={work} href={localeHref(locale, `/articles/${article.slug}`)}>
              <Badge variant="secondary" className="cursor-pointer">
                {label}
              </Badge>
            </Link>
          ) : (
            <Badge key={work} variant="outline">
              {label}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
