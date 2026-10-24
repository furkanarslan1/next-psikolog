"use server"

import { invalidateContact } from "@/lib/cache-tags"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/require-admin"
import { contactSchema, type ContactValues } from "@/lib/validations/contact"

export async function saveContactAction(values: ContactValues) {
  await requireAdmin()

  const parsed = contactSchema.safeParse(values)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz bilgi" }
  }

  const data = {
    email: parsed.data.email || null,
    phone: parsed.data.phone || null,
    whatsapp: parsed.data.whatsapp || null,
    address: parsed.data.address || null,
  }
  await db.contact.upsert({
    where: { id: "main" },
    update: data,
    create: { id: "main", ...data },
  })

  invalidateContact()
  return { error: undefined }
}
