// Kullanım: pnpm verify-media
// Gerçek Cloudinary hesabına ve veritabanına karşı görsel yaşam döngüsünü doğrular.
// Test görseli ve taslak kaydı oluşturur, sonunda ikisini de siler.
import { loadEnvConfig } from "@next/env"

loadEnvConfig(process.cwd())

// 1x1 şeffaf PNG
const PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="

let failures = 0
function check(name: string, ok: boolean, detail = "") {
  console.log(`${ok ? "✓" : "✗"} ${name}${detail ? ` (${detail})` : ""}`)
  if (!ok) failures++
}

async function main() {
  const { imageUrlsInHtml, publicIdFromUrl, transformedUrl } = await import("../lib/cloudinary-url")
  const { optimizeContentHtml } = await import("../lib/content-images")
  const { createUploadSignature, cloudinaryAssetExists } = await import("../lib/cloudinary")
  const { deleteIfUnreferenced, findOrphanedImages } = await import("../lib/media")
  const { db } = await import("../lib/db")

  // --- saf fonksiyonlar
  const sample = "https://res.cloudinary.com/demo/image/upload/v123/psikolog-blog/abc123.webp"
  check("publicIdFromUrl", publicIdFromUrl(sample) === "psikolog-blog/abc123")
  check(
    "publicIdFromUrl (dönüşümlü URL)",
    publicIdFromUrl(transformedUrl(sample, { width: 640 })) === "psikolog-blog/abc123"
  )
  check("publicIdFromUrl (başka klasör reddedilir)", publicIdFromUrl("https://res.cloudinary.com/demo/image/upload/v1/baska/x.jpg") === null)
  check("imageUrlsInHtml", imageUrlsInHtml(`<p>a</p><img src="${sample}" alt="x">`)[0] === sample)
  const optimized = optimizeContentHtml(`<img src="${sample}" alt="Açıklama" width="800" height="600">`)
  check(
    "optimizeContentHtml (srcset, lazy, boyut)",
    optimized.includes("srcset=") && optimized.includes('loading="lazy"') && optimized.includes('width="800"') && optimized.includes("f_auto")
  )

  // --- gerçek yükleme (tarayıcının yaptığı imzalı istek)
  const signed = createUploadSignature()
  if (!signed) throw new Error("Cloudinary ayarları eksik (CLOUDINARY_URL)")

  const body = new FormData()
  body.append("file", PIXEL)
  body.append("api_key", signed.apiKey)
  body.append("timestamp", String(signed.timestamp))
  body.append("signature", signed.signature)
  body.append("folder", signed.folder)
  body.append("allowed_formats", signed.allowed_formats)
  body.append("transformation", signed.transformation)
  const response = await fetch(`https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`, { method: "POST", body })
  check("imzalı yükleme kabul edildi", response.ok, `HTTP ${response.status}`)
  if (!response.ok) throw new Error(await response.text())

  const uploaded = (await response.json()) as { secure_url: string; public_id: string }
  const publicId = uploaded.public_id
  check("public_id klasörümüzde", publicId.startsWith("psikolog-blog/"), publicId)
  check("publicIdFromUrl yüklenen görselle eşleşiyor", publicIdFromUrl(uploaded.secure_url) === publicId)

  let postId: string | undefined
  try {
    check("yüklenen görsel Cloudinary'de var", await cloudinaryAssetExists(publicId))

    // 24 saatlik koruma: yeni yüklenen görsel yetim sayılmaz
    check("yeni görsel yetim listesine girmiyor", !(await findOrphanedImages()).includes(publicId))

    // taslak yazı görseli kullanıyor
    const post = await db.post.create({
      data: {
        title: "Doğrulama taslağı",
        slug: `dogrulama-${Date.now()}`,
        excerpt: "Medya doğrulama testi için geçici taslak.",
        content: "<p>test</p>",
        coverImageUrl: uploaded.secure_url,
        status: "DRAFT",
      },
    })
    postId = post.id

    await deleteIfUnreferenced([publicId])
    check("TASLAKTAKİ görsel silinmedi", await cloudinaryAssetExists(publicId))

    // taslak silinince görsel kullanılmaz hale gelir
    await db.post.delete({ where: { id: post.id } })
    postId = undefined
    await deleteIfUnreferenced([publicId])
    check("kullanılmayan görsel Cloudinary'den SİLİNDİ", !(await cloudinaryAssetExists(publicId)))
  } finally {
    if (postId) await db.post.delete({ where: { id: postId } }).catch(() => {})
    if (await cloudinaryAssetExists(publicId)) {
      const { deleteCloudinaryAssets } = await import("../lib/cloudinary")
      await deleteCloudinaryAssets([publicId])
      console.log("(test görseli temizlendi)")
    }
    await db.$disconnect()
  }
}

main()
  .then(() => {
    console.log(failures === 0 ? "\nTüm kontroller geçti." : `\n${failures} kontrol başarısız.`)
    process.exit(failures === 0 ? 0 : 1)
  })
  .catch((error) => {
    console.error("Hata:", error instanceof Error ? error.message : error)
    process.exit(1)
  })
