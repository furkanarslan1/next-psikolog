"use server"

import { invalidateAbout } from "@/lib/cache-tags"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/require-admin"
import { sanitizeContent } from "@/lib/sanitize"
import { aboutSchema, type AboutValues } from "@/lib/validations/about"

const isEmptyHtml = (html: string) => html.replace(/<[^>]*>/g, "").trim().length === 0

export async function saveAboutAction(values: AboutValues) {
  await requireAdmin()

  const parsed = aboutSchema.safeParse(values)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz bilgi" }
  }

  const data = {
    content: sanitizeContent(parsed.data.content),
    contentFr: isEmptyHtml(parsed.data.contentFr)
      ? null
      : sanitizeContent(parsed.data.contentFr),
  }
  await db.about.upsert({
    where: { id: "main" },
    update: data,
    create: { id: "main", ...data },
  })

  invalidateAbout()
  return { error: undefined }
}
