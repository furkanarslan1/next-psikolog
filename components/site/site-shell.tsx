import { EB_Garamond, Instrument_Sans } from "next/font/google"
import type { ReactNode } from "react"

import { ContactCta } from "@/components/site/contact-cta"
import { MobileNav } from "@/components/site/mobile-nav"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import type { Locale } from "@/lib/i18n"

const garamond = EB_Garamond({
  subsets: ["latin", "latin-ext"],
  variable: "--font-garamond",
  style: ["normal", "italic"],
})

const instrumentSans = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-instrument",
})

// Türkçe ve Fransızca sitenin ortak iskeleti. Kök <html lang="tr"> sabittir;
// sayfa dili bu sarmalayıcıdaki lang özniteliğiyle belirtilir.
export function SiteShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <div
      lang={locale}
      className={`${garamond.variable} ${instrumentSans.variable} site flex min-h-svh flex-col bg-paper font-serif-site text-ink`}
    >
      <SiteHeader locale={locale} />
      <main className="flex-1">{children}</main>
      <ContactCta locale={locale} />
      <SiteFooter locale={locale} />
      <MobileNav locale={locale} />
    </div>
  )
}
