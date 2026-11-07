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

// TR / FR seçici: sayfanın karşılığı yoksa diğer dilin ana sayfasına götürür (404 yok)
export function LanguageSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  const options: { code: Locale; label: string }[] = [
    { code: "tr", label: "TR" },
    { code: "fr", label: "FR" },
  ]

  return (
    <div className="label-caps flex items-center gap-2" role="group" aria-label="Langue / Dil">
      {options.map((option, index) => (
        <span key={option.code} className="flex items-center gap-2">
          {index > 0 && <span aria-hidden className="text-ink-soft">/</span>}
          {option.code === locale ? (
            <span aria-current="true" className="text-brand">
              {option.label}
            </span>
          ) : (
            <Link
              href={counterpart(pathname, option.code)}
              hrefLang={option.code}
              lang={option.code}
              className="text-ink transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            >
              {option.label}
            </Link>
          )}
        </span>
      ))}
    </div>
  )
}
