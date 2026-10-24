import Link from "next/link"

import { SiteNav } from "@/components/site/site-nav"
import { siteConfig } from "@/lib/site"

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-3 sm:px-8">
        <Link
          href="/"
          className="font-serif-site text-xl font-medium tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-copper"
        >
          {siteConfig.name}
        </Link>
        <SiteNav />
      </div>
    </header>
  )
}
