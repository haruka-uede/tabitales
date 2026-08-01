import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CookieNotice from "@/components/CookieNotice";
import Analytics from "@/components/Analytics";
import AdSense from "@/components/AdSense";
import { getSearchIndex } from "@/lib/search";
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
    default: "Tabi Tales — Follow Japanese Novels to Their Real-World Settings",
    template: "%s | Tabi Tales",
  },
  description:
    "Literary travel guides that connect Japanese novels to the real places behind them, for readers planning a trip to Japan.",
  verification: {
    google: "XB52W6aEfK4Itembl4aLLhIs9QyuU6nXeYSpZqyEuHc",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const searchIndex = getSearchIndex();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationJsonLd) }}
        />
        <SiteHeader searchIndex={searchIndex} />
        <div className="flex-1">{children}</div>
        <SiteFooter />
        <CookieNotice />
        <Analytics />
        <AdSense />
      </body>
    </html>
  );
}
