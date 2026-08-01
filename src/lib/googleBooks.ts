export type BookInfo = {
  title: string;
  authors?: string[];
  description?: string;
  thumbnail?: string;
};

// Only called from scripts/fetch-book-info.ts now, not from BookCard/BookCardJa
// directly - see that script's header comment for why fetching moved out of
// `next build` and into a pre-fetched, committed cache (src/lib/bookInfoCache.ts).
// Missing key or no match both resolve to null so the cache entry just stays
// unset, same graceful-degradation pattern as the affiliate links in affiliate.ts.
export async function fetchBookInfo(
  work: string,
  authors: string[],
  options?: { langRestrict?: string }
): Promise<BookInfo | null> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  if (!apiKey) return null;

  const query = encodeURIComponent(`intitle:${work} inauthor:${authors[0] ?? ""}`);
  const langParam = options?.langRestrict ? `&langRestrict=${options.langRestrict}` : "";
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1${langParam}&key=${apiKey}`;

  // Retries with backoff: a transient failure or rate-limit blip here just
  // means re-running the script, but it's still worth absorbing automatically
  // since this script fetches many works back-to-back in one run.
  const retryDelaysMs = [500, 1500];
  for (let attempt = 0; attempt <= retryDelaysMs.length; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Google Books API returned ${res.status}`);

      const data = await res.json();
      const info = data.items?.[0]?.volumeInfo;
      if (!info) return null;

      return {
        title: info.title,
        authors: info.authors,
        description: info.description,
        thumbnail: info.imageLinks?.thumbnail?.replace(/^http:/, "https:"),
      };
    } catch {
      if (attempt < retryDelaysMs.length) {
        await new Promise((resolve) => setTimeout(resolve, retryDelaysMs[attempt]));
        continue;
      }
      return null;
    }
  }
  return null;
}
