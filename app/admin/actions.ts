"use server"

import bcrypt from "bcryptjs"
import { AuthError } from "next-auth"
import { headers } from "next/headers"

import { signIn, signOut } from "@/auth"
import { db } from "@/lib/db"
import {
  clearAttempts,
  isRateLimited,
  recordFailedAttempt,
} from "@/lib/rate-limit"
import { requireAdmin } from "@/lib/require-admin"
import {
  changePasswordSchema,
  loginSchema,
  type ChangePasswordValues,
  type LoginValues,
} from "@/lib/validations/auth"

export async function loginAction(values: LoginValues) {
  const parsed = loginSchema.safeParse(values)
  if (!parsed.success) return { error: "E-posta veya şifre hatalı" }

  const { email, password } = parsed.data
  const ip =
    (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  const keys = [`ip:${ip}`, `email:${email.toLowerCase()}`]

  if (await isRateLimited(keys)) {
    return { error: "Çok fazla deneme yaptınız. Lütfen daha sonra tekrar deneyin." }
  }

  try {
    await signIn("credentials", { email, password, redirect: false })
  } catch (error) {
    if (error instanceof AuthError) {
      await recordFailedAttempt(keys)
      return { error: "E-posta veya şifre hatalı" }
    }
    throw error
  }

  await clearAttempts(keys)
  return { error: undefined }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/admin" })
}

export async function changePasswordAction(values: ChangePasswordValues) {
  const session = await requireAdmin()

  const parsed = changePasswordSchema.safeParse(values)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz bilgi" }
  }

  const keys = [`password:${session.user.id}`]
  if (await isRateLimited(keys)) {
    return { error: "Çok fazla deneme yaptınız. Lütfen daha sonra tekrar deneyin." }
  }

  const admin = await db.admin.findUnique({ where: { id: session.user.id } })
  const valid =
    admin &&
    (await bcrypt.compare(parsed.data.currentPassword, admin.passwordHash))
  if (!admin || !valid) {
    await recordFailedAttempt(keys)
    return { error: "Mevcut şifre hatalı" }
  }

  await db.admin.update({
    where: { id: admin.id },
    data: {
      passwordHash: await bcrypt.hash(parsed.data.newPassword, 12),
      passwordChangedAt: new Date(),
    },
  })
  await clearAttempts(keys)
  return { error: undefined }
}
