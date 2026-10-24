import Link from "next/link"

import { siteConfig } from "@/lib/site"

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center px-5 sm:px-8">
        <Link
          href="/"
          className="font-serif-site text-xl font-medium tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-copper"
        >
          {siteConfig.name}
        </Link>
      </div>
    </header>
  )
}
