import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { JsonLd } from "@/components/site/json-ld"
import { PostCard } from "@/components/site/post-card"
import { formatDate } from "@/lib/format"
import {
  getPostBySlug,
  getRelatedPosts,
  getSitemapData,
} from "@/lib/queries/posts"
import { readingMinutes } from "@/lib/reading-time"
import { stripImages } from "@/lib/sanitize"
import { absoluteUrl, siteConfig } from "@/lib/site"

// Cache Components, en az bir parametre ister; yazı yokken yer tutucu döner
const PLACEHOLDER_SLUG = "__yok__"

export async function generateStaticParams() {
  const { posts } = await getSitemapData()
  return posts.length > 0
    ? posts.map((post) => ({ slug: post.slug }))
    : [{ slug: PLACEHOLDER_SLUG }]
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}

  const title = post.metaTitle || post.title
  const description = post.metaDescription || post.excerpt
  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  }
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const related = await getRelatedPosts(post.id, post.category)
  const url = absoluteUrl(`/blog/${post.slug}`)

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BlogPosting",
              "@id": `${url}#article`,
              headline: post.title,
              description: post.metaDescription || post.excerpt,
              datePublished: post.publishedAt?.toISOString(),
              dateModified: post.updatedAt.toISOString(),
              inLanguage: "tr-TR",
              mainEntityOfPage: url,
              keywords: post.tags.map((tag) => tag.name).join(", ") || undefined,
              articleSection: post.category?.name,
              author: { "@type": "Person", name: siteConfig.name },
              publisher: { "@type": "Person", name: siteConfig.name },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Yazılarım", item: absoluteUrl("/") },
                ...(post.category
                  ? [
                      {
                        "@type": "ListItem",
                        position: 2,
                        name: post.category.name,
                        item: absoluteUrl(`/kategori/${post.category.slug}`),
                      },
                    ]
                  : []),
                {
                  "@type": "ListItem",
                  position: post.category ? 3 : 2,
                  name: post.title,
                  item: url,
                },
              ],
            },
          ],
        }}
      />

      <article className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-12 sm:px-8 sm:py-16">
        <header className="mx-auto flex w-full max-w-3xl flex-col gap-5">
          <nav aria-label="Konum" className="text-sm text-ink-soft">
            <Link href="/" className="hover:text-ink hover:underline">
              Yazılarım
            </Link>
            {post.category && (
              <>
                <span aria-hidden className="mx-2">/</span>
                <Link
                  href={`/kategori/${post.category.slug}`}
                  className="font-medium text-anthracite hover:underline"
                >
                  {post.category.name}
                </Link>
              </>
            )}
          </nav>
          <h1 className="font-serif-site text-3xl leading-[1.12] font-normal tracking-tight text-balance sm:text-5xl">
            {post.title}
          </h1>
          <p className="text-xl leading-relaxed text-ink-soft">{post.excerpt}</p>
          <p className="flex flex-wrap gap-x-5 text-sm text-ink-soft">
            {post.publishedAt && (
              <time dateTime={post.publishedAt.toISOString()}>
                {formatDate(post.publishedAt)}
              </time>
            )}
            <span>{readingMinutes(post.content)} dk okuma</span>
          </p>
        </header>

        <div
          className="rich-content mx-auto w-full max-w-[70ch]"
          // içerik kaydedilirken sunucuda temizlenir (lib/sanitize.ts)
          dangerouslySetInnerHTML={{ __html: stripImages(post.content) }}
        />

        {post.tags.length > 0 && (
          <ul className="mx-auto flex w-full max-w-3xl flex-wrap gap-2 border-t border-line pt-6">
            {post.tags.map((tag) => (
              <li key={tag.slug}>
                <Link
                  href={`/etiket/${tag.slug}`}
                  className="inline-block rounded-xs border border-line bg-surface px-3 py-1 text-sm text-ink-soft transition-colors hover:border-anthracite hover:text-ink"
                >
                  {tag.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </article>

      {related.length > 0 && (
        <section
          aria-labelledby="related-heading"
          className="border-t border-line bg-surface"
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-14 sm:px-8">
            <h2
              id="related-heading"
              className="font-serif-site text-3xl font-normal tracking-tight"
            >
              Benzer yazılar
            </h2>
            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <PostCard key={item.id} post={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
