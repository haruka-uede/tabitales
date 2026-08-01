import cache from "@/data/book-info.json";
import type { BookInfo } from "./googleBooks";
import type { Locale } from "./articles";

// Populated by `npm run fetch-book-info` (scripts/fetch-book-info.ts), not at
// request/build time - see that script's header comment for why. A missing
// entry (new article not yet fetched) just means BookCard renders nothing,
// same graceful-degradation pattern as the rest of this codebase.
export function getCachedBookInfo(locale: Locale, work: string): BookInfo | null {
  return (cache as Record<string, BookInfo>)[`${locale}:${work}`] ?? null;
}
