"use server"

import { invalidateBlog } from "@/lib/cache-tags"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/require-admin"
import { sanitizeContent } from "@/lib/sanitize"
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

function buildPostData(values: PostValues) {
  const translation = values.type === "CEVIRI"
  return {
    type: values.type,
    lang: values.lang,
    title: values.title,
    excerpt: values.excerpt,
    // yalnızca özet gösterilecekse gövde saklanmaz
    content: values.fullText ? sanitizeContent(values.content) : "",
    fullText: values.fullText,
    featured: values.featured,
    publishedIn: values.publishedIn || null,
    // çeviriye özel alanlar yazıda boş kalır
    originalAuthor: translation ? values.originalAuthor || null : null,
    originalTitle: translation ? values.originalTitle || null : null,
    originalLang: translation ? values.originalLang || null : null,
    sourceCitation: translation ? values.sourceCitation || null : null,
    sourceUrl: values.sourceUrl || null,
    status: values.status,
    metaTitle: values.metaTitle || null,
    metaDescription: values.metaDescription || null,
  }
}

export async function createPostAction(values: PostValues) {
  await requireAdmin()

  const parsed = postSchema.safeParse(values)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz bilgi" }
  }

  const data = buildPostData(parsed.data)
  try {
    const post = await db.post.create({
      data: {
        ...data,
        slug: await uniquePostSlug(data.title),
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      },
    })
    invalidateBlog({ postSlugs: [post.slug] })
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

  const data = buildPostData(parsed.data)
  // yayınlanmamış yazının adresi başlıkla birlikte güncellenir
  const slug =
    existing.publishedAt === null && existing.title !== data.title
      ? await uniquePostSlug(data.title, id)
      : existing.slug
  try {
    await db.post.update({
      where: { id },
      data: {
        ...data,
        slug,
        // yayın tarihi ilk yayınlanışta atanır, taslağa alınınca korunur
        publishedAt:
          data.status === "PUBLISHED"
            ? (existing.publishedAt ?? new Date())
            : existing.publishedAt,
      },
    })
    invalidateBlog({ postSlugs: [existing.slug, slug] })
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
  const existing = await db.post.findUnique({ where: { id } })
  if (!existing) return

  await db.post.delete({ where: { id } })
  invalidateBlog({ postSlugs: [existing.slug] })
}
