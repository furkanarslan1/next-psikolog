// Kullanım:
//   pnpm seed-posts /tam/yol/gorsel.jpg   -> 15 test yazısı oluşturur
//   pnpm seed-posts --remove              -> test yazılarını ve görselini siler
// Hepsi aynı başlık, özet, içerik ve aynı kapak görselini kullanır.
import { loadEnvConfig } from "@next/env"
import { readFile } from "node:fs/promises"
import { basename, extname } from "node:path"

loadEnvConfig(process.cwd())

const COUNT = 15
const TITLE = "Lorem Ipsum Dolor Sit Amet"
const EXCERPT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
const CONTENT = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><h2>Duis aute irure dolor</h2><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`
const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
}

async function main() {
  const { db } = await import("../lib/db")
  const { createUploadSignature } = await import("../lib/cloudinary")
  const { publicIdFromUrl } = await import("../lib/cloudinary-url")
  const { deleteIfUnreferenced, postImageIds } = await import("../lib/media")
  const { uniquePostSlug } = await import("../lib/unique-slug")
  const { sanitizeContent } = await import("../lib/sanitize")

  const arg = process.argv[2]

  if (arg === "--remove") {
    const posts = await db.post.findMany({
      where: { title: TITLE, excerpt: EXCERPT },
      select: { id: true, coverImageUrl: true, content: true },
    })
    const imageIds = new Set<string>()
    for (const post of posts) for (const id of postImageIds(post)) imageIds.add(id)

    await db.post.deleteMany({ where: { id: { in: posts.map((post) => post.id) } } })
    await db.tag.deleteMany({ where: { posts: { none: {} } } })
    const deleted = await deleteIfUnreferenced(imageIds)
    console.log(`${posts.length} test yazısı silindi, ${deleted} görsel Cloudinary'den silindi.`)
    await db.$disconnect()
    return
  }

  if (!arg) throw new Error("Görsel yolunu verin: pnpm seed-posts /yol/gorsel.jpg")
  const mime = MIME[extname(arg).toLowerCase()]
  if (!mime) throw new Error("Yalnızca .jpg, .jpeg, .png veya .webp desteklenir")

  // görseli bir kez yükle (tarayıcıdaki imzalı yüklemeyle aynı parametreler)
  const signed = createUploadSignature()
  if (!signed) throw new Error("Cloudinary ayarları eksik (CLOUDINARY_URL)")
  const body = new FormData()
  body.append("file", new Blob([await readFile(arg)], { type: mime }), basename(arg))
  body.append("api_key", signed.apiKey)
  body.append("timestamp", String(signed.timestamp))
  body.append("signature", signed.signature)
  body.append("folder", signed.folder)
  body.append("allowed_formats", signed.allowed_formats)
  body.append("transformation", signed.transformation)
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`,
    { method: "POST", body }
  )
  if (!response.ok) throw new Error(`Yükleme başarısız: ${await response.text()}`)
  const { secure_url: imageUrl } = (await response.json()) as { secure_url: string }
  console.log("Görsel yüklendi:", publicIdFromUrl(imageUrl))

  const category =
    (await db.category.findFirst({ orderBy: { createdAt: "asc" } })) ??
    (await db.category.create({ data: { name: "Genel", slug: "genel" } }))

  for (let index = 0; index < COUNT; index++) {
    await db.post.create({
      data: {
        title: TITLE,
        slug: await uniquePostSlug(TITLE),
        excerpt: EXCERPT,
        content: sanitizeContent(CONTENT),
        coverImageUrl: imageUrl,
        coverImageAlt: "Lorem ipsum görseli",
        status: "PUBLISHED",
        // yeniden eskiye: her yazı bir gün öncesinde yayınlanmış görünür
        publishedAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000),
        category: { connect: { id: category.id } },
        tags: {
          connectOrCreate: ["lorem", "ipsum"].map((name) => ({
            where: { slug: name },
            create: { name, slug: name },
          })),
        },
      },
    })
  }
  console.log(`${COUNT} test yazısı oluşturuldu (kategori: ${category.name}).`)
  await db.$disconnect()
}

main().catch((error) => {
  console.error("Hata:", error instanceof Error ? error.message : error)
  process.exit(1)
})
