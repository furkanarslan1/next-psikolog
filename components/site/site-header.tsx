import Link from "next/link"

import { LanguageSwitch, SiteNav } from "@/components/site/site-nav"
import { dict, type Locale } from "@/lib/i18n"
import { siteConfig } from "@/lib/site"

export function SiteHeader({ locale }: { locale: Locale }) {
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex min-h-[4.5rem] w-full max-w-6xl items-center justify-between gap-x-6 px-5 py-3 sm:px-8">
        <Link
          href={dict[locale].home}
          className="group flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-anthracite"
        >
          <span
            aria-hidden
            className="flex size-11 shrink-0 items-center justify-center rounded-full border-[1.5px] border-anthracite font-serif-site text-lg leading-none font-medium tracking-wide transition-colors group-hover:border-brand group-hover:text-brand"
          >
            EA
          </span>
          <span className="font-serif-site text-xl leading-none tracking-tight sm:text-2xl">
            {siteConfig.name}
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
