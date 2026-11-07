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
  }

  // butonlar artık sabit (Hakkımda / İletişime Geçin); şemadaki buton sütunları
  // kullanılmıyor, posts migration'ında silinecek
  await db.hero.upsert({
    where: { id: "main" },
    update: data,
    create: { id: "main", ...data, buttonLabel: "Hakkımda", buttonUrl: "/hakkimda" },
  })

  invalidateHero()
  return { error: undefined }
}
