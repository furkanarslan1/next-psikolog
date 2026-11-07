// Kullanım:
//   pnpm seed-posts           -> 15 test yazısı oluşturur
//   pnpm seed-posts --remove  -> test yazılarını siler
// Hepsi aynı başlık, özet ve içeriği kullanır.
import { loadEnvConfig } from "@next/env"

loadEnvConfig(process.cwd())

const COUNT = 15
const TITLE = "Lorem Ipsum Dolor Sit Amet"
const EXCERPT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
const CONTENT = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><h2>Duis aute irure dolor</h2><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`
async function main() {
  const { db } = await import("../lib/db")
  const { uniquePostSlug } = await import("../lib/unique-slug")
  const { sanitizeContent } = await import("../lib/sanitize")

  if (process.argv[2] === "--remove") {
    const { count } = await db.post.deleteMany({
      where: { title: TITLE, excerpt: EXCERPT },
    })
    console.log(`${count} test yazısı silindi.`)
    await db.$disconnect()
    return
  }

  for (let index = 0; index < COUNT; index++) {
    // her üçüncü kayıt çeviri
    const translation = index % 3 === 2
    await db.post.create({
      data: {
        type: translation ? "CEVIRI" : "YAZI",
        title: TITLE,
        slug: await uniquePostSlug(TITLE),
        excerpt: EXCERPT,
        content: sanitizeContent(CONTENT),
        ...(translation
          ? { originalAuthor: "Lorem Ipsum", originalTitle: "Dolor sit amet", originalLang: "Fransızca" }
          : {}),
        status: "PUBLISHED",
        // yeniden eskiye: her yazı bir gün öncesinde yayınlanmış görünür
        publishedAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000),
      },
    })
  }
  console.log(`${COUNT} test kaydı oluşturuldu.`)
  await db.$disconnect()
}

main().catch((error) => {
  console.error("Hata:", error instanceof Error ? error.message : error)
  process.exit(1)
})
