"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { href: "/", label: "Yazılarım" },
  { href: "/iletisim", label: "İletişim" },
]

export function SiteNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Ana menü" className="flex items-center gap-6 sm:gap-8">
      {links.map((link) => {
        const active =
          link.href === "/"
            ? pathname === "/" ||
              pathname.startsWith("/blog") ||
              pathname.startsWith("/kategori") ||
              pathname.startsWith("/etiket")
            : pathname.startsWith(link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`border-b-2 pb-1 text-base transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-copper ${
              active
                ? "border-copper text-ink"
                : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
