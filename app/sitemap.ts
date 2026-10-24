import type { MetadataRoute } from "next"

import { pagePath, totalPages } from "@/lib/blog-config"
import { getSitemapData } from "@/lib/queries/posts"
import { absoluteUrl } from "@/lib/site"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { posts, categories } = await getSitemapData()

  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/hakkimda"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/yazilar"), changeFrequency: "weekly", priority: 0.9 },
    ...Array.from({ length: totalPages(posts.length) - 1 }, (_, index) => ({
      url: absoluteUrl(pagePath("/yazilar", index + 2)),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    { url: absoluteUrl("/iletisim"), changeFrequency: "yearly", priority: 0.5 },
    ...categories.map((category) => ({
      url: absoluteUrl(`/kategori/${category.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ]
}
