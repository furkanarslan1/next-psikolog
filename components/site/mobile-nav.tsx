"use client"

import { HomeIcon, MailIcon, NewspaperIcon, UserRoundIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { isActive } from "@/components/site/site-nav"
import { dict, type Locale } from "@/lib/i18n"

const icons = {
  "/": HomeIcon,
  "/hakkimda": UserRoundIcon,
  "/yazilar": NewspaperIcon,
  "/iletisim": MailIcon,
  "/fr": HomeIcon,
  "/fr/presentation": UserRoundIcon,
  "/fr/publications": NewspaperIcon,
  "/fr/contact": MailIcon,
} as const

export function MobileNav({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  const t = dict[locale]

  return (
    <nav
      aria-label={t.mobileNavAria}
      className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
    >
      <ul className="mx-auto flex max-w-md items-center rounded-full border border-line bg-paper/95 px-2 py-1.5 shadow-[0_8px_24px_-12px_rgba(22,22,21,0.35)] backdrop-blur">
        {t.nav.map((link) => {
          const active = isActive(link, pathname)
          const Icon = icons[link.href as keyof typeof icons]
          return (
            <li key={link.href} className="flex-1">
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-1 rounded-full py-2 font-sans-site text-[11px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                  active ? "text-brand" : "text-ink-soft"
                }`}
              >
                <Icon className="size-5" strokeWidth={active ? 2.25 : 1.75} aria-hidden />
                {link.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
