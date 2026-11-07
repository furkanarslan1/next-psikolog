import { EB_Garamond, Instrument_Sans } from "next/font/google"
import type { ReactNode } from "react"

import { ContactCta } from "@/components/site/contact-cta"
import { MobileNav } from "@/components/site/mobile-nav"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { dict, type Locale } from "@/lib/i18n"

const garamond = EB_Garamond({
  subsets: ["latin", "latin-ext"],
  variable: "--font-garamond",
  style: ["normal"],
})

// İtalik ayrı bir aile ve önden yüklenmez: yalnızca italik metin olan sayfalarda iner
// (performans: her sayfada ~100 KB'lık iki italik dosya yüklenmesin). Kullanım: globals.css
const garamondItalic = EB_Garamond({
  subsets: ["latin", "latin-ext"],
  variable: "--font-garamond-italic",
  style: ["italic"],
  preload: false,
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
      className={`${garamond.variable} ${garamondItalic.variable} ${instrumentSans.variable} site flex min-h-svh flex-col bg-paper font-serif-site text-ink`}
    >
      <a
        href="#icerik"
        className="label-caps sr-only z-50 bg-paper px-4 py-3 text-brand focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:outline-2 focus:outline-brand"
      >
        {dict[locale].skip}
      </a>
      <SiteHeader locale={locale} />
      <main id="icerik" className="flex-1">
        {children}
      </main>
      <ContactCta locale={locale} />
      <SiteFooter locale={locale} />
      <MobileNav locale={locale} />
    </div>
  )
}
