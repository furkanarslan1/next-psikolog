import { db } from "@/lib/db"
import { slugify } from "@/lib/slug"

// Başlıktan benzersiz slug üretir: aynısı varsa sonuna -2, -3 ... ekler.
export async function uniquePostSlug(title: string, excludeId?: string) {
  const base = slugify(title) || "yazi"
  const taken = await db.post.findMany({
    where: {
      slug: { startsWith: base },
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    select: { slug: true },
  })
  const used = new Set(taken.map((post) => post.slug))
  if (!used.has(base)) return base

  for (let n = 2; ; n++) {
    const candidate = `${base}-${n}`
    if (!used.has(candidate)) return candidate
  }
}
