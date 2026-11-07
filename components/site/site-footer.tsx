import { cacheLife } from "next/cache"
import Link from "next/link"
import { Suspense } from "react"

import { SocialIconButtons, socialItems } from "@/components/site/social-links"
import { getContact } from "@/lib/queries/contact"
import { dict, type Locale } from "@/lib/i18n"
import { institutions, siteConfig } from "@/lib/site"

const legalLinks = [
  { href: "/kvkk", label: "KVKK Aydınlatma Metni" },
  { href: "/gizlilik", label: "Gizlilik ve Çerez Politikası" },
  { href: "/yasal-uyari", label: "Yasal Uyarı" },
]

const linkClass =
  "transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"

async function FooterLinks() {
  const contact = await getContact()

  return (
    <ul className="flex flex-col items-center gap-3 text-base md:items-start">
      {institutions.map((item) => (
        <li key={item.name}>
          {item.href ? (
            <a href={item.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {item.name}
            </a>
          ) : (
            item.name
          )}
        </li>
      ))}
      {contact?.email && (
        <li>
          <a href={`mailto:${contact.email}`} className={`break-all ${linkClass}`}>
            {contact.email}
          </a>
        </li>
      )}
    </ul>
  )
}

async function FooterSocial() {
  return (
    <SocialIconButtons
      items={socialItems(await getContact())}
      className="justify-center md:justify-start"
    />
  )
}

async function FooterYear() {
  // yıl bilgisi build anında sabitlenmesin diye önbellekli bileşen
  "use cache"
  cacheLife("days")

  return <>© {new Date().getFullYear()} {siteConfig.name}</>
}

// Tek, sade footer: kimlik, kurumsal bağlantılar, Instagram, "Yukarı"
export function SiteFooter({ locale }: { locale: Locale }) {
  const t = dict[locale]
  return (
    <footer className="border-t border-line bg-surface pb-28 text-ink-soft md:pb-0">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 text-center sm:px-8 md:grid-cols-[1.4fr_1fr] md:gap-12 md:text-left">
        <div className="flex flex-col items-center gap-3 md:items-start">
          <p className="font-serif-site text-3xl text-ink">{siteConfig.name}</p>
          <p className="label-caps text-brand">{t.tagline}</p>
          <Suspense fallback={<div className="h-12" aria-hidden />}>
            <FooterSocial />
          </Suspense>
        </div>

        <div className="flex flex-col items-center gap-3 md:items-start">
          <p className="label-caps text-ink">{t.footer.links}</p>
          <Suspense fallback={<div className="h-24" aria-hidden />}>
            <FooterLinks />
          </Suspense>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-5 py-5 sm:px-8 md:flex-row">
          <div className="flex flex-col items-center gap-3 text-sm md:items-start">
            {locale === "tr" && (
              <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 md:justify-start">
                {legalLinks.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={linkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <p>
              <Suspense fallback={null}>
                <FooterYear />
              </Suspense>
            </p>
          </div>
          <a href="#" className={`label-caps rounded-full border border-line px-4 py-2 ${linkClass}`}>
            {t.footer.up}
          </a>
        </div>
      </div>
    </footer>
  )
}
