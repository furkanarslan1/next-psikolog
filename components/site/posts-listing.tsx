import { CategoryNav } from "@/components/site/category-nav"
import { PageHeading } from "@/components/site/page-heading"
import { Pagination } from "@/components/site/pagination"
import { EmptyPosts, PostGrid } from "@/components/site/post-card"
import type { PostCard } from "@/lib/queries/posts"

// /yazilar ve kategori sayfalarının ortak görünümü
export function PostsListing({
  title,
  description,
  posts,
  categories,
  activeSlug,
  base,
  page,
  pages,
}: {
  title: string
  description?: string
  posts: PostCard[]
  categories: { name: string; slug: string }[]
  activeSlug?: string
  base: string
  page: number
  pages: number
}) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-14 sm:px-8 sm:py-20">
      <PageHeading title={title} description={description} />
      <CategoryNav categories={categories} activeSlug={activeSlug} />
      {posts.length === 0 ? <EmptyPosts /> : <PostGrid posts={posts} />}
      <Pagination base={base} current={page} total={pages} />
    </div>
  )
}
