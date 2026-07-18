import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import SearchBox from "@/components/SearchBox";
import { getSearchIndex } from "@/lib/search";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://japanese-novel-journey.com"),
  title: {
    default: "Tabi Tales — Follow Japanese Novels to Their Real-World Settings",
    template: "%s | Tabi Tales",
  },
  description:
    "Literary travel guides that connect Japanese novels to the real places behind them, for readers planning a trip to Japan.",
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
        <header className="border-b border-neutral-200">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
            <Link href="/" className="font-semibold text-lg">
              Tabi Tales
            </Link>
            <nav className="text-sm flex gap-6 text-neutral-600 items-center">
              <Link href="/articles">Guides</Link>
              <Link href="/authors">Authors</Link>
              <Link href="/destinations">Destinations</Link>
              <SearchBox index={searchIndex} />
            </nav>
          </div>
        </header>
        <div className="flex-1">{children}</div>
        <footer className="border-t border-neutral-200 mt-16">
          <div className="max-w-4xl mx-auto px-6 py-8 text-sm text-neutral-500 flex justify-between">
            <span>© {new Date().getFullYear()} Tabi Tales</span>
            <span className="flex gap-6">
              <Link href="/contact">Contact</Link>
              <Link href="/disclosure">Affiliate Disclosure</Link>
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
