import Link from "next/link"

import { SiteNav } from "@/components/site/site-nav"
import { siteConfig } from "@/lib/site"

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-x-6 px-5 py-3 sm:px-8">
        <Link
          href="/"
          aria-label={`${siteConfig.name}, ana sayfa`}
          className="flex size-11 items-center justify-center rounded-full border-[1.5px] border-anthracite font-serif-site text-lg leading-none font-medium tracking-wide focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-anthracite"
        >
          EA
        </Link>
        <div className="hidden md:block">
          <SiteNav />
        </div>
      </div>
    </header>
  )
}
