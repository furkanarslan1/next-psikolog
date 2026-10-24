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
  "transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"

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
            <item.icon className="mt-0.5 size-4 shrink-0 text-white" aria-hidden />
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
    <footer className="bg-anthracite pb-28 text-white/70 md:pb-0">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 text-center md:text-left py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1.2fr] md:gap-12">
        <div className="flex flex-col items-center gap-3 md:items-start">
          <p className="font-serif-site text-2xl text-white">{siteConfig.name}</p>
          <p className="mx-auto max-w-xs text-sm leading-relaxed md:mx-0">{siteConfig.description}</p>
          <Suspense fallback={<div className="h-12" aria-hidden />}>
            <FooterSocial />
          </Suspense>
        </div>

        <nav aria-label="Alt menü" className="flex flex-col items-center gap-3 md:items-start">
          <p className="font-serif-site text-lg text-white">Sayfalar</p>
          <ul className="flex flex-col items-center gap-3 text-sm md:items-start">
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
          <p className="font-serif-site text-lg text-white">İletişim</p>
          <Suspense fallback={<div className="h-24" aria-hidden />}>
            <FooterContact />
          </Suspense>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto w-full max-w-6xl px-5 py-5 text-center text-sm text-white/55 sm:px-8 md:text-left">
          <Suspense fallback={null}>
            <FooterYear />
          </Suspense>
        </p>
      </div>
    </footer>
  )
}
