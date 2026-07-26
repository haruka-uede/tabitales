import type { Locale } from "./articles";

export type { Locale };

export const dictionary = {
  en: {
    nav: { guides: "Guides", authors: "Authors", destinations: "Destinations", collections: "Collections" },
    menu: { open: "Open menu", title: "Menu" },
    language: { switch: "Switch language" },
    cookieNotice: {
      message: "This site uses cookies for analytics and affiliate link tracking. See our",
      privacyPolicy: "Privacy Policy",
      messageSuffix: "for details.",
      decline: "Decline",
      accept: "Accept",
    },
    footer: {
      contact: "Contact",
      disclosure: "Affiliate Disclosure",
      privacyPolicy: "Privacy Policy",
    },
  },
  ja: {
    nav: { guides: "作品", authors: "著者", destinations: "地域", collections: "特集" },
    menu: { open: "メニューを開く", title: "メニュー" },
    language: { switch: "言語を切り替える" },
    cookieNotice: {
      message: "本サイトはアクセス解析およびアフィリエイトリンクの計測にクッキーを使用しています。詳細は",
      privacyPolicy: "プライバシーポリシー",
      messageSuffix: "をご覧ください。",
      decline: "拒否する",
      accept: "同意する",
    },
    footer: {
      contact: "お問い合わせ",
      disclosure: "アフィリエイト開示",
      privacyPolicy: "プライバシーポリシー",
    },
  },
} satisfies Record<Locale, unknown>;

export function href(locale: Locale, path: string): string {
  return locale === "ja" ? `/ja${path}` : path;
}
