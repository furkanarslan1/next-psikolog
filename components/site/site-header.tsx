import Link from "next/link"

import { LanguageSwitch, SiteNav } from "@/components/site/site-nav"
import { dict, type Locale } from "@/lib/i18n"
import { siteConfig } from "@/lib/site"

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = dict[locale]

  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex min-h-[4.5rem] w-full max-w-6xl items-center justify-between gap-x-6 px-5 py-3 sm:px-8">
        <Link
          href={t.home}
          className="group flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          {/* dolgulu, yuvarlak köşeli rozet; adın altında küçük unvan satırı */}
          <span
            aria-hidden
            className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand font-serif-site text-lg leading-none font-medium tracking-wide text-on-brand transition-transform duration-300 group-hover:-rotate-6"
          >
            EA
          </span>
          <span className="flex flex-col">
            <span className="font-serif-site text-xl leading-none tracking-tight sm:text-2xl">
              {siteConfig.name}
            </span>
            <span className="label-caps mt-1.5 text-[0.625rem] leading-none text-ink-soft">
              {t.role}
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-6 lg:gap-8">
          <div className="hidden md:block">
            <SiteNav locale={locale} />
          </div>
          <LanguageSwitch locale={locale} />
        </div>
      </div>
    </header>
  )
}
