import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { PostsListing } from "@/components/site/posts-listing"
import {
  POSTS_PER_PAGE,
  listBase,
  parseTypeSlug,
  postTypes,
  totalPages,
} from "@/lib/blog-config"
import { getPostsPage } from "@/lib/queries/posts"
import { siteConfig } from "@/lib/site"

export function generateStaticParams() {
  return Object.keys(postTypes).map((type) => ({ type }))
}

export async function generateMetadata({
  params,
}: PageProps<"/yazilar/tur/[type]">): Promise<Metadata> {
  const type = parseTypeSlug((await params).type)
  if (!type) return {}

  const { total } = await getPostsPage({
    page: 1,
    pageSize: POSTS_PER_PAGE,
    type: postTypes[type].value,
  })
  return {
    title: postTypes[type].plural,
    description: siteConfig.description,
    alternates: { canonical: listBase(type) },
    pagination: totalPages(total) > 1 ? { next: `${listBase(type)}/sayfa/2` } : undefined,
  }
}

export default async function TypePage({ params }: PageProps<"/yazilar/tur/[type]">) {
  const type = parseTypeSlug((await params).type)
  if (!type) notFound()

  const { posts, total } = await getPostsPage({
    page: 1,
    pageSize: POSTS_PER_PAGE,
    type: postTypes[type].value,
  })

  return <PostsListing type={type} posts={posts} page={1} pages={totalPages(total)} />
}
