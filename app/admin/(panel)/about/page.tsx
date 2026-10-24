import type { Metadata } from "next"
import { connection } from "next/server"
import { Suspense } from "react"

import { FormSkeleton } from "@/components/admin/skeletons"
import { AboutForm } from "@/components/about-form"
import { db } from "@/lib/db"

export const metadata: Metadata = {
  title: "Hakkımda",
  robots: { index: false, follow: false },
}

export default function AboutPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold">Hakkımda</h1>
      <Suspense fallback={<FormSkeleton />}>
        <AboutEditor />
      </Suspense>
    </>
  )
}

async function AboutEditor() {
  await connection()
  const about = await db.about.findUnique({ where: { id: "main" } })

  return (
    <AboutForm
      initialValues={
        about
          ? {
              content: about.content,
              imageUrl: about.imageUrl ?? "",
              imageAlt: about.imageAlt ?? "",
            }
          : undefined
      }
    />
  )
}
