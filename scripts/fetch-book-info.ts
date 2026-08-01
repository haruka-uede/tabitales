// One-off/on-demand data fetch, run manually (or by Claude when authoring an
// article) rather than during `next build`. The old design called the Google
// Books API live inside every production build, with 7 build workers firing
// requests concurrently - a rate-limit blip on any single request silently
// baked the English fallback into a JA page's static HTML, with no build
// warning and no way to notice short of eyeballing every page. Pre-fetching
// once into a committed JSON cache (src/data/book-info.json) means `next
// build` never touches the network for this, and a bad fetch here is just a
// line in this script's console output, not a silent prod regression.
//
// Usage:
//   npm run fetch-book-info            # only fetches entries missing from the cache
//   npm run fetch-book-info -- --all   # re-fetches every entry, overwriting the cache
//   npm run fetch-book-info -- Sanshiro "No Longer Human"   # only these works (always re-fetches)
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { fetchBookInfo, type BookInfo } from "../src/lib/googleBooks";
import { getAuthorNameJa } from "../src/lib/authorProfiles";
import { getWorkNameJa } from "../src/lib/workProfiles";
import { slugify } from "../src/lib/slug";

const ROOT = path.join(__dirname, "..");
const ARTICLES_DIR = path.join(ROOT, "content/articles");
const COLLECTIONS_DIR = path.join(ROOT, "content/collections");
const CACHE_PATH = path.join(ROOT, "src/data/book-info.json");

type Locale = "en" | "ja";
type Cache = Record<string, BookInfo>;
type WorkRef = { locale: Locale; work: string; authors: string[] };

function loadCache(): Cache {
  if (!existsSync(CACHE_PATH)) return {};
  return JSON.parse(readFileSync(CACHE_PATH, "utf-8"));
}

// Articles have one `work` each; collections have a `works` array covering
// several books by the same `authors` list - both end up as one WorkRef per
// (locale, work) pair either way.
function listArticleWorks(): WorkRef[] {
  const entries: WorkRef[] = [];
  for (const locale of ["en", "ja"] as const) {
    const dir = path.join(ARTICLES_DIR, locale);
    if (!existsSync(dir)) continue;
    for (const file of readdirSync(dir)) {
      if (!file.endsWith(".mdx")) continue;
      const { data } = matter(readFileSync(path.join(dir, file), "utf-8"));
      entries.push({ locale, work: data.work, authors: data.authors });
    }
  }
  return entries;
}

function listCollectionWorks(): WorkRef[] {
  const entries: WorkRef[] = [];
  for (const locale of ["en", "ja"] as const) {
    const dir = path.join(COLLECTIONS_DIR, locale);
    if (!existsSync(dir)) continue;
    for (const file of readdirSync(dir)) {
      if (!file.endsWith(".mdx")) continue;
      const { data } = matter(readFileSync(path.join(dir, file), "utf-8"));
      for (const work of data.works as string[]) {
        entries.push({ locale, work, authors: data.authors });
      }
    }
  }
  return entries;
}

async function resolve(locale: Locale, work: string, authors: string[]): Promise<BookInfo | null> {
  if (locale === "ja") {
    const workJa = getWorkNameJa(work);
    const authorsJa = authors.map((name) => getAuthorNameJa(slugify(name), name));
    return (
      (await fetchBookInfo(workJa, authorsJa, { langRestrict: "ja" })) ??
      (await fetchBookInfo(work, authors))
    );
  }
  return fetchBookInfo(work, authors);
}

async function main() {
  if (!process.env.GOOGLE_BOOKS_API_KEY) {
    console.error("GOOGLE_BOOKS_API_KEY is not set (run via: npm run fetch-book-info)");
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const refetchAll = args.includes("--all");
  const onlyWorks = args.filter((a) => a !== "--all");

  const cache = loadCache();
  const allWorks = [...listArticleWorks(), ...listCollectionWorks()];
  const seen = new Set<string>();

  for (const { locale, work, authors } of allWorks) {
    const key = `${locale}:${work}`;
    if (seen.has(key)) continue;
    seen.add(key);

    if (onlyWorks.length > 0 && !onlyWorks.includes(work)) continue;
    if (!refetchAll && onlyWorks.length === 0 && cache[key]) {
      console.log(`skip (cached): ${key}`);
      continue;
    }

    process.stdout.write(`fetching ${key} ... `);
    const info = await resolve(locale, work, authors);
    if (!info) {
      console.log("no result, leaving uncached");
      continue;
    }
    cache[key] = info;
    console.log(info.title);
  }

  writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2) + "\n");
  console.log(`\nWrote ${Object.keys(cache).length} entries to ${path.relative(ROOT, CACHE_PATH)}`);
}

main();
