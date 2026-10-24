"use server"

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

async function categoryMissing(categoryId: string) {
  if (!categoryId) return false
  return !(await db.category.findUnique({ where: { id: categoryId } }))
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

  if (await categoryMissing(parsed.data.categoryId)) {
    return { error: "Seçilen kategori bulunamadı" }
  }

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

  const existing = await db.post.findUnique({ where: { id } })
  if (!existing) return { error: "Yazı bulunamadı" }

  if (await categoryMissing(parsed.data.categoryId)) {
    return { error: "Seçilen kategori bulunamadı" }
  }

  const { tagLinks, category, ...data } = buildPostData(parsed.data)
  try {
    await db.post.update({
      where: { id },
      data: {
        ...data,
        // yayınlanmamış yazının adresi başlıkla birlikte güncellenir
        slug:
          existing.publishedAt === null && existing.title !== data.title
            ? await uniquePostSlug(data.title, id)
            : existing.slug,
        category: category ?? { disconnect: true },
        // yayın tarihi ilk yayınlanışta atanır, taslağa alınınca korunur
        publishedAt:
          data.status === "PUBLISHED"
            ? (existing.publishedAt ?? new Date())
            : existing.publishedAt,
        tags: { set: [], connectOrCreate: tagLinks },
      },
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
  await db.post.deleteMany({ where: { id } })
  // kullanılmayan etiketleri temizle
  await db.tag.deleteMany({ where: { posts: { none: {} } } })
}

export async function getUploadSignatureAction() {
  await requireAdmin()
  const signature = createUploadSignature()
  if (!signature) return { error: "Cloudinary ayarları eksik" }
  return { error: undefined, ...signature }
}
