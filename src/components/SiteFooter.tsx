import Link from "next/link";
import CookiePreferencesLink from "@/components/CookiePreferencesLink";
import { dictionary, href, type Locale } from "@/lib/i18n";

export default function SiteFooter({ locale = "en" as Locale }: { locale?: Locale }) {
  const t = dictionary[locale].footer;

  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-4xl mx-auto px-6 py-8 text-sm text-muted-foreground flex justify-between">
        <span>© {new Date().getFullYear()} Tabi Tales</span>
        <span className="flex gap-6">
          <Link href={href(locale, "/about")}>{t.about}</Link>
          <Link href={href(locale, "/contact")}>{t.contact}</Link>
          <Link href={href(locale, "/disclosure")}>{t.disclosure}</Link>
          <Link href={href(locale, "/privacy-policy")}>{t.privacyPolicy}</Link>
          <CookiePreferencesLink locale={locale} />
        </span>
      </div>
    </footer>
  );
}
