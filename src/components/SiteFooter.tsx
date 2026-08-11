import FooterMoreMenu from "@/components/FooterMoreMenu";
import type { Locale } from "@/lib/i18n";

export default function SiteFooter({ locale = "en" as Locale }: { locale?: Locale }) {
  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-4xl mx-auto px-6 py-8 text-sm text-muted-foreground flex items-center justify-between">
        <span>© {new Date().getFullYear()} Tabi Tales</span>
        <FooterMoreMenu locale={locale} />
      </div>
    </footer>
  );
}
