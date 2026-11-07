import type { Metadata } from "next"

import { ContactItems, contactItems } from "@/components/site/contact-items"
import { PageHeading } from "@/components/site/page-heading"
import { socialItems, SocialIconButtons } from "@/components/site/social-links"
import { frDescription, languageAlternates } from "@/lib/i18n"
import { getContact } from "@/lib/queries/contact"
import { defaultOgImages, siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Contact",
  description: frDescription,
  alternates: { canonical: "/fr/contact", languages: languageAlternates("/iletisim") },
  openGraph: {
    type: "website",
    title: "Contact",
    description: frDescription,
    url: "/fr/contact",
    siteName: siteConfig.name,
    locale: "fr_FR",
    alternateLocale: ["tr_TR"],
    images: defaultOgImages,
  },
}

export default async function ContactPage() {
  const contact = await getContact()
  const items = contactItems(contact, "fr")

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-5 py-14 sm:px-8 sm:py-20">
      <PageHeading
        title="Contact"
        description="Pour toute information ou prise de rendez-vous, vous pouvez m'écrire. Séances en turc ; contact possible en français."
      />
      {items.length > 0 && <ContactItems items={items} />}
      <SocialIconButtons items={socialItems(contact)} />
      <p className="max-w-prose text-base text-ink-soft">
        Merci de ne pas partager d&apos;informations de santé par écrit : l&apos;essentiel se dit en séance.
      </p>
    </div>
  )
}
