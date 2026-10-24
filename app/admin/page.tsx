import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { connection } from "next/server"
import { Suspense } from "react"

import { auth } from "@/auth"
import { LoginForm } from "@/components/login-form"

export const metadata: Metadata = {
  title: "Yönetici Girişi",
  robots: { index: false, follow: false },
}

async function RedirectIfSignedIn() {
  await connection()
  if (await auth()) redirect("/admin/dashboard")
  return null
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
      <Suspense fallback={null}>
        <RedirectIfSignedIn />
      </Suspense>
    </div>
  )
}
