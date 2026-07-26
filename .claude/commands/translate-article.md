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
   - Body: translate section-by-section, preserving MDX structure — same headings, same "Practical travel notes" bullet layout so `homeBase` stays easy to cross-check against the "Base yourself in" line, and the same tag names left in the same position for any component the locale template remaps automatically:
     - `<AffiliateDisclosureNote />` (maps to the JA disclosure component).
     - `<MapLink q="..." />` (maps to the JA-labeled Google Maps button) — appears once at the end of each single-place stop, or inline at the end of each bullet when a stop lists several distinct addressed places (e.g. the Mitaka stop in the No Longer Human guide). Translate the `q` value into Japanese (place name + city/ward) rather than copying the EN query verbatim — a Japanese-language query matches more reliably on Google Maps for domestic place names.
3. **Tone pass, not just translation**: some EN passages exist only because the reader is assumed to be a foreign visitor navigating Japan as an outsider — English signage availability, translation apps, "off the beaten path from the usual foreign-tourist circuit," or explaining broad, common-knowledge civics/history/geography (what the Battle of Okinawa was, what the Akutagawa Prize is, that Tokyo is Japan's capital). Cut or reframe only those. Do **not** cut specific, checkable facts about the author or work — birth/death dates, family background, place-name etymology, domestic-vs-international reputation — just because they might read as "obvious"; a Japanese reader not already knowing a given fact isn't the same as the passage being written for foreigners, and cutting it loses real content. When unsure which category a passage falls into, keep and translate it rather than cut it — over-inclusion is a easy fix in review, lost content isn't. Keep practical travel logistics (transit times, opening hours, addresses) accurate and intact regardless — those don't need cultural reframing, just translation.
4. At the end of your response, list what you trimmed or reframed for tone, so the human reviewer can sanity-check those specific calls rather than re-reading the whole diff line by line.
5. Do not commit, push, or merge anything yourself. Leave the new file as an uncommitted change so it goes through review below first — see why in Review.

## Review (owner approval, every time)

Nothing gets pushed until the owner has approved it — review happens locally, before the file ever reaches GitHub or a Vercel preview. (Both article `[slug]/page.tsx` routes only statically generate and serve `status: "published"` articles — `dynamicParams = false` — so a draft won't render even on localhost without the temporary flip below.)

1. Temporarily set `status: "published"` in the local file only — never commit this — and start (or restart) `npm run dev` to view the rendered page at `http://localhost:3000/ja/articles/<slug>`. A restart is required, not just a file save: `dynamicParams = false` means Next.js computes the set of valid slugs once at server start, so a status flip made while the dev server is already running won't be picked up until it's restarted.
2. The owner isn't set up to run the dev server themselves, so share a screenshot of the rendered page rather than asking them to open localhost.
3. Immediately after the screenshot, set the file back to `status: "draft"` (or `"needs_revision"`) before doing anything else — the temporary flip should never sit in a committed or pushed state.
4. If the owner asks for changes: set `status: "needs_revision"`, make the edits, then repeat from step 1 for another look.
5. Once approved: set `status: "published"`, then commit and push. This is the only status that should ever leave the owner's laptop — never push a `"draft"` or `"needs_revision"` article "for review," since nothing renders it publicly anyway and it just adds noise to review later.
