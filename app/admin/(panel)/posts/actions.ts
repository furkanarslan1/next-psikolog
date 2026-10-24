"use server"

import { invalidateBlog } from "@/lib/cache-tags"
import { createUploadSignature } from "@/lib/cloudinary"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/require-admin"
import { sanitizeContent } from "@/lib/sanitize"
import { slugify } from "@/lib/slug"
import { uniquePostSlug } from "@/lib/unique-slug"
import { postSchema, type PostValues } from "@/lib/validations/post"

function isUniqueViolation(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  )
}

// Seçilen kategori yoksa null, seçilmediyse undefined döner.
async function findCategory(categoryId: string) {
  if (!categoryId) return undefined
  return db.category.findUnique({
    where: { id: categoryId },
    select: { slug: true },
  })
}

function buildPostData(values: PostValues) {
  const tagMap = new Map<string, string>()
  for (const name of values.tags) {
    const slug = slugify(name)
    if (slug) tagMap.set(slug, name)
  }

  return {
    title: values.title,
    excerpt: values.excerpt,
    content: sanitizeContent(values.content),
    coverImageUrl: values.coverImageUrl || null,
    coverImageAlt: values.coverImageAlt || null,
    status: values.status,
    metaTitle: values.metaTitle || null,
    metaDescription: values.metaDescription || null,
    category: values.categoryId
      ? { connect: { id: values.categoryId } }
      : undefined,
    tagLinks: [...tagMap].map(([slug, name]) => ({
      where: { slug },
      create: { name, slug },
    })),
  }
}

export async function createPostAction(values: PostValues) {
  await requireAdmin()

  const parsed = postSchema.safeParse(values)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz bilgi" }
  }

  const category = await findCategory(parsed.data.categoryId)
  if (category === null) return { error: "Seçilen kategori bulunamadı" }

  const { tagLinks, ...data } = buildPostData(parsed.data)
  try {
    const post = await db.post.create({
      data: {
        ...data,
        slug: await uniquePostSlug(data.title),
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,
        tags: { connectOrCreate: tagLinks },
      },
    })
    invalidateBlog({
      postSlugs: [post.slug],
      categorySlugs: [category?.slug],
      tagSlugs: tagLinks.map((tag) => tag.where.slug),
    })
    return { error: undefined, id: post.id }
  } catch (error) {
    if (isUniqueViolation(error)) {
      return { error: "Yazı kaydedilemedi, lütfen tekrar deneyin" }
    }
    throw error
  }
}

export async function updatePostAction(id: string, values: PostValues) {
  await requireAdmin()

  const parsed = postSchema.safeParse(values)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz bilgi" }
  }

  const existing = await db.post.findUnique({
    where: { id },
    include: { category: { select: { slug: true } }, tags: { select: { slug: true } } },
  })
  if (!existing) return { error: "Yazı bulunamadı" }

  const nextCategory = await findCategory(parsed.data.categoryId)
  if (nextCategory === null) return { error: "Seçilen kategori bulunamadı" }

  const { tagLinks, category, ...data } = buildPostData(parsed.data)
  const slug =
    existing.publishedAt === null && existing.title !== data.title
      ? await uniquePostSlug(data.title, id)
      : existing.slug
  try {
    await db.post.update({
      where: { id },
      data: {
        ...data,
        // yayınlanmamış yazının adresi başlıkla birlikte güncellenir
        slug,
        category: category ?? { disconnect: true },
        // yayın tarihi ilk yayınlanışta atanır, taslağa alınınca korunur
        publishedAt:
          data.status === "PUBLISHED"
            ? (existing.publishedAt ?? new Date())
            : existing.publishedAt,
        tags: { set: [], connectOrCreate: tagLinks },
      },
    })
    // eski ve yeni değerlerin ikisi de etkilenir
    invalidateBlog({
      postSlugs: [existing.slug, slug],
      categorySlugs: [existing.category?.slug, nextCategory?.slug],
      tagSlugs: [
        ...existing.tags.map((tag) => tag.slug),
        ...tagLinks.map((tag) => tag.where.slug),
      ],
    })
    return { error: undefined, id }
  } catch (error) {
    if (isUniqueViolation(error)) {
      return { error: "Yazı kaydedilemedi, lütfen tekrar deneyin" }
    }
    throw error
  }
}

export async function deletePostAction(id: string) {
  await requireAdmin()
  const existing = await db.post.findUnique({
    where: { id },
    include: { category: { select: { slug: true } }, tags: { select: { slug: true } } },
  })
  if (!existing) return

  await db.post.delete({ where: { id } })
  // kullanılmayan etiketleri temizle
  await db.tag.deleteMany({ where: { posts: { none: {} } } })
  invalidateBlog({
    postSlugs: [existing.slug],
    categorySlugs: [existing.category?.slug],
    tagSlugs: existing.tags.map((tag) => tag.slug),
  })
}

export async function getUploadSignatureAction() {
  await requireAdmin()
  const signature = createUploadSignature()
  if (!signature) return { error: "Cloudinary ayarları eksik" }
  return { error: undefined, ...signature }
}
