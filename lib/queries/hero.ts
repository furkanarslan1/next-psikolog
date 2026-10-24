import { cacheLife, cacheTag } from "next/cache"

import { cacheTags } from "@/lib/cache-tags"
import { db } from "@/lib/db"

export async function getHero() {
  "use cache"
  cacheLife("days")
  cacheTag(cacheTags.hero)

  return db.hero.findUnique({ where: { id: "main" } })
}
