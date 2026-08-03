import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";

const articles = defineCollection({
  name: "articles",
  directory: "content/articles",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    work: z.string(),
    authors: z.array(z.string()),
    destinations: z.array(z.string()),
    homeBase: z.string().optional(),
    publishedAt: z.string(),
    status: z.enum(["draft", "needs_revision", "published", "retired"]),
    // Eyecatch image: shown on ArticleCard and used as this article's
    // og:image/twitter:image, overriding the site-wide OG_IMAGE default.
    // Optional - falls back gracefully wherever unset (see src/lib/site.ts).
    image: z.string().url().optional(),
    content: z.string(),
  }),
  // Locale and slug come from where the file lives (content/articles/<locale>/<slug>.mdx),
  // not frontmatter, so a translated file can never desync from its own filename/directory.
  transform: (doc) => ({
    ...doc,
    locale: doc._meta.directory as "en" | "ja",
    slug: doc._meta.fileName.replace(/\.mdx$/, ""),
  }),
});

// Thematic guides spanning multiple works/authors (e.g. "Murakami's Tokyo",
// "A Literary Tour of Kyoto") - same shape as `articles` but `works` is plural
// since there's no single book the whole piece is about. See src/lib/collections.ts.
const collections = defineCollection({
  name: "collections",
  directory: "content/collections",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    works: z.array(z.string()),
    authors: z.array(z.string()),
    destinations: z.array(z.string()),
    homeBase: z.string().optional(),
    publishedAt: z.string(),
    status: z.enum(["draft", "needs_revision", "published", "retired"]),
    // Same eyecatch-image field as articles - see content-collections.ts's
    // articles schema comment.
    image: z.string().url().optional(),
    content: z.string(),
  }),
  transform: (doc) => ({
    ...doc,
    locale: doc._meta.directory as "en" | "ja",
    slug: doc._meta.fileName.replace(/\.mdx$/, ""),
  }),
});

export default defineConfig({
  content: [articles, collections],
});
