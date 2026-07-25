"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { dictionary, type Locale } from "@/lib/i18n";

// Static pages that exist in both locales at a predictable path (home,
// article index, disclosure, privacy policy, contact) - safe to toggle by
// just adding/removing the /ja prefix. Everything else (article detail
// pages, and EN-only facet pages like /authors or /destinations that have
// no JA equivalent yet) is resolved via the hreflang lookup below, or
// falls back to the target locale's home page.
const STATIC_PAIRED_PATHS = new Set(["/", "/articles", "/disclosure", "/privacy-policy", "/contact"]);

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [hrefs, setHrefs] = useState<{ en: string; ja: string } | null>(null);

  useEffect(() => {
    function resolve(targetLocale: Locale): string {
      // Article pages carry a real <link rel="alternate" hreflang="...">
      // only when that locale's translation actually exists (see
      // generateMetadata in the article pages) - reading it here means
      // this never links to a JA article that hasn't been translated yet.
      const altLink = document.querySelector<HTMLLinkElement>(
        `link[rel="alternate"][hreflang="${targetLocale}"]`
      );
      if (altLink) return new URL(altLink.href).pathname;

      const enPath = locale === "ja" ? pathname.replace(/^\/ja/, "") || "/" : pathname;
      if (STATIC_PAIRED_PATHS.has(enPath)) {
        return targetLocale === "ja" ? `/ja${enPath === "/" ? "" : enPath}` : enPath;
      }
      return targetLocale === "ja" ? "/ja" : "/";
    }

    setHrefs({ en: resolve("en"), ja: resolve("ja") });
  }, [pathname, locale]);

  if (!hrefs) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" aria-label={dictionary[locale].language.switch} />
        }
      >
        <Globe />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem render={<Link href={hrefs.ja} />}>
          日本語
          {locale === "ja" && <Check className="ml-auto size-3.5" />}
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href={hrefs.en} />}>
          English
          {locale === "en" && <Check className="ml-auto size-3.5" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
