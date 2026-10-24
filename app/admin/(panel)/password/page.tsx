import type { Metadata } from "next"

import { ChangePasswordForm } from "@/components/change-password-form"

export const metadata: Metadata = {
  title: "Şifre Değiştir",
  robots: { index: false, follow: false },
}

export default function ChangePasswordPage() {
  return (
    <div className="flex flex-1 items-start justify-center pt-6">
      <ChangePasswordForm />
    </div>
  )
}
