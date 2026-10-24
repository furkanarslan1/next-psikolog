"use server"

import { AuthError } from "next-auth"
import { headers } from "next/headers"

import { signIn, signOut } from "@/auth"
import {
  clearAttempts,
  isRateLimited,
  recordFailedAttempt,
} from "@/lib/rate-limit"
import { loginSchema, type LoginValues } from "@/lib/validations/auth"

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
