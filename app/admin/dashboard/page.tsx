import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { logoutAction } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Panel",
  robots: { index: false, follow: false },
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/admin")

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6">
      <p>Hoş geldiniz, {session.user.email}</p>
      <form action={logoutAction}>
        <Button type="submit" variant="outline">
          Çıkış Yap
        </Button>
      </form>
    </div>
  )
}
