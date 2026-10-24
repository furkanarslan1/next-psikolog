import { cacheLife, cacheTag } from "next/cache"

import { cacheTags } from "@/lib/cache-tags"
import { db } from "@/lib/db"

export async function getAbout() {
  "use cache"
  cacheLife("days")
  cacheTag(cacheTags.about)

  return db.about.findUnique({ where: { id: "main" } })
}

export type AboutData = NonNullable<Awaited<ReturnType<typeof getAbout>>>
