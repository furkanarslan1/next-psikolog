import Image from "next/image"
import Link from "next/link"

import type { AboutData } from "@/lib/queries/about"
import { siteConfig } from "@/lib/site"
import { teaser } from "@/lib/teaser"

const TEASER_CHARS = 800

// Ana sayfada hero'nun altında: geniş ekranda solda yuvarlak portre, sağda başlık ve
// yaklaşık 10 satırlık önizleme; mobilde üst üste ve ortalı
export function AboutSection({ about }: { about: AboutData | null }) {
  if (!about) return null
  const preview = teaser(about.content, TEASER_CHARS)
  // başlık, liste, görsel gibi yapılar önizlemede görünmez; tam sayfaya gitmeye değer
  const hasMore = preview.truncated || /<(h[1-6]|img|ul|ol|blockquote)\b/i.test(about.content)

  return (
    <section
      id="hakkimda"
      aria-labelledby="about-heading"
      className="scroll-mt-4 border-b border-line bg-surface"
    >
      <div
        className={`mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 ${
          about.imageUrl ? "lg:grid-cols-[20rem_1fr] lg:gap-20" : "justify-items-center"
        }`}
      >
        {about.imageUrl && (
          // halka ile görsel arasındaki boşluk madalyon etkisi verir
          <div className="flex justify-center">
            <div className="relative size-48 overflow-hidden rounded-full ring-1 ring-line ring-offset-8 ring-offset-surface sm:size-60 lg:size-72">
              <Image
                src={about.imageUrl}
                alt={about.imageAlt ?? ""}
                fill
                sizes="(min-width: 1024px) 18rem, 15rem"
                className="object-cover object-top"
              />
            </div>
          </div>
        )}

        <div className="flex w-full max-w-2xl flex-col items-center text-center lg:items-start lg:text-left">
          <h2
            id="about-heading"
            className="font-serif-site text-4xl leading-tight font-normal tracking-tight sm:text-5xl"
          >
            Hakkımda
          </h2>
          <p className="mt-3 text-ink-soft">{siteConfig.name}</p>
          <span aria-hidden className="mt-6 block h-px w-16 bg-anthracite" />

          <p className="mt-8 line-clamp-10 w-full text-left text-[1.0625rem] leading-[1.85] whitespace-pre-line text-ink">
            {preview.text}
          </p>

          {hasMore && (
            <Link
              href="/hakkimda"
              className="mt-8 inline-flex items-center rounded-xs bg-anthracite px-7 py-3.5 text-base font-medium text-white transition-colors hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-anthracite"
            >
              Devamını oku
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
