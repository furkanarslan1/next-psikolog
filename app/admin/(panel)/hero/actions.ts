"use server"

import { invalidateHero } from "@/lib/cache-tags"
import { getCloudinaryAssetSize } from "@/lib/cloudinary"
import { publicIdFromUrl } from "@/lib/cloudinary-url"
import { db } from "@/lib/db"
import { deleteIfUnreferenced } from "@/lib/media"
import { requireAdmin } from "@/lib/require-admin"
import { heroSchema, type HeroValues } from "@/lib/validations/hero"

export async function saveHeroAction(values: HeroValues) {
  await requireAdmin()

  const parsed = heroSchema.safeParse(values)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz bilgi" }
  }

  const existing = await db.hero.findUnique({ where: { id: "main" } })
  const imageUrl = parsed.data.imageUrl || null
  const imageId = imageUrl ? publicIdFromUrl(imageUrl) : null
  // görselin gerçek boyutu sunucuda okunur: hero çerçevesi kırpmadan oranına uyar
  const size =
    imageUrl && imageId
      ? imageUrl === existing?.imageUrl && existing.imageWidth
        ? { width: existing.imageWidth, height: existing.imageHeight ?? 0 }
        : await getCloudinaryAssetSize(imageId)
      : null
  const data = {
    headline: parsed.data.headline,
    description: parsed.data.description || null,
    imageWidth: size?.width ?? null,
    imageHeight: size?.height || null,
    buttonLabel: parsed.data.buttonLabel,
    buttonUrl: parsed.data.buttonUrl,
    imageUrl,
    imageAlt: imageUrl ? parsed.data.imageAlt : null,
  }

  await db.hero.upsert({
    where: { id: "main" },
    update: data,
    create: { id: "main", ...data },
  })

  // değiştirilen veya kaldırılan eski görseli sil (başka yerde kullanılmıyorsa)
  const oldId = existing?.imageUrl ? publicIdFromUrl(existing.imageUrl) : null
  if (oldId && oldId !== imageId) await deleteIfUnreferenced([oldId])

  invalidateHero()
  return { error: undefined }
}
