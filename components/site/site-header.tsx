import Link from "next/link"
import { Suspense } from "react"

import { SiteNav } from "@/components/site/site-nav"
import { SocialIconButtons, socialItems } from "@/components/site/social-links"
import { getContact } from "@/lib/queries/contact"
import { siteConfig } from "@/lib/site"

async function HeaderSocial() {
  return <SocialIconButtons items={socialItems(await getContact())} variant="light" />
}

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-5 py-3 sm:px-8 md:justify-between">
        <Link
          href="/"
          aria-label={`${siteConfig.name}, ana sayfa`}
          className="flex size-11 items-center justify-center border-2 border-anthracite font-serif-site text-xl leading-none font-medium tracking-wide focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-anthracite"
        >
          EA
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <SiteNav />
          <Suspense fallback={null}>
            <HeaderSocial />
          </Suspense>
        </div>
      </div>
    </header>
  )
}
