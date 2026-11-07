import Link from "next/link"

import { LanguageSwitch, SiteNav } from "@/components/site/site-nav"
import { ThemeToggle } from "@/components/site/theme-toggle"
import { dict, type Locale } from "@/lib/i18n"
import { siteConfig } from "@/lib/site"

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = dict[locale]

  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex min-h-[4.5rem] w-full max-w-6xl items-center justify-between gap-x-6 px-5 py-3 sm:px-8">
        {/* logo: yalnızca ad ve sonunda küçük bir vurgu noktası */}
        <Link
          href={t.home}
          className="group flex items-baseline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          <span className="font-serif-site text-2xl leading-none tracking-[-0.015em] sm:text-[1.75rem]">
            {siteConfig.name}
          </span>
          <span
            aria-hidden
            className="ml-[3px] inline-block size-[7px] rounded-full bg-brand transition-transform duration-300 group-hover:scale-150"
          />
        </Link>
        <div className="flex items-center gap-6 lg:gap-8">
          <div className="hidden md:block">
            <SiteNav locale={locale} />
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitch locale={locale} />
            <ThemeToggle locale={locale} />
          </div>
        </div>
      </div>
    </header>
  )
}
