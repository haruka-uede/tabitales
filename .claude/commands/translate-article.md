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
   - `status: "draft"` — always start in draft status. Moves to `"needs_revision"` if the owner asks for changes after seeing the preview, to `"published"` once they approve it (see Review below), and could later move to `"retired"` if the owner wants to take a published article down without deleting the file.
   - Body: translate section-by-section, preserving MDX structure — same headings, same `<AffiliateDisclosureNote />` tag left in the same position (the JA article template maps it to the JA disclosure component automatically), same "Practical travel notes" bullet layout so `homeBase` stays easy to cross-check against the "Base yourself in" line.
3. **Tone pass, not just translation**: the EN articles are written to explain Japanese culture, history, and literature *to foreigners*. Translated literally, that reads as condescending or redundant to a native Japanese reader (e.g. explaining what the Battle of Okinawa was, or what the Akutagawa Prize is). Cut or reframe passages like that. Keep practical travel logistics (transit times, opening hours, addresses) accurate and intact — those don't need cultural reframing, just translation.
4. At the end of your response, list what you trimmed or reframed for tone, so the human reviewer can sanity-check those specific calls rather than re-reading the whole diff line by line.
5. Do not commit, push, or merge anything yourself. Leave the new file as an uncommitted change so it goes through review below first — see why in Review.

## Review (owner approval, every time)

Nothing gets pushed until the owner has approved it — review happens locally, before the file ever reaches GitHub or a Vercel preview. (Both article `[slug]/page.tsx` routes only statically generate and serve `status: "published"` articles — `dynamicParams = false` — so a draft won't render even on localhost without the temporary flip below.)

1. Temporarily set `status: "published"` in the local file only — never commit this — and start (or restart) `npm run dev` to view the rendered page at `http://localhost:3000/ja/articles/<slug>`. A restart is required, not just a file save: `dynamicParams = false` means Next.js computes the set of valid slugs once at server start, so a status flip made while the dev server is already running won't be picked up until it's restarted.
2. The owner isn't set up to run the dev server themselves, so share a screenshot of the rendered page rather than asking them to open localhost.
3. Immediately after the screenshot, set the file back to `status: "draft"` (or `"needs_revision"`) before doing anything else — the temporary flip should never sit in a committed or pushed state.
4. If the owner asks for changes: set `status: "needs_revision"`, make the edits, then repeat from step 1 for another look.
5. Once approved: set `status: "published"`, then commit and push. This is the only status that should ever leave the owner's laptop — never push a `"draft"` or `"needs_revision"` article "for review," since nothing renders it publicly anyway and it just adds noise to review later.
