---
description: Draft a new thematic collection (multi-work literary trail) spanning existing single-work guides, for owner review
---

Write a new collection at `content/collections/en/$ARGUMENTS.mdx` (and its JA counterpart), grouping 2-4 existing single-work guides into one themed route. See `src/lib/collections.ts` and `content-collections.ts` for the schema; `src/app/(en)/collections/[slug]/page.tsx` and `src/app/ja/collections/[slug]/page.tsx` for how it renders.

## 1. Select the works

Read every `content/articles/en/*.mdx` frontmatter block (`work`, `authors`, `destinations`, `homeBase`) and look for a real-world grouping that makes a plausible single trip or theme: same city (e.g. all-Tokyo works by one or several authors), a connected regional route (e.g. two cities on the same train line), or a single author's spread across one city. Reject pairings that are only thematically related but geographically disconnected (e.g. Kumamoto + Okinawa) - a collection should read as an actual route, not just a tag cluster. Propose the grouping and a working title to the owner before drafting; don't pick alone.

## 2. Keyword pass (before locking the title/headings)

Priority order, per the owner: (1) keyword research reflected in headings, (2) meta description optimization. Do this after picking the works (step 1) but before finalizing the frontmatter (step 3) - it feeds directly into `title`/`description` and each Stop heading.

1. Run 1-2 quick web searches for how people actually phrase this kind of trip ("[place name] guide", "[city] day trip from Tokyo", "[author] [work] real locations") to find natural search phrasing rather than guessing.
2. Title (H1) and each Stop heading (H2) should include the place name + city/prefecture, plus a genre-signaling term ("literary guide," "day trip," "walking trail") where it fits naturally - matching the pattern the site's single-work articles already use ("Following {Author}'s {Work} to {Place}: A Literary Travel Guide"). Don't let a heading be purely evocative with no searchable term in it.
3. `description` frontmatter doubles as the meta description and OpenGraph description. Keep it to ~150-160 characters and front-load the strongest keyword phrase (place names, "literary guide") within the first ~120 characters, since Google can truncate past that - prioritize search relevance over narrative flourish here specifically, even though the body prose stays evocative.

## 3. Frontmatter

```yaml
title: "..."
description: "..."
works: ["Work A", "Work B", "Work C"]      # must exactly match each source article's `work` field, byte-identical
authors: ["Author A", "Author B"]           # exact match to source articles' `authors` values - drives the auto-rendered AuthorCorner cards (step 6)
destinations: ["Region", "Prefecture", ...] # union of the region/prefecture-level destinations actually covered
homeBase: "City"                            # the collection's own logical base, not necessarily any one source article's homeBase
publishedAt: "YYYY-MM-DD"                   # today, independent of the source articles' dates
status: "draft"                             # always start here - see Review below
```

## 4. Body structure

```
{Intro paragraph - the shared theme/route, no heading}

## Stop 1: {Place} — {one-line hook tying it to its work}

<StopImage src="..." alt="..." credit="..." creditUrl="..." />

{1-3 sentences: the real place/event behind this stop, condensed from the
source article - don't re-derive facts, pull them from the article you
already researched and fact-checked}. Full details: [link text](/articles/{source-slug}).

<MapLink q="Place name, city, prefecture, Japan" />

## Stop 2: ...
{repeat}

## Practical travel notes

- **Order and pacing**: how the stops connect (train line, transit time between them) - verify any specific duration/route claim via web search, don't guess
- **Best time to visit**
- **Base yourself in**

<MapRouteLink />

<AffiliateDisclosureNote />
```

**Paragraph length**: write in short paragraphs, not dense blocks - 2-3 sentences per paragraph is the target, and split a paragraph the moment it starts covering a second idea (e.g. the historical/textual fact behind a stop, then what's physically there today, are two paragraphs, not one). This applies to the intro paragraph and every stop's paragraph, in both the EN and JA files. This is a collection-specific readability rule, separate from whatever paragraph-length convention applies to single-work articles - the two are allowed to diverge, so don't cross-reference one from the other.

Each stop needs exactly one `<MapLink q="..." />` and, if a suitable photo exists (step 4), one `<StopImage />`. `<MapRouteLink />` takes no props and always goes once, immediately before the `## Practical travel notes` heading - `page.tsx` extracts every `<MapLink q="...">` value from the raw content via regex (`extractMapStops` in `src/lib/collections.ts`) and binds it into that single combined Google Maps route link automatically. Never type a combined route/point list by hand - the per-stop `<MapLink>` tags are the only source of truth. In the rendered collection page `MapLink` itself renders nothing (bound to `() => null` in both page.tsx templates) - it exists purely as data for `MapRouteLink` to consume, not as a visible per-stop button. This is a deliberate, already-discussed choice (single consolidated route link, not per-stop buttons) - don't change it without checking first.

## 5. Sourcing a photo for each stop

One `<StopImage>` per stop, sourced from Wikimedia Commons only (never a stock-photo API, never AI-generated, never unlicensed) - see `src/components/StopImage.tsx`.

1. Search: `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=<place name>&srnamespace=6&format=json` (try the English name; if zero hits, try the Japanese name; if still zero, try a broader term for the neighborhood/area instead of the exact site).
2. Pick a specific, current, well-composed result - prefer a recent, clearly-labeled exterior/establishing shot over interiors, historical scans, or ambiguous crops.
3. Fetch its license and direct URL in one call: `https://commons.wikimedia.org/w/api.php?action=query&titles=File:<exact title>&prop=imageinfo&iiprop=url|extmetadata&format=json`. Only use it if `LicenseShortName` is CC0, CC BY, or CC BY-SA (any version) - skip anything else, including anything ambiguous.
4. Build the tag from that response:
   ```
   <StopImage src="{imageinfo.url}" alt="{plain description of what's shown}" credit="{extmetadata.Artist, HTML tags stripped}" creditUrl="https://commons.wikimedia.org/wiki/File:{title with spaces as underscores}" />
   ```
5. If no suitable photo exists for the exact site (small monuments/markers often don't have one), fall back to a general shot of the immediate neighborhood/street rather than skipping the image - but say so honestly in `alt` (e.g. "the shopping street in Sendagi," not the specific unphotographed monument). Don't caption a fallback photo as if it were the actual site.
6. Use `curl` + `node -e` (not WebFetch) to pull `imageinfo` - WebFetch summarizes through a small model and can mangle exact license strings/URLs, which matters here.

## 6. JA translation

Same rules as `translate-article.md` (tone pass, sentence-splitting, register any missing `WORK_NAMES_JA`/`nameJa` entries - unnecessary here if every work/author already has an individual JA guide, which is the common case), plus collection-specific ones:

- `works`, `authors`, `destinations`, `homeBase`: copy verbatim from the EN file, same reasoning as `work`/`authors` on single articles.
- `<StopImage>`: copy `src`/`credit`/`creditUrl` verbatim (same photo, same license record) - only translate `alt`.
- `<MapLink q="...">`: translate the query into Japanese, same as on single articles.
- `<MapRouteLink />`: copy as-is, no props either language.

## 7. What NOT to build per-collection

`AuthorCorner` (the "About the author" / "著者について" cards at the bottom) is already fully automatic - `page.tsx` loops over `frontmatter.authors` and pulls each one's bio from `src/lib/authorProfiles.ts`. Nothing to write unless a collection features an author with no individual guide yet, in which case add their profile there first (same as any new single-work article would need).

## 8. Content standards (every collection, every time)

- Facts (dates, titles, real-place connections) are free to state; wording must always be original, never lifted or lightly paraphrased from Wikipedia/publisher bios.
- No author photos.
- Quotes from a novel itself: short, clearly marked as quotes.
- For anything touching real biographical/historical claims (especially living authors or sensitive historical subject matter), verify via web search rather than training-data memory, and flag for owner sign-off before treating as final.

## 9. Review (owner approval, every time)

Same mechanics as `translate-article.md`: `status: "draft"` throughout drafting. To preview locally, temporarily set `status: "published"` in the file only (never commit this), restart `npm run dev` (both `dynamicParams = false` and `next.config.ts` image-domain changes need a fresh server start, not just a save), view at `http://localhost:3000/collections/<slug>` and `/ja/collections/<slug>`, then set the status back to `"draft"` immediately after. Repeat with `status: "needs_revision"` for any requested changes. Only flip to `"published"` and commit/push once the owner has explicitly approved - never push a draft "for review."
