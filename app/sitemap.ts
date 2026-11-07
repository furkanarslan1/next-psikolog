import type { MetadataRoute } from "next"

import { listBase, pagePath, postTypes, totalPages, type PostTypeSlug } from "@/lib/blog-config"
import { getSitemapData } from "@/lib/queries/posts"
import { absoluteUrl } from "@/lib/site"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { posts, counts } = await getSitemapData()
  const types = Object.keys(postTypes) as PostTypeSlug[]

  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/hakkimda"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/yazilar"), changeFrequency: "weekly", priority: 0.9 },
    ...Array.from({ length: totalPages(counts.all) - 1 }, (_, index) => ({
      url: absoluteUrl(pagePath("/yazilar", index + 2)),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...types.flatMap((type) => [
      {
        url: absoluteUrl(listBase(type)),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      },
      ...Array.from({ length: totalPages(counts[postTypes[type].value]) - 1 }, (_, index) => ({
        url: absoluteUrl(pagePath(listBase(type), index + 2)),
        changeFrequency: "weekly" as const,
        priority: 0.4,
      })),
    ]),
    { url: absoluteUrl("/iletisim"), changeFrequency: "yearly", priority: 0.5 },
    ...["/kvkk", "/gizlilik", "/yasal-uyari"].map((path) => ({
      url: absoluteUrl(path),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/yazilar/${post.slug}`),
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ]
}
