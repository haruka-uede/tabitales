import type { MetadataRoute } from "next";
import { getAllArticles, getAllAuthors, getArticlesByDestination } from "@/lib/articles";
import { JAPAN_MAP, REGION_NAMES, REGION_OF_PREFECTURE } from "@/lib/japanMap";
import { slugify } from "@/lib/slug";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/articles", "/authors", "/destinations", "/disclosure", "/privacy-policy", "/contact"].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));

  const articleRoutes = getAllArticles().map((article) => ({
    url: `${SITE_URL}/articles/${article.slug}`,
    lastModified: article.frontmatter.publishedAt,
  }));

  const authorRoutes = getAllAuthors().map((author) => ({
    url: `${SITE_URL}/authors/${author.slug}`,
    lastModified: new Date(),
  }));

  const regionRoutes = REGION_NAMES.filter(
    (name) => getArticlesByDestination(slugify(name)).length > 0
  ).map((name) => ({
    url: `${SITE_URL}/${slugify(name)}`,
    lastModified: new Date(),
  }));

  const prefectureRoutes = JAPAN_MAP.locations
    .filter((location) => getArticlesByDestination(location.id).length > 0)
    .map((location) => ({
      url: `${SITE_URL}/${slugify(REGION_OF_PREFECTURE[location.id])}/${location.id}`,
      lastModified: new Date(),
    }));

  return [
    ...staticRoutes,
    ...articleRoutes,
    ...authorRoutes,
    ...regionRoutes,
    ...prefectureRoutes,
  ];
}
