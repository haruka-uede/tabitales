import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";

// Either a local /public path (e.g. "/images/articles/some-slug.jpg") or a
// full external URL (e.g. a licensed Wikimedia Commons photo) - see the
// `image` field comment below for how each is stored/sourced.
const imageField = z
  .string()
  .refine((v) => v.startsWith("/") || /^https?:\/\//.test(v), {
    message: "image must be a local /public path or an http(s) URL",
  })
  .optional();

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
    status: z.enum(["draft", "needs_revision", "published", "retired", "Abolition"]),
    // Eyecatch image: shown on ArticleCard and used as this article's
    // og:image/twitter:image, overriding the site-wide OG_IMAGE default.
    // Optional - falls back gracefully wherever unset (see src/lib/site.ts).
    // Custom-designed graphics go in public/images/articles/{slug}.{ext} and
    // are referenced here as "/images/articles/{slug}.{ext}"; a real-world
    // photo instead follows the same Wikimedia Commons sourcing/licensing
    // rules as StopImage (see write-article.md step 5) and is referenced by
    // its full commons URL - never downloaded into the repo.
    image: imageField,
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
    status: z.enum(["draft", "needs_revision", "published", "retired", "Abolition"]),
    // Same eyecatch-image field as articles (public/images/collections/{slug}.{ext}
    // for a custom graphic, or a full Commons URL for a real photo) - see the
    // articles schema comment above.
    image: imageField,
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
