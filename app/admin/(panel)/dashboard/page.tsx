import type { Metadata } from "next"

import { CleanupMediaCard } from "@/components/cleanup-media-card"

export const metadata: Metadata = {
  title: "Panel",
  robots: { index: false, follow: false },
}

export default function DashboardPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold">Panel</h1>
      <p className="text-muted-foreground">
        Blog yazılarını buradan yöneteceksiniz.
      </p>
      <CleanupMediaCard />
    </>
  )
}
