import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { PostsListing } from "@/components/site/posts-listing"
import {
  POSTS_PER_PAGE,
  pagePath,
  parsePageNumber,
  totalPages,
} from "@/lib/blog-config"
import {
  getCategoriesWithPosts,
  getCategoryBySlug,
  getPostsPage,
} from "@/lib/queries/posts"

const PLACEHOLDER_SLUG = "__yok__"

// Her kategori için 2. sayfa önceden üretilir (yoksa 404); sonrakiler ilk ziyarette üretilip önbelleğe alınır
export async function generateStaticParams() {
  const categories = await getCategoriesWithPosts()
  return categories.length > 0
    ? categories.map((category) => ({ slug: category.slug, page: "2" }))
    : [{ slug: PLACEHOLDER_SLUG, page: "2" }]
}

export async function generateMetadata({
  params,
}: PageProps<"/kategori/[slug]/sayfa/[page]">): Promise<Metadata> {
  const { slug, page: raw } = await params
  const page = parsePageNumber(raw)
  const category = await getCategoryBySlug(slug)
  if (!page || !category) return {}

  const { total } = await getPostsPage({
    page,
    pageSize: POSTS_PER_PAGE,
    categorySlug: slug,
  })
  const pages = totalPages(total)
  if (page > pages) return {}

  const base = `/kategori/${slug}`
  return {
    title: `${category.name} yazıları - Sayfa ${page}`,
    description: `${category.name} kategorisindeki yazılar.`,
    alternates: { canonical: pagePath(base, page) },
    pagination: {
      previous: pagePath(base, page - 1),
      next: page < pages ? pagePath(base, page + 1) : undefined,
    },
  }
}

export default async function CategoryPageN({
  params,
}: PageProps<"/kategori/[slug]/sayfa/[page]">) {
  const { slug, page: raw } = await params
  if (raw === "1") redirect(`/kategori/${slug}`)
  const page = parsePageNumber(raw)
  if (!page) notFound()

  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const [{ posts, total }, categories] = await Promise.all([
    getPostsPage({ page, pageSize: POSTS_PER_PAGE, categorySlug: slug }),
    getCategoriesWithPosts(),
  ])
  const pages = totalPages(total)
  if (page > pages) notFound()

  return (
    <PostsListing
      title={category.name}
      description={`Sayfa ${page} / ${pages}`}
      posts={posts}
      categories={categories}
      activeSlug={slug}
      base={`/kategori/${slug}`}
      page={page}
      pages={pages}
    />
  )
}
