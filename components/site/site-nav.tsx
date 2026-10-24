"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { href: "/hakkimda", label: "Hakkımda", prefixes: ["/hakkimda"] },
  {
    href: "/yazilar",
    label: "Yazılarım",
    prefixes: ["/yazilar", "/blog", "/kategori", "/etiket"],
  },
  { href: "/iletisim", label: "İletişim", prefixes: ["/iletisim"] },
]

export function SiteNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Ana menü" className="flex items-center gap-6 sm:gap-8">
      {links.map((link) => {
        const active = link.prefixes.some((prefix) => pathname.startsWith(prefix))
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`border-b-2 pb-1 text-base transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-anthracite ${
              active
                ? "border-anthracite text-anthracite"
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
