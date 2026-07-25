---
description: Draft a Japanese translation of an English literary guide article for owner review
---

Translate `content/articles/en/$ARGUMENTS.mdx` into `content/articles/ja/$ARGUMENTS.mdx`.

## Steps

1. Read `content/articles/en/$ARGUMENTS.mdx` in full (frontmatter + body).
2. Write `content/articles/ja/$ARGUMENTS.mdx`:
   - `title` and `description`: translate and reframe for a Japanese audience, not literally.
   - `work`, `authors`, `destinations`, `homeBase`: copy **verbatim, byte-identical** to the EN file. Do not translate these. (`slugify()` strips non-ASCII characters, so a translated author name would silently break author grouping and Booking.com city-link lookups — see `src/lib/slug.ts` and `src/lib/affiliate.ts`.)
   - `publishedAt`: set to today's date, independent of the EN file's date.
   - `draft: true` — always start as a draft. It only flips to `false` after the owner approves the rendered page (see Review below).
   - Body: translate section-by-section, preserving MDX structure — same headings, same `<AffiliateDisclosureNote />` tag left in the same position (the JA article template maps it to the JA disclosure component automatically), same "Practical travel notes" bullet layout so `homeBase` stays easy to cross-check against the "Base yourself in" line.
3. **Tone pass, not just translation**: the EN articles are written to explain Japanese culture, history, and literature *to foreigners*. Translated literally, that reads as condescending or redundant to a native Japanese reader (e.g. explaining what the Battle of Okinawa was, or what the Akutagawa Prize is). Cut or reframe passages like that. Keep practical travel logistics (transit times, opening hours, addresses) accurate and intact — those don't need cultural reframing, just translation.
4. At the end of your response, list what you trimmed or reframed for tone, so the human reviewer can sanity-check those specific calls rather than re-reading the whole diff line by line.
5. Do not merge anything yourself. Leave the new file as an uncommitted change (or push it to a branch if asked) so it goes through review below.

## Review (owner approval, every time)

This project's repo is on GitHub with Vercel's Git integration, so a PR gets an automatic preview URL. The owner reviews the **rendered page** at that URL (not the raw MDX diff) since that's the friendlier surface for a non-technical, prose-focused review. Once they approve, flip `draft: false` and merge — never publish a JA article without this step.
