"use client"

import { isCloudinaryUrl, transformedUrl } from "@/lib/cloudinary-url"

// next/image için tek yükleyici: Cloudinary'den ekrana uygun genişlikte ve
// tarayıcıya uygun biçimde (AVIF/WebP) sunar. Vercel'in görsel optimizasyonu
// kullanılmaz; genişlik sayısı next.config.ts'te bilerek az tutulur.
export default function cloudinaryLoader({
  src,
  width,
}: {
  src: string
  width: number
}) {
  return isCloudinaryUrl(src) ? transformedUrl(src, { width }) : src
}
