import Image from "next/image"
import Link from "next/link"

import { formatDate } from "@/lib/format"
import type { PostCard as PostCardData } from "@/lib/queries/posts"

function Cover({ post, sizes, priority }: { post: PostCardData; sizes: string; priority?: boolean }) {
  return (
    <div className="relative aspect-[3/2] overflow-hidden rounded-xs bg-line">
      {post.coverImageUrl && (
        <Image
          src={post.coverImageUrl}
          alt={post.coverImageAlt ?? ""}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none"
        />
      )}
    </div>
  )
}

function Meta({ post }: { post: PostCardData }) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-4 text-sm text-ink-soft">
      {post.category && (
        <span className="font-medium text-copper-ink">{post.category.name}</span>
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
  "after:absolute after:inset-0 decoration-copper decoration-2 underline-offset-4 group-hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-copper"

export function PostCard({ post }: { post: PostCardData }) {
  return (
    <article className="group relative flex flex-col gap-4">
      <Cover post={post} sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw" />
      <div className="flex flex-col gap-2">
        <Meta post={post} />
        <h3 className="font-serif-site text-2xl leading-snug font-medium tracking-tight text-balance">
          <Link href={`/blog/${post.slug}`} className={titleLink}>
            {post.title}
          </Link>
        </h3>
        <p className="line-clamp-3 leading-relaxed text-ink-soft">{post.excerpt}</p>
      </div>
    </article>
  )
}

export function FeaturedPostCard({ post }: { post: PostCardData }) {
  return (
    <article className="group relative grid gap-6 lg:grid-cols-[3fr_2fr] lg:items-center lg:gap-12">
      <Cover post={post} priority sizes="(min-width: 1024px) 40rem, 100vw" />
      <div className="flex flex-col gap-3">
        <Meta post={post} />
        <h2 className="font-serif-site text-3xl leading-tight font-medium tracking-tight text-balance sm:text-4xl">
          <Link href={`/blog/${post.slug}`} className={titleLink}>
            {post.title}
          </Link>
        </h2>
        <p className="text-lg leading-relaxed text-ink-soft">{post.excerpt}</p>
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
        <div className="grid gap-x-8 gap-y-12 border-t border-line pt-12 sm:grid-cols-2 lg:grid-cols-3">
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
