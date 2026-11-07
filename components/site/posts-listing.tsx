import { PageHeading } from "@/components/site/page-heading"
import { Pagination } from "@/components/site/pagination"
import { EmptyPosts, PostList } from "@/components/site/post-list"
import { TypeFilter } from "@/components/site/type-filter"
import { listBase, type PostTypeSlug } from "@/lib/blog-config"
import type { PostCard } from "@/lib/queries/posts"

// /yazilar ve tür sayfalarının ortak görünümü
export function PostsListing({
  type,
  description,
  posts,
  page,
  pages,
}: {
  type: PostTypeSlug | null
  description?: string
  posts: PostCard[]
  page: number
  pages: number
}) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-14 sm:px-8 sm:py-20">
      <PageHeading title="Yazılar" description={description} />
      <TypeFilter active={type} />
      {posts.length === 0 ? <EmptyPosts /> : <PostList posts={posts} />}
      <Pagination base={listBase(type)} current={page} total={pages} />
    </div>
  )
}
