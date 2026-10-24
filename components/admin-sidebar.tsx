"use client"

import { FileTextIcon, KeyRoundIcon, LayoutDashboardIcon, LogOutIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

import { logoutAction } from "@/app/admin/actions"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navigation = [
  {
    label: "Genel",
    items: [
      { title: "Panel", url: "/admin/dashboard", icon: LayoutDashboardIcon },
      { title: "Blog yazıları", url: "/admin/posts", icon: FileTextIcon },
    ],
  },
  {
    label: "Hesap",
    items: [
      { title: "Şifre değiştir", url: "/admin/password", icon: KeyRoundIcon },
    ],
  },
]

export function AdminSidebar({
  email,
  ...props
}: React.ComponentProps<typeof Sidebar> & { email: string }) {
  const pathname = usePathname()

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/admin/dashboard" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <LayoutDashboardIcon className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium">Yönetim Paneli</span>
                <span className="truncate text-xs text-muted-foreground">{email}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {navigation.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    isActive={pathname.startsWith(item.url)}
                    render={<Link href={item.url} />}
                  >
                    <item.icon />
                    {item.title}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <form action={logoutAction}>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton type="submit">
                <LogOutIcon />
                Çıkış yap
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </form>
      </SidebarFooter>
    </Sidebar>
  )
}
