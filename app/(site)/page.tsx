import type { Metadata } from "next"

import { CategoryNav } from "@/components/site/category-nav"
import { PageHeading } from "@/components/site/page-heading"
import { EmptyPosts, PostGrid } from "@/components/site/post-card"
import { getCategoriesWithPosts, getPublishedPosts } from "@/lib/queries/posts"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Yazılarım",
  description: siteConfig.description,
  alternates: { canonical: "/" },
}

export default async function HomePage() {
  const [posts, categories] = await Promise.all([
    getPublishedPosts(),
    getCategoriesWithPosts(),
  ])

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-14 sm:px-8 sm:py-20">
      <PageHeading title="Yazılarım" description={siteConfig.description} />
      <CategoryNav categories={categories} />
      {posts.length === 0 ? <EmptyPosts /> : <PostGrid posts={posts} />}
    </div>
  )
}
