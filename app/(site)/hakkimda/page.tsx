import type { Metadata } from "next"

import { JsonLd } from "@/components/site/json-ld"
import { languageAlternates } from "@/lib/i18n"
import { getAbout } from "@/lib/queries/about"
import { absoluteUrl, defaultOgImages, siteConfig } from "@/lib/site"
import { stripImages } from "@/lib/sanitize"
import { plainText } from "@/lib/teaser"

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAbout()
  const description = about
    ? plainText(about.content).replace(/\s+/g, " ").slice(0, 160)
    : ""

  return {
    title: "Hakkımda",
    description: description || siteConfig.description,
    alternates: { canonical: "/hakkimda", languages: languageAlternates("/hakkimda") },
    openGraph: {
      type: "profile",
      title: "Hakkımda",
      description: description || siteConfig.description,
      url: "/hakkimda",
      images: defaultOgImages,
      locale: siteConfig.locale,
      alternateLocale: ["fr_FR"],
    },
  }
}

export default async function AboutPage() {
  const about = await getAbout()

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
            description: about
              ? plainText(about.content).replace(/\s+/g, " ").slice(0, 300)
              : undefined,
          },
        }}
      />

      <article className="mx-auto flex w-full max-w-6xl flex-col items-center px-5 py-14 sm:px-8 sm:py-20">
        <header className="flex flex-col items-center gap-6 text-center">
          <div className="flex flex-col items-center gap-3 pt-2">
            <h1 className="font-serif-site text-4xl leading-[1.08] font-normal tracking-tight sm:text-5xl lg:text-6xl">
              Hakkımda
            </h1>
            <p className="text-ink-soft">{siteConfig.name}</p>
          </div>
          <span aria-hidden className="mt-2 block h-px w-16 bg-brand" />
        </header>

        {about ? (
          <div
            className="rich-content about-prose mt-12 w-full max-w-2xl"
            // içerik kaydedilirken sunucuda temizlenir (lib/sanitize.ts)
            dangerouslySetInnerHTML={{ __html: stripImages(about.content) }}
          />
        ) : (
          <p className="mt-12 max-w-prose text-lg text-ink-soft">
            Bu sayfa yakında hazır olacak.
          </p>
        )}
      </article>

    </>
  )
}
