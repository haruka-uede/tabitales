import type { NextConfig } from "next";
import { withContentCollections } from "@content-collections/next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Google Books cover images (candidate data source for auto-fetched book cards)
      { protocol: "https", hostname: "books.google.com" },
      { protocol: "https", hostname: "books.googleusercontent.com" },
      // Amazon product images (candidate source once Associates/PA-API is approved)
      { protocol: "https", hostname: "m.media-amazon.com" },
    ],
  },
};

export default withContentCollections(nextConfig);
