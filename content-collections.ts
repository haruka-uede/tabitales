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
    draft: z.boolean().optional(),
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

export default defineConfig({
  content: [articles],
});
