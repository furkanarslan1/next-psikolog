import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { PostsListing } from "@/components/site/posts-listing"
import { POSTS_PER_PAGE, totalPages } from "@/lib/blog-config"
import {
  getCategoriesWithPosts,
  getCategoryBySlug,
  getPostsPage,
} from "@/lib/queries/posts"

const PLACEHOLDER_SLUG = "__yok__"

export async function generateStaticParams() {
  const categories = await getCategoriesWithPosts()
  return categories.length > 0
    ? categories.map((category) => ({ slug: category.slug }))
    : [{ slug: PLACEHOLDER_SLUG }]
}

export async function generateMetadata({
  params,
}: PageProps<"/kategori/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return {}

  const { total } = await getPostsPage({
    page: 1,
    pageSize: POSTS_PER_PAGE,
    categorySlug: slug,
  })
  return {
    title: `${category.name} yazıları`,
    description: `${category.name} kategorisindeki yazılar.`,
    alternates: { canonical: `/kategori/${category.slug}` },
    pagination:
      totalPages(total) > 1
        ? { next: `/kategori/${category.slug}/sayfa/2` }
        : undefined,
  }
}

export default async function CategoryPage({
  params,
}: PageProps<"/kategori/[slug]">) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const [{ posts, total }, categories] = await Promise.all([
    getPostsPage({ page: 1, pageSize: POSTS_PER_PAGE, categorySlug: slug }),
    getCategoriesWithPosts(),
  ])

  return (
    <PostsListing
      title={category.name}
      posts={posts}
      categories={categories}
      activeSlug={slug}
      base={`/kategori/${slug}`}
      page={1}
      pages={totalPages(total)}
    />
  )
}
