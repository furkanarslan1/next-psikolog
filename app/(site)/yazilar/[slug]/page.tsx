import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { JsonLd } from "@/components/site/json-ld"
import { postTypes, typeLabel } from "@/lib/blog-config"
import { formatDate } from "@/lib/format"
import { getPostBySlug, getSitemapData } from "@/lib/queries/posts"
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

const locales = { tr: "tr-TR", fr: "fr-FR" } as const

export async function generateMetadata({
  params,
}: PageProps<"/yazilar/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}

  const title = post.metaTitle || post.title
  const description = post.metaDescription || post.excerpt
  return {
    title,
    description,
    alternates: { canonical: `/yazilar/${post.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/yazilar/${post.slug}`,
      locale: post.lang === "fr" ? "fr_FR" : siteConfig.locale,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
    },
    twitter: { card: "summary", title, description },
  }
}

const focus = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"

export default async function PostPage({ params }: PageProps<"/yazilar/[slug]">) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const url = absoluteUrl(`/yazilar/${post.slug}`)
  const translation = post.type === "CEVIRI"
  const typeSlug = translation ? "ceviri" : "yazi"
  const person = { "@type": "Person", name: siteConfig.name }

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              "@id": `${url}#article`,
              headline: post.title,
              description: post.metaDescription || post.excerpt,
              datePublished: post.publishedAt?.toISOString(),
              dateModified: post.updatedAt.toISOString(),
              inLanguage: locales[post.lang as keyof typeof locales] ?? locales.tr,
              mainEntityOfPage: url,
              ...(translation
                ? {
                    author: post.originalAuthor
                      ? { "@type": "Person", name: post.originalAuthor }
                      : person,
                    translator: person,
                    isBasedOn: {
                      "@type": "CreativeWork",
                      name: post.originalTitle ?? undefined,
                      url: post.sourceUrl ?? undefined,
                    },
                  }
                : { author: person }),
              publisher: person,
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Yazılar", item: absoluteUrl("/yazilar") },
                { "@type": "ListItem", position: 2, name: post.title, item: url },
              ],
            },
          ],
        }}
      />

      <article lang={post.lang} className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-12 sm:px-8 sm:py-16">
        <header className="mx-auto flex w-full max-w-[70ch] flex-col gap-5">
          <nav aria-label="Konum" className="label-caps text-ink-soft">
            <Link href="/yazilar" className={`hover:text-brand ${focus}`}>
              Yazılar
            </Link>
            <span aria-hidden className="mx-2">/</span>
            <Link href={`/yazilar/tur/${typeSlug}`} className={`text-brand ${focus}`}>
              {postTypes[typeSlug].plural}
            </Link>
          </nav>
          <h1 className="font-serif-site text-4xl leading-[1.08] font-normal tracking-tight text-balance sm:text-6xl">
            {post.title}
          </h1>
          <p className="text-xl leading-relaxed text-ink-soft">{post.excerpt}</p>
          <p className="label-caps flex flex-wrap gap-x-5 gap-y-2 text-ink-soft">
            <span className="text-brand">{typeLabel(post.type)}</span>
            {post.publishedAt && (
              <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>
            )}
            {post.fullText && <span>{readingMinutes(post.content)} dk okuma</span>}
          </p>
          {post.publishedIn && (
            <p className="text-base text-ink-soft">
              Yayımlandığı yer: <span className="text-ink">{post.publishedIn}</span>
            </p>
          )}
        </header>

        {translation && (post.originalAuthor || post.originalTitle || post.sourceCitation) && (
          <aside
            aria-label="Orijinal metin"
            className="mx-auto w-full max-w-[70ch] border-y border-line py-5 text-base leading-relaxed text-ink-soft"
          >
            <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[9rem_1fr]">
              {post.originalAuthor && (
                <>
                  <dt className="label-caps text-ink">Orijinal yazar</dt>
                  <dd>{post.originalAuthor}</dd>
                </>
              )}
              {post.originalTitle && (
                <>
                  <dt className="label-caps text-ink">Orijinal başlık</dt>
                  <dd>
                    <span lang={post.originalLang ?? undefined}>{post.originalTitle}</span>
                    {post.originalLang && ` (${post.originalLang})`}
                  </dd>
                </>
              )}
              {post.sourceCitation && (
                <>
                  <dt className="label-caps text-ink">Kaynak</dt>
                  <dd>
                    {post.sourceCitation}
                    {post.fullText && post.sourceUrl && (
                      <>
                        {" "}
                        <a
                          href={post.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-brand underline underline-offset-4 ${focus}`}
                        >
                          Kaynağa git
                        </a>
                      </>
                    )}
                  </dd>
                </>
              )}
            </dl>
          </aside>
        )}

        {post.fullText ? (
          <div
            className="rich-content mx-auto w-full max-w-[70ch]"
            // içerik kaydedilirken sunucuda temizlenir (lib/sanitize.ts)
            dangerouslySetInnerHTML={{ __html: stripImages(post.content) }}
          />
        ) : (
          <div className="mx-auto flex w-full max-w-[70ch] flex-col items-start gap-5">
            <p className="text-lg leading-relaxed text-ink-soft">
              Bu metnin tamamı dış kaynakta yayımlanmıştır.
            </p>
            {post.sourceUrl && (
              <a
                href={post.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn-primary ${focus}`}
              >
                Tam metne git →
              </a>
            )}
          </div>
        )}
      </article>
    </>
  )
}
