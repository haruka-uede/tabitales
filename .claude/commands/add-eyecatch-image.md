---
description: Place an eyecatch image the owner has dropped in image-inbox/ into the right article or collection
---

The owner saves new eyecatch images into `image-inbox/` under whatever filename their design tool gives them (not renamed, not sorted) - see [[project-tabitales]] and the `image` field comment in `content-collections.ts`. When they say an image in that folder is for a given article or collection, do the following - don't ask them to rename or move it themselves.

## 1. Identify the file and the target

Confirm which file in `image-inbox/` they mean (list the folder if more than one candidate) and which article/collection slug it's for. If ambiguous, ask - don't guess between two recent uploads.

## 2. Rename and move

- Destination: `public/images/articles/{slug}.{ext}` for an article, `public/images/collections/{slug}.{ext}` for a collection - `{slug}` matches the `.mdx` filename exactly, `{ext}` is whatever the source file already is (`.jpg`, `.png`, etc.), not forced to one format.
- Move (don't copy) the file out of `image-inbox/` - nothing should accumulate there once processed.

## 3. Update frontmatter

Add `image: "/images/articles/{slug}.{ext}"` (or `/images/collections/...`) to the `.mdx` frontmatter. The image is the same file/photo for both locales (same as `<StopImage>`'s `src`/`credit` per `translate-article.md`), so add the identical `image:` line to **both** the EN and JA files for that slug if a JA version exists - don't leave one locale without it.

## 4. Build and preview

Same mechanics as reviewing any other content change: `npm run build`, then a local screenshot (the owner doesn't run the dev server themselves) of at least the card view (e.g. that author's page or `/articles`) showing the new image with its rounded top corners intact, before saying it's done.

## 5. Confirm before commit/push

Report what was renamed/moved and show the screenshot. Commit only after the owner is happy with it, and push only when separately asked - same as every other change on this site.
