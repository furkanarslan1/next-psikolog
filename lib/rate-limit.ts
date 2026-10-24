import { db } from "@/lib/db"

const WINDOW_MS = 15 * 60 * 1000
const MAX_FAILED_ATTEMPTS = 5

export async function isRateLimited(keys: string[]) {
  const since = new Date(Date.now() - WINDOW_MS)
  const counts = await Promise.all(
    keys.map((key) =>
      db.loginAttempt.count({ where: { key, createdAt: { gte: since } } })
    )
  )
  return counts.some((count) => count >= MAX_FAILED_ATTEMPTS)
}

export async function recordFailedAttempt(keys: string[]) {
  // süresi dolan kayıtları burada da temizle, tablo saldırı altında şişmesin
  await db.loginAttempt.deleteMany({
    where: { createdAt: { lt: new Date(Date.now() - WINDOW_MS) } },
  })
  await db.loginAttempt.createMany({ data: keys.map((key) => ({ key })) })
}

export async function clearAttempts(keys: string[]) {
  await db.loginAttempt.deleteMany({ where: { key: { in: keys } } })
}
