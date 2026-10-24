// Tarayıcı ve sunucu tarafında ortak, SDK gerektirmeyen Cloudinary URL yardımcıları.

export const UPLOAD_FOLDER = "psikolog-blog"

const UPLOAD_MARKER = "/image/upload/"

export function isCloudinaryUrl(src: string) {
  return src.startsWith("https://res.cloudinary.com/") && src.includes(UPLOAD_MARKER)
}

type Transform = {
  width?: number
  height?: number
  crop?: "limit" | "fill"
  format?: "auto" | "jpg"
}

// Orijinal URL'ye dönüşüm ekler: .../upload/<dönüşüm>/v123/klasör/dosya.webp
export function transformedUrl(src: string, options: Transform = {}) {
  if (!isCloudinaryUrl(src)) return src

  const { width, height, crop = "limit", format = "auto" } = options
  const parts = [
    `f_${format}`,
    "q_auto:good",
    `c_${crop}`,
    width ? `w_${width}` : null,
    height ? `h_${height}` : null,
  ].filter(Boolean)

  const index = src.indexOf(UPLOAD_MARKER) + UPLOAD_MARKER.length
  return `${src.slice(0, index)}${parts.join(",")}/${src.slice(index)}`
}

// URL'den Cloudinary public_id çıkarır (yalnızca bizim klasörümüzdekiler).
export function publicIdFromUrl(url: string) {
  if (!isCloudinaryUrl(url)) return null

  const path = url.slice(url.indexOf(UPLOAD_MARKER) + UPLOAD_MARKER.length)
  const segments = path.split("?")[0].split("/")
  const start = segments.indexOf(UPLOAD_FOLDER)
  if (start === -1) return null

  const publicPath = segments.slice(start).join("/")
  return publicPath.replace(/\.[a-z0-9]+$/i, "")
}

// Yazı içeriğindeki <img> adreslerini döndürür.
export function imageUrlsInHtml(html: string) {
  return [...html.matchAll(/<img\b[^>]*?\bsrc="([^"]+)"/gi)].map((match) => match[1])
}
