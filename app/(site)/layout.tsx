import { EB_Garamond, Instrument_Sans } from "next/font/google"

import { MobileNav } from "@/components/site/mobile-nav"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"

const garamond = EB_Garamond({
  subsets: ["latin", "latin-ext"],
  variable: "--font-garamond",
  style: ["normal", "italic"],
})

const instrumentSans = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-instrument",
})

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${garamond.variable} ${instrumentSans.variable} site flex min-h-svh flex-col bg-paper font-serif-site text-ink`}
    >
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <MobileNav />
    </div>
  )
}
