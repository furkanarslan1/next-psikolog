import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { ChangePasswordForm } from "@/components/change-password-form"

export const metadata: Metadata = {
  title: "Şifre Değiştir",
  robots: { index: false, follow: false },
}

export default async function ChangePasswordPage() {
  if (!(await auth())) redirect("/admin")

  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center gap-4 p-6 md:p-10">
      <ChangePasswordForm />
      <Link
        href="/admin/dashboard"
        className="text-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        Panele dön
      </Link>
    </div>
  )
}
