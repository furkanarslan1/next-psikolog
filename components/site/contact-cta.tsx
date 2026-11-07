"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

// Her sayfanın altında tekrar eden iletişim çağrısı (iletişim sayfasında gizlenir)
export function ContactCta() {
  const pathname = usePathname()
  if (pathname.startsWith("/iletisim")) return null

  return (
    <section aria-labelledby="cta-heading" className="border-t border-line">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-5 px-5 py-16 text-center sm:px-8 sm:py-20">
        <h2
          id="cta-heading"
          className="font-serif-site text-3xl font-normal tracking-tight sm:text-5xl"
        >
          Bana Ulaşın
        </h2>
        <p className="max-w-md text-lg text-ink-soft">Bilgi almak ve randevu için yazın</p>
        <Link
          href="/iletisim"
          className="btn-primary mt-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          İletişim
        </Link>
      </div>
    </section>
  )
}
