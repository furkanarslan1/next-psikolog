import Link from "next/link"

import { EmptyPosts } from "@/components/site/post-card"
import { formatDate } from "@/lib/format"
import type { PostCard } from "@/lib/queries/posts"

const focus = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"

// Ana sayfa: en yeni yazı özetiyle büyük, diğerleri tek satır (tarih + başlık)
export function RecentPosts({ posts }: { posts: PostCard[] }) {
  const [latest, ...rest] = posts

  return (
    <section
      id="yazilar"
      aria-labelledby="recent-heading"
      className="mx-auto w-full max-w-6xl scroll-mt-4 border-t border-line px-5 py-14 sm:px-8 sm:py-20"
    >
      <div className="flex items-baseline justify-between gap-6">
        <h2
          id="recent-heading"
          className="font-serif-site text-3xl font-normal tracking-tight sm:text-4xl"
        >
          Son yazılar
        </h2>
        <Link
          href="/yazilar"
          className={`label-caps shrink-0 transition-colors hover:text-brand ${focus}`}
        >
          Tüm Yazılar →
        </Link>
      </div>

      {!latest ? (
        <div className="mt-10">
          <EmptyPosts />
        </div>
      ) : (
        <div className="mt-10 flex flex-col">
          <article className="group relative flex max-w-3xl flex-col gap-4 pb-12">
            {latest.publishedAt && (
              <time dateTime={latest.publishedAt.toISOString()} className="label-caps text-ink-soft">
                {formatDate(latest.publishedAt)}
              </time>
            )}
            <h3 className="font-serif-site text-3xl leading-tight font-normal tracking-tight text-balance sm:text-5xl">
              <Link
                href={`/blog/${latest.slug}`}
                className={`decoration-brand decoration-2 underline-offset-4 after:absolute after:inset-0 group-hover:underline ${focus}`}
              >
                {latest.title}
              </Link>
            </h3>
            <p className="text-lg leading-relaxed text-ink-soft sm:text-xl">{latest.excerpt}</p>
          </article>

          {rest.map((post) => (
            <article
              key={post.id}
              className="group relative flex flex-col gap-1 border-t border-line py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
            >
              <h3 className="font-serif-site text-xl leading-snug sm:text-2xl">
                <Link
                  href={`/blog/${post.slug}`}
                  className={`decoration-brand decoration-2 underline-offset-4 after:absolute after:inset-0 group-hover:underline ${focus}`}
                >
                  {post.title}
                </Link>
              </h3>
              {post.publishedAt && (
                <time
                  dateTime={post.publishedAt.toISOString()}
                  className="label-caps shrink-0 text-ink-soft"
                >
                  {formatDate(post.publishedAt)}
                </time>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
