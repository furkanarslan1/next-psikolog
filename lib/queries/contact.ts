import { cacheLife, cacheTag } from "next/cache"

import { cacheTags } from "@/lib/cache-tags"
import { db } from "@/lib/db"

export async function getContact() {
  "use cache"
  cacheLife("days")
  cacheTag(cacheTags.contact)

  return db.contact.findUnique({ where: { id: "main" } })
}

export type ContactData = NonNullable<Awaited<ReturnType<typeof getContact>>>
