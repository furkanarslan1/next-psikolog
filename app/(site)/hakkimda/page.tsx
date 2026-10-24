import type { Metadata } from "next"
import Image from "next/image"

import { WHATSAPP_TEXT } from "@/components/site/contact-items"
import { HeroButton } from "@/components/site/hero"
import { JsonLd } from "@/components/site/json-ld"
import { transformedUrl } from "@/lib/cloudinary-url"
import { optimizeContentHtml } from "@/lib/content-images"
import { whatsappHref } from "@/lib/phone"
import { getAbout } from "@/lib/queries/about"
import { getContact } from "@/lib/queries/contact"
import { getHero } from "@/lib/queries/hero"
import { absoluteUrl, siteConfig } from "@/lib/site"
import { plainText } from "@/lib/teaser"

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAbout()
  const description = about
    ? plainText(about.content).replace(/\s+/g, " ").slice(0, 160)
    : ""

  return {
    title: "Hakkımda",
    description: description || siteConfig.description,
    alternates: { canonical: "/hakkimda" },
    openGraph: {
      type: "profile",
      title: "Hakkımda",
      description: description || siteConfig.description,
      url: "/hakkimda",
      images: about?.imageUrl
        ? [
            {
              url: transformedUrl(about.imageUrl, {
                width: 1200,
                height: 630,
                crop: "fill",
                format: "jpg",
              }),
              width: 1200,
              height: 630,
              alt: about.imageAlt ?? siteConfig.name,
            },
          ]
        : undefined,
    },
  }
}

export default async function AboutPage() {
  const [about, contact, hero] = await Promise.all([
    getAbout(),
    getContact(),
    getHero(),
  ])
  // randevu butonu: WhatsApp numarası varsa oraya, yoksa hero butonuna
  const whatsapp = contact?.whatsapp
    ? whatsappHref(contact.whatsapp, WHATSAPP_TEXT)
    : null
  const cta = whatsapp
    ? { label: "WhatsApp ile yazın", url: whatsapp }
    : { label: hero?.buttonLabel ?? "İletişime geçin", url: hero?.buttonUrl ?? "/iletisim" }

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "Hakkımda",
          url: absoluteUrl("/hakkimda"),
          inLanguage: "tr-TR",
          about: {
            "@type": "Person",
            name: siteConfig.name,
            image: about?.imageUrl ?? undefined,
            description: about
              ? plainText(about.content).replace(/\s+/g, " ").slice(0, 300)
              : undefined,
          },
        }}
      />

      <article className="mx-auto flex w-full max-w-6xl flex-col items-center px-5 py-14 sm:px-8 sm:py-20">
        <header className="flex flex-col items-center gap-6 text-center">
          {about?.imageUrl && (
            // halka ile görsel arasındaki boşluk madalyon etkisi verir
            <div className="relative size-48 overflow-hidden rounded-full ring-1 ring-line ring-offset-8 ring-offset-paper sm:size-60">
              <Image
                src={about.imageUrl}
                alt={about.imageAlt ?? ""}
                fill
                loading="eager"
                fetchPriority="high"
                sizes="240px"
                className="object-cover object-top"
              />
            </div>
          )}
          <div className="flex flex-col items-center gap-3 pt-2">
            <h1 className="font-serif-site text-5xl leading-tight font-normal tracking-tight sm:text-6xl">
              Hakkımda
            </h1>
            <p className="text-ink-soft">{siteConfig.name}</p>
          </div>
          <span aria-hidden className="mt-2 block h-px w-16 bg-anthracite" />
        </header>

        {about ? (
          <div
            className="rich-content about-prose mt-12 w-full max-w-2xl"
            // içerik kaydedilirken sunucuda temizlenir (lib/sanitize.ts)
            dangerouslySetInnerHTML={{ __html: optimizeContentHtml(about.content) }}
          />
        ) : (
          <p className="mt-12 max-w-prose text-lg text-ink-soft">
            Bu sayfa yakında hazır olacak.
          </p>
        )}
      </article>

      <section className="bg-anthracite text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-5 py-14 text-center sm:px-8 sm:py-16">
          <h2 className="font-serif-site text-3xl font-normal tracking-tight sm:text-4xl">
            Tanışmak için bir adım atın
          </h2>
          <HeroButton label={cta.label} url={cta.url} />
        </div>
      </section>
    </>
  )
}
