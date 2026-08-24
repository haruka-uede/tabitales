@AGENTS.md

## Editorial priority: atmosphere over fact-precision

What the site optimizes for is a reader feeling like they can experience the mood/scene of a novel's most striking moment by actually going there — not encyclopedic accuracy. When drafting or reviewing an article, a passage that makes a reader want to book the trip beats a passage that is merely precise and unexciting. Don't let exact bus-departure minutes, museum item counts, or similar checkable-but-inconsequential details slow down or flatten the prose — round them, or state them plainly and move back to the feeling.

This does **not** relax accuracy on claims that would actually mislead a reader or cause real harm if wrong: don't present a novel's fictional character as a real person's documented identity, don't misstate a work's copyright/legal status, and don't give logistics precise enough to strand someone (a bus that doesn't run, a museum that's closed) — those still need verification per `write-article.md` step 6. The distinction is "does getting this wrong deceive or strand the reader" (fix it) vs. "is this just not maximally precise" (favor the mood and move on).

## Article prose: short paragraphs, blog style

`content/articles/**/*.mdx` body text should read like a blog post, not a wall of text - keep paragraphs short (roughly 2-4 sentences), and break to a new paragraph whenever the topic shifts (a new fact, a new location detail, a transition into practical/logistical info). This is a standing style rule for both EN and JA article bodies, checked whenever drafting or editing one. Note this is stated independently of whatever paragraph-length guidance exists for `content/collections/` (see `.claude/commands/write-collection.md`) - the two content types may end up with different conventions over time, so don't merge or cross-reference them.

## New articles: create the JA translation in the same session

When a new article is added to `content/articles/en/`, don't leave the `content/articles/ja/` counterpart for a later session — run the `/translate-article` flow for it as part of the same piece of work, before considering the article done. JA translation is a required step of publishing an article, not an optional follow-up.
