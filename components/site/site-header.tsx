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
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-5 py-3 sm:px-8 md:justify-between">
        <Link
          href="/"
          className="border-[3px] border-anthracite px-3 py-1 font-serif-site text-xl font-medium tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-anthracite"
        >
          {siteConfig.name}
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
