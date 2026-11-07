import type { Metadata } from "next"

import { PostsListing } from "@/components/site/posts-listing"
import { POSTS_PER_PAGE, totalPages } from "@/lib/blog-config"
import { languageAlternates } from "@/lib/i18n"
import { getPostsPage } from "@/lib/queries/posts"
import { siteConfig } from "@/lib/site"

export async function generateMetadata(): Promise<Metadata> {
  const { total } = await getPostsPage({ page: 1, pageSize: POSTS_PER_PAGE })

  return {
    title: "Yazılar",
    description: siteConfig.description,
    alternates: { canonical: "/yazilar", languages: languageAlternates("/yazilar") },
    pagination: totalPages(total) > 1 ? { next: "/yazilar/sayfa/2" } : undefined,
  }
}

export default async function PostsPage() {
  const { posts, total } = await getPostsPage({ page: 1, pageSize: POSTS_PER_PAGE })

  return <PostsListing type={null} posts={posts} page={1} pages={totalPages(total)} />
}
