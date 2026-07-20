import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";

const articles = defineCollection({
  name: "articles",
  directory: "content/articles",
  include: "*.mdx",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    work: z.string(),
    authors: z.array(z.string()),
    destinations: z.array(z.string()),
    publishedAt: z.string(),
    draft: z.boolean().optional(),
    content: z.string(),
  }),
});

export default defineConfig({
  content: [articles],
});
