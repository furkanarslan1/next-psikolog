"use server"

import { invalidateAbout } from "@/lib/cache-tags"
import { getCloudinaryAssetSize } from "@/lib/cloudinary"
import { publicIdFromUrl } from "@/lib/cloudinary-url"
import { db } from "@/lib/db"
import { deleteIfUnreferenced, postImageIds } from "@/lib/media"
import { requireAdmin } from "@/lib/require-admin"
import { sanitizeContent } from "@/lib/sanitize"
import { aboutSchema, type AboutValues } from "@/lib/validations/about"

export async function saveAboutAction(values: AboutValues) {
  await requireAdmin()

  const parsed = aboutSchema.safeParse(values)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz bilgi" }
  }

  const existing = await db.about.findUnique({ where: { id: "main" } })
  const imageUrl = parsed.data.imageUrl || null
  const imageId = imageUrl ? publicIdFromUrl(imageUrl) : null
  // görselin gerçek boyutu sunucuda okunur: çerçeve kırpmadan oranına uyar
  const size =
    imageUrl && imageId
      ? imageUrl === existing?.imageUrl && existing.imageWidth && existing.imageHeight
        ? { width: existing.imageWidth, height: existing.imageHeight }
        : await getCloudinaryAssetSize(imageId)
      : null

  const content = sanitizeContent(parsed.data.content)

  const data = {
    content,
    imageUrl,
    imageAlt: imageUrl ? parsed.data.imageAlt : null,
    imageWidth: size?.width ?? null,
    imageHeight: size?.height ?? null,
  }
  await db.about.upsert({
    where: { id: "main" },
    update: data,
    create: { id: "main", ...data },
  })

  // artık kullanılmayan görselleri (görsel ve içerik görselleri) sil
  if (existing) {
    const kept = postImageIds({ coverImageUrl: data.imageUrl, content: data.content })
    const before = postImageIds({
      coverImageUrl: existing.imageUrl,
      content: existing.content,
    })
    await deleteIfUnreferenced([...before].filter((id) => !kept.has(id)))
  }

  invalidateAbout()
  return { error: undefined }
}
