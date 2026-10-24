import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog yazıları",
  robots: { index: false, follow: false },
}

export default function PostsPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold">Blog yazıları</h1>
      <p className="text-muted-foreground">Henüz yazı yok.</p>
    </>
  )
}
