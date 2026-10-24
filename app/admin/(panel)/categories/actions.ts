"use server"

import { revalidatePath } from "next/cache"

import { db } from "@/lib/db"
import { invalidateBlog } from "@/lib/cache-tags"
import { requireAdmin } from "@/lib/require-admin"
import { slugify } from "@/lib/slug"
import { categorySchema, type CategoryValues } from "@/lib/validations/post"

export async function createCategoryAction(values: CategoryValues) {
  await requireAdmin()

  const parsed = categorySchema.safeParse(values)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz bilgi" }
  }

  const slug = slugify(parsed.data.name)
  if (!slug) return { error: "Geçerli bir kategori adı girin" }

  const exists = await db.category.findFirst({
    where: { OR: [{ slug }, { name: parsed.data.name }] },
  })
  if (exists) return { error: "Bu kategori zaten var" }

  await db.category.create({ data: { name: parsed.data.name, slug } })
  revalidatePath("/admin/categories")
  return { error: undefined }
}

export async function deleteCategoryAction(id: string) {
  await requireAdmin()

  const postCount = await db.post.count({ where: { categoryId: id } })
  if (postCount > 0) {
    return {
      error: `Bu kategoride ${postCount} yazı var. Önce yazıları başka bir kategoriye taşıyın.`,
    }
  }

  await db.category.deleteMany({ where: { id } })
  revalidatePath("/admin/categories")
  return { error: undefined }
}

export async function renameCategoryAction(id: string, values: CategoryValues) {
  await requireAdmin()

  const parsed = categorySchema.safeParse(values)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz bilgi" }
  }

  const slug = slugify(parsed.data.name)
  if (!slug) return { error: "Geçerli bir kategori adı girin" }

  const exists = await db.category.findFirst({
    where: {
      id: { not: id },
      OR: [{ slug }, { name: parsed.data.name }],
    },
  })
  if (exists) return { error: "Bu kategori zaten var" }

  const existing = await db.category.findUnique({
    where: { id },
    select: { slug: true },
  })
  if (!existing) return { error: "Kategori bulunamadı" }

  await db.category.update({
    where: { id },
    data: { name: parsed.data.name, slug },
  })
  // kategori adı kartlarda, menüde ve yazı sayfalarında görünür
  invalidateBlog({ categorySlugs: [existing.slug, slug] })

  revalidatePath("/admin/categories")
  return { error: undefined }
}
