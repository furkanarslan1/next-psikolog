import Link from "next/link"

import { formatDate } from "@/lib/format"
import type { PostCard as PostCardData } from "@/lib/queries/posts"

function Meta({ post }: { post: PostCardData }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-2 font-sans-site text-sm text-ink-soft">
      {post.category && (
        <span className="label-caps text-brand">
          {post.category.name}
        </span>
      )}
      {post.publishedAt && (
        <time dateTime={post.publishedAt.toISOString()}>
          {formatDate(post.publishedAt)}
        </time>
      )}
    </p>
  )
}

const titleLink =
  "after:absolute after:inset-0 decoration-brand decoration-2 underline-offset-4 group-hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"

export function PostCard({ post }: { post: PostCardData }) {
  return (
    <article className="group relative flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Meta post={post} />
        <h3 className="font-serif-site text-2xl leading-snug font-medium tracking-tight text-balance">
          <Link href={`/blog/${post.slug}`} className={titleLink}>
            {post.title}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-ink-soft sm:text-[0.9375rem]">{post.excerpt}</p>
      </div>
    </article>
  )
}

export function FeaturedPostCard({ post }: { post: PostCardData }) {
  return (
    <article className="group relative grid gap-6">
      <div className="flex flex-col gap-3">
        <Meta post={post} />
        <h2 className="font-serif-site text-2xl leading-tight font-medium tracking-tight text-balance sm:text-3xl">
          <Link href={`/blog/${post.slug}`} className={titleLink}>
            {post.title}
          </Link>
        </h2>
        <p className="text-sm leading-relaxed text-ink-soft sm:text-base">{post.excerpt}</p>
      </div>
    </article>
  )
}

export function PostGrid({ posts }: { posts: PostCardData[] }) {
  const [featured, ...rest] = posts
  if (!featured) return null

  return (
    <div className="flex flex-col gap-14">
      <FeaturedPostCard post={featured} />
      {rest.length > 0 && (
        <div
          className={`grid gap-x-8 gap-y-12 border-t border-line pt-12 sm:grid-cols-2 ${
            rest.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
          }`}
        >
          {rest.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}

export function EmptyPosts() {
  return (
    <p className="max-w-prose text-lg text-ink-soft">
      Henüz yayınlanmış yazı yok. Yeni yazılar yayınlandığında burada görünecek.
    </p>
  )
}
