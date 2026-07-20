export type BookInfo = {
  title: string;
  authors?: string[];
  description?: string;
  thumbnail?: string;
};

// Runs at build time (BookCard is an async Server Component rendered during
// SSG), not per-visitor - so no client-side latency and no way to exceed the
// free 10,000/day Google Books quota at this article count. Missing key or
// no match both resolve to null so the card just doesn't render, same
// graceful-degradation pattern as the affiliate links in affiliate.ts.
export async function fetchBookInfo(work: string, authors: string[]): Promise<BookInfo | null> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  if (!apiKey) return null;

  const query = encodeURIComponent(`intitle:${work} inauthor:${authors[0] ?? ""}`);
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1&key=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;

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
    return null;
  }
}
