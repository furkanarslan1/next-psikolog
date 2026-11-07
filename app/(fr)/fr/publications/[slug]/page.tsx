import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { PostArticle } from "@/components/site/post-article"
import { getPostBySlug, getSitemapData } from "@/lib/queries/posts"
import { defaultOgImages, siteConfig } from "@/lib/site"

// Cache Components en az bir parametre ister; yazı yokken yer tutucu döner
const PLACEHOLDER_SLUG = "__yok__"

export async function generateStaticParams() {
  const { posts } = await getSitemapData()
  return posts.length > 0
    ? posts.map((post) => ({ slug: post.slug }))
    : [{ slug: PLACEHOLDER_SLUG }]
}

export async function generateMetadata({
  params,
}: PageProps<"/fr/publications/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}

  const title = post.metaTitle || post.title
  const description = post.metaDescription || post.excerpt
  return {
    title,
    description,
    // aynı içerik Türkçe sayfada da var: kanonik adres oradadır
    alternates: { canonical: `/yazilar/${post.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/yazilar/${post.slug}`,
      siteName: siteConfig.name,
      locale: "fr_FR",
      images: defaultOgImages,
    },
    twitter: { card: "summary_large_image", title, description },
  }
}

export default async function FrenchPostPage({ params }: PageProps<"/fr/publications/[slug]">) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  return <PostArticle post={post} locale="fr" />
}
