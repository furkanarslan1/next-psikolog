// Kullanım:
//   pnpm seed-categories           -> 9 test kategorisi ekler, test yazılarını bunlara dağıtır
//   pnpm seed-categories --remove  -> test kategorilerini siler, yazıları ilk kategoriye döndürür
// Yalnızca "Lorem Ipsum Dolor Sit Amet" test yazılarına dokunur (seed-posts ile aynı).
import { loadEnvConfig } from "@next/env"

loadEnvConfig(process.cwd())

const TITLE = "Lorem Ipsum Dolor Sit Amet"
const NAMES = [
  "Depresyon",
  "İlişkiler",
  "Çocuk ve Ergen",
  "Stres Yönetimi",
  "Travma",
  "Özgüven",
  "Aile Danışmanlığı",
  "Panik Atak",
  "Yas ve Kayıp",
]

async function main() {
  const { db } = await import("../lib/db")
  const { slugify } = await import("../lib/slug")

  const posts = await db.post.findMany({
    where: { title: TITLE },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  })

  if (process.argv[2] === "--remove") {
    const base = await db.category.findFirst({
      where: { name: { notIn: NAMES } },
      orderBy: { createdAt: "asc" },
    })
    if (base) {
      await db.post.updateMany({
        where: { title: TITLE },
        data: { categoryId: base.id },
      })
    }
    const removed = await db.category.deleteMany({
      where: { name: { in: NAMES }, posts: { none: {} } },
    })
    console.log(`${removed.count} test kategorisi silindi.`)
    return
  }

  const categories = []
  for (const name of NAMES) {
    categories.push(
      await db.category.upsert({
        where: { name },
        update: {},
        create: { name, slug: slugify(name) },
      })
    )
  }
  for (const [index, post] of posts.entries()) {
    await db.post.update({
      where: { id: post.id },
      data: { categoryId: categories[index % categories.length].id },
    })
  }
  console.log(`${categories.length} kategori hazır, ${posts.length} test yazısı dağıtıldı.`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
