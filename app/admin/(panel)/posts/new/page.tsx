import type { Metadata } from "next"

import { PostForm } from "@/components/post-form"

export const metadata: Metadata = {
  title: "Yeni kayıt",
  robots: { index: false, follow: false },
}

export default function NewPostPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold">Yeni yazı veya çeviri</h1>
      <PostForm />
    </>
  )
}
