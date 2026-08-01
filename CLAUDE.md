@AGENTS.md

## Article prose: short paragraphs, blog style

`content/articles/**/*.mdx` body text should read like a blog post, not a wall of text - keep paragraphs short (roughly 2-4 sentences), and break to a new paragraph whenever the topic shifts (a new fact, a new location detail, a transition into practical/logistical info). This is a standing style rule for both EN and JA article bodies, checked whenever drafting or editing one. Note this is stated independently of whatever paragraph-length guidance exists for `content/collections/` (see `.claude/commands/write-collection.md`) - the two content types may end up with different conventions over time, so don't merge or cross-reference them.

## New articles: create the JA translation in the same session

When a new article is added to `content/articles/en/`, don't leave the `content/articles/ja/` counterpart for a later session — run the `/translate-article` flow for it as part of the same piece of work, before considering the article done. JA translation is a required step of publishing an article, not an optional follow-up.
