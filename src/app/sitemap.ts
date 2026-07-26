import type { MetadataRoute } from "next";
import { getAllArticles, getAllAuthors, getArticleBySlug, getArticlesByDestination } from "@/lib/articles";
import { getAllCollections, getCollectionBySlug } from "@/lib/collections";
import { JAPAN_MAP, REGION_NAMES, REGION_OF_PREFECTURE } from "@/lib/japanMap";
import { slugify } from "@/lib/slug";
import { SITE_URL } from "@/lib/site";

// JA routes that actually exist today - keep in sync with src/app/ja/**.
// /authors, /destinations, and region/prefecture pages are deferred for JA
// (see the bilingual expansion plan), so they're intentionally left off
// both this list and the EN routes' hreflang alternates below.
const JA_STATIC_ROUTES = ["", "/articles", "/collections", "/disclosure", "/privacy-policy", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/articles", "/authors", "/destinations", "/collections", "/disclosure", "/privacy-policy", "/contact"].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    alternates: {
      languages: {
        en: `${SITE_URL}${route}`,
        ...(JA_STATIC_ROUTES.includes(route) ? { ja: `${SITE_URL}/ja${route}` } : {}),
      },
    },
  }));

  const jaStaticRoutes = JA_STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}/ja${route}`,
    lastModified: new Date(),
    alternates: {
      languages: {
        en: `${SITE_URL}${route}`,
        ja: `${SITE_URL}/ja${route}`,
      },
    },
  }));

  const articleRoutes = getAllArticles().map((article) => {
    const hasJaVersion = !!getArticleBySlug(article.slug, "ja");
    return {
      url: `${SITE_URL}/articles/${article.slug}`,
      lastModified: article.frontmatter.publishedAt,
      alternates: {
        languages: {
          en: `${SITE_URL}/articles/${article.slug}`,
          ...(hasJaVersion ? { ja: `${SITE_URL}/ja/articles/${article.slug}` } : {}),
        },
      },
    };
  });

  const jaArticleRoutes = getAllArticles({ locale: "ja" }).map((article) => ({
    url: `${SITE_URL}/ja/articles/${article.slug}`,
    lastModified: article.frontmatter.publishedAt,
    alternates: {
      languages: {
        en: `${SITE_URL}/articles/${article.slug}`,
        ja: `${SITE_URL}/ja/articles/${article.slug}`,
      },
    },
  }));

  const collectionRoutes = getAllCollections().map((collection) => {
    const hasJaVersion = !!getCollectionBySlug(collection.slug, "ja");
    return {
      url: `${SITE_URL}/collections/${collection.slug}`,
      lastModified: collection.frontmatter.publishedAt,
      alternates: {
        languages: {
          en: `${SITE_URL}/collections/${collection.slug}`,
          ...(hasJaVersion ? { ja: `${SITE_URL}/ja/collections/${collection.slug}` } : {}),
        },
      },
    };
  });

  const jaCollectionRoutes = getAllCollections({ locale: "ja" }).map((collection) => ({
    url: `${SITE_URL}/ja/collections/${collection.slug}`,
    lastModified: collection.frontmatter.publishedAt,
    alternates: {
      languages: {
        en: `${SITE_URL}/collections/${collection.slug}`,
        ja: `${SITE_URL}/ja/collections/${collection.slug}`,
      },
    },
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
    ...jaStaticRoutes,
    ...articleRoutes,
    ...jaArticleRoutes,
    ...collectionRoutes,
    ...jaCollectionRoutes,
    ...authorRoutes,
    ...regionRoutes,
    ...prefectureRoutes,
  ];
}
