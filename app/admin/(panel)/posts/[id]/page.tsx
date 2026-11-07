import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { connection } from "next/server"
import { Suspense } from "react"

import { FormSkeleton } from "@/components/admin/skeletons"
import { PostForm } from "@/components/post-form"
import { db } from "@/lib/db"

export const metadata: Metadata = {
  title: "Kaydı düzenle",
  robots: { index: false, follow: false },
}

export default function EditPostPage({ params }: PageProps<"/admin/posts/[id]">) {
  return (
    <>
      <h1 className="text-2xl font-semibold">Yazıyı / çeviriyi düzenle</h1>
      <Suspense fallback={<FormSkeleton />}>
        <EditPostForm params={params} />
      </Suspense>
    </>
  )
}

async function EditPostForm({
  params,
}: {
  params: PageProps<"/admin/posts/[id]">["params"]
}) {
  await connection()
  const { id } = await params
  const post = await db.post.findUnique({ where: { id } })
  if (!post) notFound()

  return (
    <PostForm
      postId={post.id}
      initialValues={{
        type: post.type,
        lang: post.lang === "fr" ? "fr" : "tr",
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        fullText: post.fullText,
        featured: post.featured,
        publishedIn: post.publishedIn ?? "",
        originalAuthor: post.originalAuthor ?? "",
        originalTitle: post.originalTitle ?? "",
        originalLang: post.originalLang ?? "",
        sourceCitation: post.sourceCitation ?? "",
        sourceUrl: post.sourceUrl ?? "",
        status: post.status,
        metaTitle: post.metaTitle ?? "",
        metaDescription: post.metaDescription ?? "",
      }}
    />
  )
}
