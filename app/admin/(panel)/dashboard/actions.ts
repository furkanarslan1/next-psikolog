"use server"

import { cleanupOrphanedImages } from "@/lib/media"
import { requireAdmin } from "@/lib/require-admin"

// Hiçbir yazıda (taslaklar dahil) kullanılmayan, 24 saatten eski görselleri siler.
export async function cleanupMediaAction() {
  await requireAdmin()
  try {
    return { error: undefined, deleted: await cleanupOrphanedImages() }
  } catch (error) {
    console.error("Medya temizliği başarısız:", error)
    return { error: "Görseller temizlenemedi", deleted: 0 }
  }
}
