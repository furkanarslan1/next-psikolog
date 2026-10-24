import { isCloudinaryUrl, transformedUrl } from "@/lib/cloudinary-url"

// Genişlikler next.config.ts'teki deviceSizes ile aynı tutulur: aynı dönüşümler
// yeniden kullanılır, Cloudinary dönüşüm sayısı artmaz.
const WIDTHS = [640, 960, 1280]

// Yazı içeriğindeki (kaydedilirken temizlenmiş) Cloudinary görsellerini
// ekrana uygun, hafif, tembel yüklenen ve boyutu belli <img> etiketlerine çevirir.
export function optimizeContentHtml(html: string) {
  return html.replace(/<img\b([^>]*)>/gi, (tag, attrs: string) => {
    const src = attrs.match(/\bsrc="([^"]+)"/)?.[1]
    if (!src || !isCloudinaryUrl(src)) return tag

    const alt = attrs.match(/\balt="([^"]*)"/)?.[1] ?? ""
    const width = attrs.match(/\bwidth="(\d+)"/)?.[1]
    const height = attrs.match(/\bheight="(\d+)"/)?.[1]
    const srcset = WIDTHS.map(
      (size) => `${transformedUrl(src, { width: size })} ${size}w`
    ).join(", ")

    return (
      `<img src="${transformedUrl(src, { width: 960 })}" srcset="${srcset}" ` +
      `sizes="(min-width: 768px) 48rem, 100vw" alt="${alt}" ` +
      (width && height ? `width="${width}" height="${height}" ` : "") +
      `loading="lazy" decoding="async">`
    )
  })
}
