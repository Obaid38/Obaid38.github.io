import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { getLegacyStaticSlugs } from "@/lib/legacy-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.siteUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...getLegacyStaticSlugs().map((slug) => ({
      url: `${siteConfig.siteUrl}/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
