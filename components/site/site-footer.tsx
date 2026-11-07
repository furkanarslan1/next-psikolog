import { cacheLife } from "next/cache"
import Link from "next/link"
import { Suspense } from "react"

import { contactItems } from "@/components/site/contact-items"
import { SocialIconButtons, socialItems } from "@/components/site/social-links"
import { getContact } from "@/lib/queries/contact"
import { siteConfig } from "@/lib/site"

const links = [
  { href: "/", label: "Anasayfa" },
  { href: "/hakkimda", label: "Hakkımda" },
  { href: "/yazilar", label: "Yazılarım" },
  { href: "/iletisim", label: "İletişim" },
]

const linkClass =
  "transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"

async function FooterContact() {
  const items = contactItems(await getContact())
  if (items.length === 0) return null

  return (
    <ul className="flex flex-col items-center gap-3 text-sm md:items-start">
      {items.map((item) => (
        <li key={item.key}>
          <a
            href={item.href}
            {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className={`flex items-start gap-3 text-left ${linkClass}`}
          >
            <item.icon className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
            <span className="break-words whitespace-pre-line">{item.value}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

async function FooterSocial() {
  return <SocialIconButtons items={socialItems(await getContact())} className="justify-center md:justify-start" />
}

async function FooterYear() {
  // yıl bilgisi build anında sabitlenmesin diye önbellekli bileşen
  "use cache"
  cacheLife("days")

  return <>© {new Date().getFullYear()} {siteConfig.name}. Tüm hakları saklıdır.</>
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface pb-28 text-ink-soft md:pb-0">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 text-center md:text-left py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1.2fr] md:gap-12">
        <div className="flex flex-col items-center gap-3 md:items-start">
          <p className="font-serif-site text-3xl text-ink">{siteConfig.name}</p>
          <p className="mx-auto max-w-xs text-base leading-relaxed md:mx-0">{siteConfig.description}</p>
          <Suspense fallback={<div className="h-12" aria-hidden />}>
            <FooterSocial />
          </Suspense>
        </div>

        <nav aria-label="Alt menü" className="flex flex-col items-center gap-3 md:items-start">
          <p className="label-caps text-ink">Sayfalar</p>
          <ul className="flex flex-col items-center gap-3 text-base md:items-start">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col items-center gap-3 md:items-start">
          <p className="label-caps text-ink">İletişim</p>
          <Suspense fallback={<div className="h-24" aria-hidden />}>
            <FooterContact />
          </Suspense>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-5 py-5 sm:px-8 md:flex-row">
          <p className="text-center text-sm md:text-left">
            <Suspense fallback={null}>
              <FooterYear />
            </Suspense>
          </p>
          <a href="#" className={`label-caps rounded-full border border-line px-4 py-2 ${linkClass}`}>
            Yukarı ↑
          </a>
        </div>
      </div>
    </footer>
  )
}
