import type { Metadata } from "next"
import { connection } from "next/server"

import { PostForm } from "@/components/post-form"
import { db } from "@/lib/db"

export const metadata: Metadata = {
  title: "Yeni yazı",
  robots: { index: false, follow: false },
}

export default async function NewPostPage() {
  await connection()
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  })

  return (
    <>
      <h1 className="text-2xl font-semibold">Yeni yazı</h1>
      <PostForm categories={categories} />
    </>
  )
}
