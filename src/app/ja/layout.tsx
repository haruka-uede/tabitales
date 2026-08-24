import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CookieNotice from "@/components/CookieNotice";
import Analytics from "@/components/Analytics";
import AdSense from "@/components/AdSense";
import ThemeProvider from "@/components/ThemeProvider";
import { OG_IMAGE, SITE_NAME, SITE_URL, jsonLdScript } from "@/lib/site";
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
  openGraph: {
    images: [OG_IMAGE],
  },
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
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationJsonLd) }}
          />
          <SiteHeader locale="ja" />
          <div className="flex-1">{children}</div>
          <SiteFooter locale="ja" />
          <CookieNotice locale="ja" />
          <Analytics />
          <AdSense />
        </ThemeProvider>
      </body>
    </html>
  );
}
