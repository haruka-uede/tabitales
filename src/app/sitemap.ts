import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";

const BASE_URL = "https://japanese-novel-journey.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/articles", "/authors", "/destinations", "/disclosure", "/contact"].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));

  const articleRoutes = getAllArticles().map((article) => ({
    url: `${BASE_URL}/articles/${article.slug}`,
    lastModified: article.frontmatter.publishedAt,
  }));

  return [...staticRoutes, ...articleRoutes];
}
