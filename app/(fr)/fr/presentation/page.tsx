import type { Metadata } from "next"

import { JsonLd } from "@/components/site/json-ld"
import { frDescription, languageAlternates } from "@/lib/i18n"
import { getAbout } from "@/lib/queries/about"
import { stripImages } from "@/lib/sanitize"
import { absoluteUrl, defaultOgImages, siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Présentation",
  description: frDescription,
  alternates: { canonical: "/fr/presentation", languages: languageAlternates("/hakkimda") },
  openGraph: {
    type: "profile",
    title: "Présentation",
    description: frDescription,
    url: "/fr/presentation",
    siteName: siteConfig.name,
    locale: "fr_FR",
    alternateLocale: ["tr_TR"],
    images: defaultOgImages,
  },
}

export default async function PresentationPage() {
  const about = await getAbout()

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "Présentation",
          url: absoluteUrl("/fr/presentation"),
          inLanguage: "fr-FR",
          about: { "@type": "Person", name: siteConfig.name, jobTitle: "Psychologue" },
        }}
      />
      <article className="mx-auto flex w-full max-w-6xl flex-col items-center px-5 py-14 sm:px-8 sm:py-20">
        <header className="flex flex-col items-center gap-3 text-center">
          <h1 className="font-serif-site text-4xl leading-[1.08] font-normal tracking-tight sm:text-5xl lg:text-6xl">
            Présentation
          </h1>
          <p className="text-ink-soft">{siteConfig.name}</p>
          <span aria-hidden className="mt-3 block h-px w-16 bg-brand" />
        </header>
        {about?.contentFr ? (
          <div
            className="rich-content about-prose mt-12 w-full max-w-2xl"
            // içerik kaydedilirken sunucuda temizlenir (lib/sanitize.ts)
            dangerouslySetInnerHTML={{ __html: stripImages(about.contentFr) }}
          />
        ) : (
          <p className="mt-12 max-w-prose text-lg text-ink-soft">Cette page sera bientôt disponible.</p>
        )}
      </article>
    </>
  )
}
