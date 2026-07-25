import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CookieNotice from "@/components/CookieNotice";
import Analytics from "@/components/Analytics";
import { SITE_NAME, SITE_URL, jsonLdScript } from "@/lib/site";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Tabi Tales — 日本の小説とゆかりの地をめぐる旅",
    template: "%s | Tabi Tales",
  },
  description:
    "日本の小説とその舞台となった実在の場所を結びつける文学旅行ガイド。日本旅行を計画している読者のために。",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
};

export default function JaRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationJsonLd) }}
        />
        <SiteHeader locale="ja" />
        <div className="flex-1">{children}</div>
        <SiteFooter locale="ja" />
        <CookieNotice locale="ja" />
        <Analytics />
      </body>
    </html>
  );
}
