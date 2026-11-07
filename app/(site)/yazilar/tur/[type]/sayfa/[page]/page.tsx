import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { PostsListing } from "@/components/site/posts-listing"
import {
  POSTS_PER_PAGE,
  listBase,
  pagePath,
  parsePageNumber,
  parseTypeSlug,
  postTypes,
  totalPages,
  type PostTypeSlug,
} from "@/lib/blog-config"
import { getPostsPage, getSitemapData } from "@/lib/queries/posts"
import { siteConfig } from "@/lib/site"

// Cache Components en az bir parametre ister: sayfa yoksa "2" yer tutucudur (404 döner)
export async function generateStaticParams() {
  const { counts } = await getSitemapData()
  const params = (Object.keys(postTypes) as PostTypeSlug[]).flatMap((type) =>
    Array.from({ length: totalPages(counts[postTypes[type].value]) - 1 }, (_, index) => ({
      type,
      page: String(index + 2),
    }))
  )
  return params.length > 0 ? params : [{ type: "yazi", page: "2" }]
}

export async function generateMetadata({
  params,
}: PageProps<"/yazilar/tur/[type]/sayfa/[page]">): Promise<Metadata> {
  const { type: rawType, page: raw } = await params
  const type = parseTypeSlug(rawType)
  const page = parsePageNumber(raw)
  if (!type || !page) return {}

  const base = listBase(type)
  const { total } = await getPostsPage({ page, pageSize: POSTS_PER_PAGE, type: postTypes[type].value })
  const pages = totalPages(total)
  if (page > pages) return {}

  return {
    title: `${postTypes[type].plural} - Sayfa ${page}`,
    description: siteConfig.description,
    alternates: { canonical: pagePath(base, page) },
    pagination: {
      previous: pagePath(base, page - 1),
      next: page < pages ? pagePath(base, page + 1) : undefined,
    },
  }
}

export default async function TypePageN({
  params,
}: PageProps<"/yazilar/tur/[type]/sayfa/[page]">) {
  const { type: rawType, page: raw } = await params
  const type = parseTypeSlug(rawType)
  if (!type) notFound()
  if (raw === "1") redirect(listBase(type))
  const page = parsePageNumber(raw)
  if (!page) notFound()

  const { posts, total } = await getPostsPage({
    page,
    pageSize: POSTS_PER_PAGE,
    type: postTypes[type].value,
  })
  const pages = totalPages(total)
  if (page > pages) notFound()

  return (
    <PostsListing
      type={type}
      description={`Sayfa ${page} / ${pages}`}
      posts={posts}
      page={page}
      pages={pages}
    />
  )
}
