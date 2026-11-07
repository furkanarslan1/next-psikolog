"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

// Menü dört sayfa: masaüstü başlığı ve mobil alt menü aynı listeyi kullanır
export const navLinks = [
  { href: "/", label: "Anasayfa", prefixes: [] as string[] },
  { href: "/hakkimda", label: "Hakkımda", prefixes: ["/hakkimda"] },
  {
    href: "/yazilar",
    label: "Yazılar",
    prefixes: ["/yazilar", "/blog", "/kategori", "/etiket"],
  },
  { href: "/iletisim", label: "İletişim", prefixes: ["/iletisim"] },
]

export function isActive(link: (typeof navLinks)[number], pathname: string) {
  return link.href === "/"
    ? pathname === "/"
    : link.prefixes.some((prefix) => pathname.startsWith(prefix))
}

export function SiteNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Ana menü" className="flex items-center gap-6 sm:gap-8">
      {navLinks.map((link) => {
        const active = isActive(link, pathname)
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`label-caps py-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand ${
              active ? "text-brand" : "text-ink hover:text-brand"
            }`}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
