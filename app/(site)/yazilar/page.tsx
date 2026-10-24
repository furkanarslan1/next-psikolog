import type { Metadata } from "next"

import { PostsListing } from "@/components/site/posts-listing"
import { POSTS_PER_PAGE, totalPages } from "@/lib/blog-config"
import { getCategoriesWithPosts, getPostsPage } from "@/lib/queries/posts"
import { siteConfig } from "@/lib/site"

export async function generateMetadata(): Promise<Metadata> {
  const { total } = await getPostsPage({ page: 1, pageSize: POSTS_PER_PAGE })

  return {
    title: "Yazılarım",
    description: siteConfig.description,
    alternates: { canonical: "/yazilar" },
    pagination: totalPages(total) > 1 ? { next: "/yazilar/sayfa/2" } : undefined,
  }
}

export default async function PostsPage() {
  const [{ posts, total }, categories] = await Promise.all([
    getPostsPage({ page: 1, pageSize: POSTS_PER_PAGE }),
    getCategoriesWithPosts(),
  ])

  return (
    <PostsListing
      title="Yazılarım"
      posts={posts}
      categories={categories}
      base="/yazilar"
      page={1}
      pages={totalPages(total)}
    />
  )
}
