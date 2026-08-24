---
description: Draft a new single-work literary travel guide article, for owner review
---

Write a new article at `content/articles/en/$ARGUMENTS.mdx` (and its JA counterpart, same session — see step 6). See `content-collections.ts` for the schema; `src/app/(en)/articles/[slug]/page.tsx` and `src/app/ja/articles/[slug]/page.tsx` for how it renders.

Filename/slug convention: `{author-surname}-{work-slug}-literary-guide.mdx` (e.g. `murakami-wild-sheep-chase-literary-guide.mdx`, `tanizaki-portrait-of-shunkin-literary-guide.mdx`) — match this pattern for `$ARGUMENTS` rather than inventing a new shape.

## 1. Pick the work and its stops

Confirm the work/author with the owner before drafting if there's any ambiguity (translation title variants, an author with several plausible candidate works).

**Stop selection — prioritize the experiential "here," not just biographical trivia.** For each candidate real-world location, ask: can a reader physically stand in this spot and recognize a specific scene, image, or feeling from the book — not just "the author was born near here" or "this city is mentioned once"? A location that lets someone stand where a described moment happened (a specific street, shrine, station, view) always beats a location connected only by broad regional or biographical association. If a stop's only connection to the work is trivia rather than a scene you could point to on the page, either find its more specific counterpart or drop the stop rather than pad the article with it.

## 2. Keyword pass (before locking the title/headings)

Same priority order as collections: (1) keyword research reflected in headings, (2) meta description optimization.

1. Run 1-2 quick web searches for how people actually phrase this ("[work] real locations," "[place name] guide," "[author] [work] setting") rather than guessing search phrasing.
2. Title (H1) matches the site's existing pattern: "Following {Author}'s {Work} to {Place}: A Literary Travel Guide" or "Retracing {Author}'s {Work} to {Place}: A Literary Travel Guide" — include the place name + city/prefecture. Each Stop heading (H2) should also carry a searchable place name, not just an evocative phrase.
3. `description` frontmatter doubles as the meta description and OpenGraph description — ~150-160 characters, strongest keyword phrase front-loaded in the first ~120 characters. Keep the body's prose evocative; keep this field's prose keyword-forward.

## 3. Frontmatter

```yaml
title: "..."
description: "..."
work: "..."
authors: ["..."]
destinations: ["Region", "Prefecture"]
homeBase: "City"
publishedAt: "YYYY-MM-DD"
status: "draft"
```

## 4. Body structure

```
{Intro paragraph - see "The intro" below, no heading}

## Stop 1: {Place} — {one-line hook tying it to a specific scene, not just the work in general}

<StopImage src="..." alt="..." credit="..." creditUrl="..." />

{1-3 short paragraphs: the real place/scene behind this stop - what happens
here in the book, and what's physically there today}

- **Getting there**: ...
- **Good to know**: ...

<MapLink q="Place name, city, prefecture, Japan" />

## Stop 2: ...
{repeat}

<MapRouteLink />

## Practical travel notes

- **Best time to visit**
- **Base yourself in**
- **Language**: ...
- **The book itself**: standard English translation + translator (EN only - see translate-article.md step 6 for why this drops in JA)

<AffiliateDisclosureNote />
```

**Paragraph length**: short paragraphs, blog style, not dense blocks (2-4 sentences, new paragraph on every topic shift) — see `CLAUDE.md`. This applies throughout, including the intro.

**Applies beyond the intro too** (see `CLAUDE.md` "Editorial priority: atmosphere over fact-precision"): don't let the "Getting there"/"Good to know" bullets or a wall of verifiable specifics (bus transfer times to the minute, item counts in a museum display) crowd out the feeling of a stop before the reader has any reason to care. Give the scene/emotional hook room to land first, then the logistics — and keep those logistics rounded/practical ("about two hours via X, check current times") rather than falsely precise, unless the precision is safety- or plan-critical (last bus of the day, a museum's actual closing day).

### The intro

The intro paragraph's job is to make the reader want to go, not to summarize the plot. Two standing rules:

1. **Lead with a feeling, not a synopsis.** Open by conveying what the reader should feel standing in this place — quiet, unease, nostalgia, awe, whatever the scene itself carries — before any biographical or publication detail (year, "is a novel by," genre classification). Those facts can still appear, just not as the opening move.
2. **Minimize flat "this is the setting" statements, in favor of a "you can feel this too, here" statement.** Don't lean on constructions like "This place is the setting of [Work]" or "[Work] is set here." Instead, name the specific sensation/scene from the book and put the reader in it directly. The pattern to reach for:

   > ノルウェイの森を読んだ夜の静けさを、あなたもここで体験できます。
   > ("You too can experience the quiet stillness you felt reading *Norwegian Wood*, here.")

   **This pattern is required in the English article, not optional** — at least once, ideally in the intro. Adapt the specific feeling/scene to the actual work rather than reusing this exact sentence; the shape to match is *{specific feeling or sensory detail from the book} + you can feel/experience it here*, not the literal wording.

## 5. Sourcing a photo for each stop

Same rules as `write-collection.md` step 5 — Wikimedia Commons only, CC0/CC BY/CC BY-SA license, `curl` + `node -e` (not WebFetch) to pull `imageinfo` so license strings/URLs aren't mangled by summarization.

## 6. Content standards (every article, every time)

- Facts (dates, titles, real-place connections) are free to state; wording must always be original, never lifted or lightly paraphrased from Wikipedia/publisher bios.
- No author photos.
- Quotes from the novel itself: short, clearly marked as quotes.
- Verify via web search rather than training-data memory, and flag for owner sign-off, when a claim would actually mislead or strand a reader if wrong: whether a novel's character is being presented as a real documented person (or vice versa), a work's copyright/legal status, a living author's biography, sensitive historical subject matter, or logistics precise enough that a reader would plan around them (last departure of the day, whether a site is currently open). Don't burn the same scrutiny on atmospheric or inconsequential specifics — see `CLAUDE.md` "Editorial priority: atmosphere over fact-precision".

## 7. JA translation — same session, not a follow-up

Run `/translate-article` for this slug as part of the same piece of work (see `CLAUDE.md` — JA is a required step of publishing, not optional). The emotional, feeling-first intro carries over naturally under translate-article.md's normal tone-pass rules; the exact English sentence pattern in "The intro" above is an EN-specific requirement, not something to force verbatim into the JA version if a more natural equivalent reads better in Japanese.

## 8. Review (owner approval, every time)

1. Run `/review-article` (three reader personas) on the EN draft before anything else.
2. Same preview/approval mechanics as `translate-article.md`: `status: "draft"` throughout, temporarily flip to `"published"` locally (restart `npm run dev`, both `dynamicParams = false` and any new image-domain need a fresh start) to preview at `http://localhost:3000/articles/<slug>`, then flip back to `"draft"` immediately after sharing a screenshot.
3. Repeat with `"needs_revision"` for requested changes.
4. Only commit/push once the owner has explicitly approved and status is `"published"` — never push a draft "for review."
