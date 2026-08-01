---
description: Have three reader personas (a literature professor, a travel writer, and an enthusiast reader) review an article before publishing
---

Review `content/articles/en/$ARGUMENTS.mdx` (or the `ja` version if the user specifies Japanese) using all three Tabitales reviewer personas.

## Steps

1. Read the target article in full first, so you can sanity-check the three reports against the actual text afterward.
2. Launch all three reviewers **in parallel, in a single message** (they don't depend on each other):
   - `reviewer-professor` — literary/historical/translation accuracy
   - `reviewer-travel-writer` — practical realism and cliche detection
   - `reviewer-enthusiast` — accessibility and whether it's engaging to an ordinary reader
   Give each the same target file path and nothing else — don't summarize the article for them or hint at what you expect them to find.
3. Once all three return, compile one combined report:
   - Each persona's findings under their own heading, in their voice (don't flatten them into a neutral tone).
   - A short "where they agree" section if two or more flagged the same passage — that's a stronger signal than any one alone.
   - Your own one-line summary of what needs to change before this is ready to publish (or "ready as-is").
4. Don't edit the article yourself unless the user asks you to act on specific feedback afterward. This command is a review, not an edit pass.
