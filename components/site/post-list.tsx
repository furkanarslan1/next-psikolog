import Link from "next/link"

import { Matheme } from "@/components/site/matheme"
import { formatDate } from "@/lib/format"
import { dict, type Locale } from "@/lib/i18n"
import type { PostCard } from "@/lib/queries/posts"

const focus = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"

// Liste görünümü: tarih, tür etiketi, başlık, kısa özet ve "oku →"; en yeniden eskiye
export function PostList({ posts, locale = "tr" }: { posts: PostCard[]; locale?: Locale }) {
  const t = dict[locale]
  return (
    <ul className="flex flex-col border-t border-line">
      {posts.map((post) => (
        <li key={post.id} className="border-b border-line">
          <article className="group relative flex flex-col gap-3 py-8 sm:grid sm:grid-cols-[11rem_1fr] sm:gap-10">
            <div className="flex items-center gap-4 sm:flex-col sm:items-start sm:gap-4">
              <Matheme seed={post.slug} className="order-last sm:order-first" />
              <p className="label-caps flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-soft sm:flex-col sm:items-start sm:gap-2">
                {post.publishedAt && (
                  <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt, locale)}</time>
                )}
                <span className="text-brand">{t.types[post.type]}</span>
              </p>
            </div>
            <div className="flex max-w-3xl flex-col gap-3">
              <h2 className="font-serif-site text-2xl leading-snug font-normal tracking-tight text-balance sm:text-3xl">
                <Link
                  href={locale === "fr" ? `/fr/publications/${post.slug}` : `/yazilar/${post.slug}`}
                  lang={post.lang}
                  className={`decoration-brand decoration-2 underline-offset-4 after:absolute after:inset-0 group-hover:underline ${focus}`}
                >
                  {post.title}
                </Link>
              </h2>
              <p lang={post.lang} className="line-clamp-2 text-lg leading-relaxed text-ink-soft">
                {post.excerpt}
              </p>
              <span className="label-caps text-brand" aria-hidden>
                {t.read}
              </span>
            </div>
          </article>
        </li>
      ))}
    </ul>
  )
}

export function EmptyPosts() {
  return (
    <p className="max-w-prose text-lg text-ink-soft">
      Henüz yayınlanmış kayıt yok. Yeni yazılar yayınlandığında burada görünecek.
    </p>
  )
}
