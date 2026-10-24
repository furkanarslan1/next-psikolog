import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { CategoryNav } from "@/components/site/category-nav"
import { PageHeading } from "@/components/site/page-heading"
import { EmptyPosts, PostGrid } from "@/components/site/post-card"
import {
  getCategoriesWithPosts,
  getCategoryBySlug,
  getPublishedPosts,
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

  return {
    title: `${category.name} yazıları`,
    description: `${category.name} kategorisindeki yazılar.`,
    alternates: { canonical: `/kategori/${category.slug}` },
  }
}

export default async function CategoryPage({
  params,
}: PageProps<"/kategori/[slug]">) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const [posts, categories] = await Promise.all([
    getPublishedPosts({ categorySlug: slug }),
    getCategoriesWithPosts(),
  ])

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-14 sm:px-8 sm:py-20">
      <PageHeading title={category.name} />
      <CategoryNav categories={categories} activeSlug={slug} />
      {posts.length === 0 ? <EmptyPosts /> : <PostGrid posts={posts} />}
    </div>
  )
}
