// One-off/on-demand fetch of per-article pageviews from Google Analytics (GA4
// Data API), summed per author, written to a committed JSON cache
// (src/data/author-popularity.json) - same pre-fetch-into-cache pattern as
// fetch-book-info.ts, so `next build` never calls out to GA4 and a stale
// credential or API hiccup here is just this script's output, not a broken
// production filter.
//
// Pageviews are summed across both locales' pages for an author's articles
// (an author's EN and JA guides count toward the same total) - this ranks
// authors by overall site attention, not per-language attention.
//
// Usage:
//   npm run fetch-author-popularity              # last 30 days
//   npm run fetch-author-popularity -- --days=90
//
// Requires (in .env.local):
//   GA4_PROPERTY_ID   - numeric GA4 property id (Admin > Property details)
//   GA4_CLIENT_EMAIL  - service account email, added as a Viewer on that property
//   GA4_PRIVATE_KEY   - that service account's private key (keep the \n escapes)
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { slugify } from "../src/lib/slug";

const ROOT = path.join(__dirname, "..");
const ARTICLES_DIR = path.join(ROOT, "content/articles");
const CACHE_PATH = path.join(ROOT, "src/data/author-popularity.json");

type Locale = "en" | "ja";
type ArticleRef = { locale: Locale; slug: string; authors: string[] };
type PopularityEntry = { slug: string; name: string; pageviews: number };
type Cache = { generatedAt: string | null; windowDays: number; authors: PopularityEntry[] };

function listArticles(): ArticleRef[] {
  const entries: ArticleRef[] = [];
  for (const locale of ["en", "ja"] as const) {
    const dir = path.join(ARTICLES_DIR, locale);
    if (!existsSync(dir)) continue;
    for (const file of readdirSync(dir)) {
      if (!file.endsWith(".mdx")) continue;
      const { data } = matter(readFileSync(path.join(dir, file), "utf-8"));
      entries.push({ locale, slug: file.replace(/\.mdx$/, ""), authors: data.authors });
    }
  }
  return entries;
}

function pagePathFor(locale: Locale, slug: string): string {
  return locale === "ja" ? `/ja/articles/${slug}` : `/articles/${slug}`;
}

async function main() {
  const propertyId = process.env.GA4_PROPERTY_ID;
  const clientEmail = process.env.GA4_CLIENT_EMAIL;
  const privateKey = process.env.GA4_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!propertyId || !clientEmail || !privateKey) {
    console.error(
      "GA4_PROPERTY_ID, GA4_CLIENT_EMAIL and GA4_PRIVATE_KEY must be set (run via: npm run fetch-author-popularity)"
    );
    process.exit(1);
  }

  const daysArg = process.argv.find((a) => a.startsWith("--days="));
  const windowDays = daysArg ? Number(daysArg.split("=")[1]) : 30;

  const client = new BetaAnalyticsDataClient({
    credentials: { client_email: clientEmail, private_key: privateKey },
  });

  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: `${windowDays}daysAgo`, endDate: "today" }],
    dimensions: [{ name: "pagePath" }],
    metrics: [{ name: "screenPageViews" }],
    dimensionFilter: {
      orGroup: {
        expressions: [
          { filter: { fieldName: "pagePath", stringFilter: { matchType: "BEGINS_WITH", value: "/articles/" } } },
          {
            filter: { fieldName: "pagePath", stringFilter: { matchType: "BEGINS_WITH", value: "/ja/articles/" } },
          },
        ],
      },
    },
    limit: 100000,
  });

  const viewsByPath = new Map<string, number>();
  for (const row of response.rows ?? []) {
    const pagePath = row.dimensionValues?.[0]?.value;
    const views = Number(row.metricValues?.[0]?.value ?? 0);
    if (pagePath) viewsByPath.set(pagePath, views);
  }

  const totals = new Map<string, { name: string; pageviews: number }>();
  for (const article of listArticles()) {
    const views = viewsByPath.get(pagePathFor(article.locale, article.slug)) ?? 0;
    for (const name of article.authors) {
      const slug = slugify(name);
      const existing = totals.get(slug);
      totals.set(slug, { name, pageviews: (existing?.pageviews ?? 0) + views });
    }
  }

  const authors = [...totals.entries()]
    .map(([slug, { name, pageviews }]) => ({ slug, name, pageviews }))
    .sort((a, b) => b.pageviews - a.pageviews);

  const cache: Cache = { generatedAt: new Date().toISOString(), windowDays, authors };
  writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2) + "\n");

  console.log(`Wrote ${authors.length} authors to ${path.relative(ROOT, CACHE_PATH)} (last ${windowDays} days)`);
  for (const a of authors.slice(0, 5)) {
    console.log(`  ${String(a.pageviews).padStart(6)}  ${a.name}`);
  }
}

main();
