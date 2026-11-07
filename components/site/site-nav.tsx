"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { counterpart, dict, type Locale } from "@/lib/i18n"

type NavLink = { href: string; label: string; prefixes: string[] }

export function isActive(link: NavLink, pathname: string) {
  return link.href === "/" || link.href === "/fr"
    ? pathname === link.href
    : link.prefixes.some((prefix) => pathname.startsWith(prefix))
}

export function SiteNav({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  const t = dict[locale]

  return (
    <nav aria-label={t.navAria} className="flex items-center gap-6 sm:gap-8">
      {t.nav.map((link) => {
        const active = isActive(link, pathname)
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`label-caps link-slide py-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand ${
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

// TR / FR seçici: köşeleri yuvarlak, düğme görünümlü; karşılığı olmayan sayfada diğer
// dilin ana sayfasına gider (404 yok)
export function LanguageSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  const options: { code: Locale; label: string }[] = [
    { code: "tr", label: "TR" },
    { code: "fr", label: "FR" },
  ]
  const pill = "label-caps rounded-full px-3.5 py-2 leading-none transition-colors"

  return (
    <div
      className="inline-flex items-center gap-0.5 rounded-full border border-line bg-tile p-1"
      role="group"
      aria-label="Langue / Dil"
    >
      {options.map((option) =>
        option.code === locale ? (
          <span key={option.code} aria-current="true" className={`${pill} bg-brand text-on-brand`}>
            {option.label}
          </span>
        ) : (
          <Link
            key={option.code}
            href={counterpart(pathname, option.code)}
            hrefLang={option.code}
            lang={option.code}
            className={`${pill} text-ink hover:bg-paper hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand`}
          >
            {option.label}
          </Link>
        )
      )}
    </div>
  )
}
