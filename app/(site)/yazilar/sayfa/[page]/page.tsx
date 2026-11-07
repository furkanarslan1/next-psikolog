import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { PostsListing } from "@/components/site/posts-listing"
import {
  POSTS_PER_PAGE,
  pagePath,
  parsePageNumber,
  totalPages,
} from "@/lib/blog-config"
import { getPostsPage, getSitemapData } from "@/lib/queries/posts"
import { siteConfig } from "@/lib/site"

// Cache Components en az bir parametre ister: tek sayfa varsa "2" yer tutucudur (404 döner)
export async function generateStaticParams() {
  const { counts } = await getSitemapData()
  const params = Array.from({ length: totalPages(counts.all) - 1 }, (_, index) => ({
    page: String(index + 2),
  }))
  return params.length > 0 ? params : [{ page: "2" }]
}

export async function generateMetadata({
  params,
}: PageProps<"/yazilar/sayfa/[page]">): Promise<Metadata> {
  const { page: raw } = await params
  const page = parsePageNumber(raw)
  if (!page) return {}

  const { total } = await getPostsPage({ page, pageSize: POSTS_PER_PAGE })
  const pages = totalPages(total)
  if (page > pages) return {}

  return {
    title: `Yazılar - Sayfa ${page}`,
    description: siteConfig.description,
    alternates: { canonical: pagePath("/yazilar", page) },
    pagination: {
      previous: pagePath("/yazilar", page - 1),
      next: page < pages ? pagePath("/yazilar", page + 1) : undefined,
    },
  }
}

export default async function PostsPageN({
  params,
}: PageProps<"/yazilar/sayfa/[page]">) {
  const { page: raw } = await params
  if (raw === "1") redirect("/yazilar")
  const page = parsePageNumber(raw)
  if (!page) notFound()

  const { posts, total } = await getPostsPage({ page, pageSize: POSTS_PER_PAGE })
  const pages = totalPages(total)
  if (page > pages) notFound()

  return (
    <PostsListing
      type={null}
      description={`Sayfa ${page} / ${pages}`}
      posts={posts}
      page={page}
      pages={pages}
    />
  )
}
