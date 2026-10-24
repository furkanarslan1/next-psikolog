import { Instrument_Sans, Newsreader } from "next/font/google"
import { Suspense } from "react"

import { MobileNav } from "@/components/site/mobile-nav"
import { MobileNavLoader } from "@/components/site/mobile-nav-loader"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"

const newsreader = Newsreader({
  subsets: ["latin", "latin-ext"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
})

const instrumentSans = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-instrument",
})

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${newsreader.variable} ${instrumentSans.variable} site flex min-h-svh flex-col bg-paper pb-24 md:pb-0 font-sans-site text-ink`}
    >
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <Suspense fallback={<MobileNav appointmentHref="/iletisim" external={false} />}>
        <MobileNavLoader />
      </Suspense>
    </div>
  )
}
