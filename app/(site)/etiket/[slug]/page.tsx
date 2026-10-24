import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { PageHeading } from "@/components/site/page-heading"
import { EmptyPosts, PostGrid } from "@/components/site/post-card"
import {
  getPublishedPosts,
  getSitemapData,
  getTagBySlug,
} from "@/lib/queries/posts"

const PLACEHOLDER_SLUG = "__yok__"

export async function generateStaticParams() {
  const { tags } = await getSitemapData()
  return tags.length > 0
    ? tags.map((tag) => ({ slug: tag.slug }))
    : [{ slug: PLACEHOLDER_SLUG }]
}

export async function generateMetadata({
  params,
}: PageProps<"/etiket/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const tag = await getTagBySlug(slug)
  if (!tag) return {}

  return {
    title: `${tag.name} etiketli yazılar`,
    description: `${tag.name} etiketiyle işaretlenmiş yazılar.`,
    alternates: { canonical: `/etiket/${tag.slug}` },
    // ince içerik sayfaları arama sonuçlarını şişirmesin
    robots: { index: false, follow: true },
  }
}

export default async function TagPage({ params }: PageProps<"/etiket/[slug]">) {
  const { slug } = await params
  const tag = await getTagBySlug(slug)
  if (!tag) notFound()

  const posts = await getPublishedPosts({ tagSlug: slug })

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-14 sm:px-8 sm:py-20">
      <PageHeading title={tag.name} description="Bu etiketle işaretlenmiş yazılar" />
      <p>
        <Link href="/yazilar" className="border-b-2 border-transparent pb-1 text-ink-soft hover:border-anthracite hover:text-ink">
          Tüm yazılar
        </Link>
      </p>
      {posts.length === 0 ? <EmptyPosts /> : <PostGrid posts={posts} />}
    </div>
  )
}
