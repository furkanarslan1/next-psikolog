"use server"

import { invalidateHero } from "@/lib/cache-tags"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/require-admin"
import { heroSchema, type HeroValues } from "@/lib/validations/hero"

export async function saveHeroAction(values: HeroValues) {
  await requireAdmin()

  const parsed = heroSchema.safeParse(values)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz bilgi" }
  }

  const data = {
    headline: parsed.data.headline,
    description: parsed.data.description || null,
    buttonLabel: parsed.data.buttonLabel,
    buttonUrl: parsed.data.buttonUrl,
  }

  await db.hero.upsert({
    where: { id: "main" },
    update: data,
    create: { id: "main", ...data },
  })

  invalidateHero()
  return { error: undefined }
}
