import { cacheLife, cacheTag } from "next/cache"

import type { PostTypeValue } from "@/lib/blog-config"
import { cacheTags } from "@/lib/cache-tags"
import { db } from "@/lib/db"

const published = { status: "PUBLISHED" } as const

const cardSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  type: true,
  lang: true,
  publishedAt: true,
} as const

// Süre (days) yalnızca güvenlik ağıdır; içerik değişince etiketler anında yeniler.

// Sayfalanmış liste: yazılar ve (sayfa sayısını hesaplamak için) toplam adet
export async function getPostsPage({
  page,
  pageSize,
  type,
}: {
  page: number
  pageSize: number
  type?: PostTypeValue
}) {
  "use cache"
  cacheLife("days")
  cacheTag(cacheTags.posts)

  const where = { ...published, ...(type ? { type } : {}) }
  const [posts, total] = await Promise.all([
    db.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: cardSelect,
    }),
    db.post.count({ where }),
  ])
  return { posts, total }
}

export type PostCard = Awaited<ReturnType<typeof getPostsPage>>["posts"][number]

export async function getPostBySlug(slug: string) {
  "use cache"
  cacheLife("days")
  cacheTag(cacheTags.post(slug))

  return db.post.findFirst({ where: { slug, ...published } })
}

// sitemap ve generateStaticParams için
export async function getSitemapData() {
  "use cache"
  cacheLife("days")
  cacheTag(cacheTags.posts)

  const posts = await db.post.findMany({
    where: published,
    select: { slug: true, type: true, updatedAt: true },
    orderBy: { publishedAt: "desc" },
  })
  return {
    posts,
    counts: {
      all: posts.length,
      YAZI: posts.filter((post) => post.type === "YAZI").length,
      CEVIRI: posts.filter((post) => post.type === "CEVIRI").length,
    },
  }
}
