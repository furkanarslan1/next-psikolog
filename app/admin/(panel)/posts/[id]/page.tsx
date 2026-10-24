import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { connection } from "next/server"

import { PostForm } from "@/components/post-form"
import { db } from "@/lib/db"

export const metadata: Metadata = {
  title: "Yazıyı düzenle",
  robots: { index: false, follow: false },
}

export default async function EditPostPage({
  params,
}: PageProps<"/admin/posts/[id]">) {
  await connection()
  const { id } = await params
  const [post, categories] = await Promise.all([
    db.post.findUnique({ where: { id }, include: { tags: true } }),
    db.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ])
  if (!post) notFound()

  return (
    <>
      <h1 className="text-2xl font-semibold">Yazıyı düzenle</h1>
      <PostForm
        categories={categories}
        postId={post.id}
        initialValues={{
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          coverImageUrl: post.coverImageUrl ?? "",
          coverImageAlt: post.coverImageAlt ?? "",
          categoryId: post.categoryId ?? "",
          tags: post.tags.map((tag) => tag.name),
          status: post.status,
          metaTitle: post.metaTitle ?? "",
          metaDescription: post.metaDescription ?? "",
        }}
      />
    </>
  )
}
