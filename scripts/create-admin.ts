// Kullanım: pnpm create-admin  (e-posta ve şifre sorulur)
// Admin zaten varsa şifresi güncellenir.
import { loadEnvConfig } from "@next/env"
import bcrypt from "bcryptjs"
import { createInterface } from "node:readline/promises"

loadEnvConfig(process.cwd())

async function main() {
  const { db } = await import("../lib/db")
  const rl = createInterface({ input: process.stdin, output: process.stdout })

  const email = (await rl.question("Admin e-posta: ")).trim().toLowerCase()
  const password = await rl.question("Şifre (min 12 karakter): ")
  rl.close()

  if (!email.includes("@") || password.length < 12) {
    throw new Error("Geçersiz e-posta veya şifre çok kısa")
  }

  const passwordHash = await bcrypt.hash(password, 12)
  await db.admin.deleteMany({ where: { email: { not: email } } })
  await db.admin.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  })
  console.log("Admin hazır:", email)
  await db.$disconnect()
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
