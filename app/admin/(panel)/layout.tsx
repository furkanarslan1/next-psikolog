import { redirect } from "next/navigation"
import { connection } from "next/server"
import { Suspense } from "react"

import { auth } from "@/auth"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

async function AdminShell({ children }: { children: React.ReactNode }) {
  await connection()
  const session = await auth()
  if (!session?.user?.email) redirect("/admin")

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AdminSidebar email={session.user.email} />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={null}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  )
}
