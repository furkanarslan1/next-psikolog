import type { Metadata } from "next"

import { ContactItems, contactItems } from "@/components/site/contact-items"
import { JsonLd } from "@/components/site/json-ld"
import { SocialBandContent, socialItems } from "@/components/site/social-links"
import { PageHeading } from "@/components/site/page-heading"
import { getContact } from "@/lib/queries/contact"
import { absoluteUrl, siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "İletişim",
  description: `${siteConfig.name} ile iletişime geçin: e-posta, telefon, WhatsApp, adres ve sosyal medya hesapları.`,
  alternates: { canonical: "/iletisim" },
}

export default async function ContactPage() {
  const contact = await getContact()
  const items = contactItems(contact)
  const social = socialItems(contact)

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "İletişim",
          url: absoluteUrl("/iletisim"),
          inLanguage: "tr-TR",
          about: {
            "@type": "Person",
            name: siteConfig.name,
            email: contact?.email ?? undefined,
            telephone: contact?.phone ?? undefined,
            address: contact?.address ?? undefined,
            sameAs: socialItems(contact).map((item) => item.href),
          },
        }}
      />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-5 py-14 sm:px-8 sm:py-20">
        <PageHeading
          title="İletişim"
          description="Randevu ve bilgi almak için aşağıdaki kanallardan bana ulaşabilirsiniz."
        />
        {items.length === 0 && social.length === 0 ? (
          <p className="max-w-prose text-lg text-ink-soft">
            İletişim bilgileri yakında burada olacak.
          </p>
        ) : (
          <>
            {social.length > 0 && (
              <div className="bg-anthracite px-6 py-8 sm:px-10">
                <SocialBandContent items={social} />
              </div>
            )}
            {items.length > 0 && <ContactItems items={items} />}
          </>
        )}
      </div>
    </>
  )
}
