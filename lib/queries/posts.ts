import { cacheLife, cacheTag } from "next/cache"

import { cacheTags } from "@/lib/cache-tags"
import { db } from "@/lib/db"

const published = { status: "PUBLISHED" } as const

const cardSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  coverImageUrl: true,
  coverImageAlt: true,
  publishedAt: true,
  category: { select: { name: true, slug: true } },
} as const

// Süre (days) yalnızca güvenlik ağıdır; içerik değişince etiketler anında yeniler.

export async function getPublishedPosts(
  filter: { categorySlug?: string; tagSlug?: string } = {}
) {
  "use cache"
  cacheLife("days")
  if (filter.categorySlug) cacheTag(cacheTags.category(filter.categorySlug))
  else if (filter.tagSlug) cacheTag(cacheTags.tag(filter.tagSlug))
  else cacheTag(cacheTags.posts)

  return db.post.findMany({
    where: {
      ...published,
      ...(filter.categorySlug ? { category: { slug: filter.categorySlug } } : {}),
      ...(filter.tagSlug ? { tags: { some: { slug: filter.tagSlug } } } : {}),
    },
    orderBy: { publishedAt: "desc" },
    select: cardSelect,
  })
}

export type PostCard = Awaited<ReturnType<typeof getPublishedPosts>>[number]

export async function getPostBySlug(slug: string) {
  "use cache"
  cacheLife("days")
  cacheTag(cacheTags.post(slug))

  const post = await db.post.findFirst({
    where: { slug, ...published },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      tags: { select: { name: true, slug: true }, orderBy: { name: "asc" } },
    },
  })
  // kategori adı değişirse yazı sayfası da yenilensin
  if (post?.category) cacheTag(cacheTags.category(post.category.slug))
  return post
}

export async function getRelatedPosts(
  postId: string,
  category: { id: string; slug: string } | null
) {
  "use cache"
  cacheLife("days")
  if (!category) return []
  cacheTag(cacheTags.category(category.slug))

  return db.post.findMany({
    where: { ...published, categoryId: category.id, id: { not: postId } },
    orderBy: { publishedAt: "desc" },
    take: 3,
    select: cardSelect,
  })
}

export async function getCategoriesWithPosts() {
  "use cache"
  cacheLife("days")
  cacheTag(cacheTags.categories)

  return db.category.findMany({
    where: { posts: { some: published } },
    orderBy: { name: "asc" },
    select: { name: true, slug: true },
  })
}

export async function getCategoryBySlug(slug: string) {
  "use cache"
  cacheLife("days")
  cacheTag(cacheTags.category(slug))

  return db.category.findFirst({
    where: { slug, posts: { some: published } },
    select: { name: true, slug: true },
  })
}

export async function getTagBySlug(slug: string) {
  "use cache"
  cacheLife("days")
  cacheTag(cacheTags.tag(slug))

  return db.tag.findFirst({
    where: { slug, posts: { some: published } },
    select: { name: true, slug: true },
  })
}

// sitemap ve generateStaticParams için
export async function getSitemapData() {
  "use cache"
  cacheLife("days")
  cacheTag(cacheTags.posts, cacheTags.categories)

  const [posts, categories, tags] = await Promise.all([
    db.post.findMany({
      where: published,
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: "desc" },
    }),
    db.category.findMany({
      where: { posts: { some: published } },
      select: { slug: true },
    }),
    db.tag.findMany({
      where: { posts: { some: published } },
      select: { slug: true },
    }),
  ])
  return { posts, categories, tags }
}
