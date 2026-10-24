import {
  deleteCloudinaryAssets,
  listCloudinaryAssets,
} from "@/lib/cloudinary"
import { imageUrlsInHtml, publicIdFromUrl } from "@/lib/cloudinary-url"
import { db } from "@/lib/db"

const ORPHAN_GRACE_MS = 24 * 60 * 60 * 1000

export function postImageIds(post: {
  coverImageUrl: string | null
  content: string
}) {
  const urls = [
    ...(post.coverImageUrl ? [post.coverImageUrl] : []),
    ...imageUrlsInHtml(post.content),
  ]
  const ids = new Set<string>()
  for (const url of urls) {
    const id = publicIdFromUrl(url)
    if (id) ids.add(id)
  }
  return ids
}

// Veritabanında (taslaklar dahil) bir yerde geçen tüm görsel kimlikleri.
// Yeni bir yer görsel kullanmaya başladığında (örn. hero) buraya eklenmeli.
export async function getReferencedImageIds() {
  const posts = await db.post.findMany({
    select: { coverImageUrl: true, content: true },
  })
  const ids = new Set<string>()
  for (const post of posts) {
    for (const id of postImageIds(post)) ids.add(id)
  }
  return ids
}

// Aday görsellerden hiçbir yerde kullanılmayanları Cloudinary'den siler.
// Taslaklar dahil her kayıt "kullanımda" sayılır. Hata kaydı bozmaz.
export async function deleteIfUnreferenced(candidates: Iterable<string>) {
  const list = [...new Set(candidates)]
  if (list.length === 0) return 0

  try {
    const referenced = await getReferencedImageIds()
    const orphans = list.filter((id) => !referenced.has(id))
    return await deleteCloudinaryAssets(orphans)
  } catch (error) {
    console.error("Görsel temizliği başarısız:", error)
    return 0
  }
}

// Yüklenip hiçbir yere bağlanmamış (24 saatten eski) görselleri bulur.
export async function findOrphanedImages() {
  const [assets, referenced] = await Promise.all([
    listCloudinaryAssets(),
    getReferencedImageIds(),
  ])
  const cutoff = Date.now() - ORPHAN_GRACE_MS
  return assets
    .filter(
      (asset) =>
        !referenced.has(asset.publicId) && asset.createdAt.getTime() < cutoff
    )
    .map((asset) => asset.publicId)
}

export async function cleanupOrphanedImages() {
  const orphans = await findOrphanedImages()
  return deleteCloudinaryAssets(orphans)
}
