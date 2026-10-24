import type { Metadata } from "next"
import { connection } from "next/server"
import { Suspense } from "react"

import { FormSkeleton } from "@/components/admin/skeletons"
import { HeroForm } from "@/components/hero-form"
import { db } from "@/lib/db"

export const metadata: Metadata = {
  title: "Hero",
  robots: { index: false, follow: false },
}

export default function HeroPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold">Hero</h1>
      <Suspense fallback={<FormSkeleton />}>
        <HeroEditor />
      </Suspense>
    </>
  )
}

async function HeroEditor() {
  await connection()
  const hero = await db.hero.findUnique({ where: { id: "main" } })

  return (
    <HeroForm
      initialValues={
        hero
          ? {
              headline: hero.headline,
              description: hero.description ?? "",
              buttonLabel: hero.buttonLabel,
              buttonUrl: hero.buttonUrl,
              imageUrl: hero.imageUrl ?? "",
              imageAlt: hero.imageAlt ?? "",
            }
          : undefined
      }
    />
  )
}
