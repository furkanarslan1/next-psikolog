"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Rings } from "@/components/site/rings"
import { dict, type Locale } from "@/lib/i18n"

// Her sayfanın altında tekrar eden iletişim çağrısı (iletişim sayfasında gizlenir)
export function ContactCta({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  const t = dict[locale].cta
  if (pathname.startsWith(t.hideOn)) return null

  return (
    <section
      aria-labelledby="cta-heading"
      className="relative overflow-hidden border-t border-line bg-tile"
    >
      <Rings
        disc="paper"
        className="absolute -bottom-32 -left-40 w-[26rem] opacity-70 sm:-left-24 sm:w-[30rem] lg:left-8"
      />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-5 px-5 py-16 text-center sm:px-8 sm:py-24">
        <h2
          id="cta-heading"
          className="font-serif-site text-3xl font-normal tracking-tight sm:text-5xl"
        >
          {t.title}
        </h2>
        <p className="max-w-md text-lg text-ink-soft">{t.text}</p>
        <Link
          href={t.hideOn}
          className="btn-primary mt-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          {t.button}
        </Link>
      </div>
    </section>
  )
}
