import Image from "next/image"

import { optimizeContentHtml } from "@/lib/content-images"
import { frameRatio } from "@/lib/image-ratio"
import type { AboutData } from "@/lib/queries/about"

// Ana sayfada hero'nun altında: solda görsel, sağda hakkımda metni (geniş ekranda iki eşit sütun)
export function AboutSection({ about }: { about: AboutData | null }) {
  if (!about) return null
  const ratio = frameRatio(about.imageWidth, about.imageHeight)

  return (
    <section
      id="hakkimda"
      aria-labelledby="about-heading"
      className="scroll-mt-4 border-b border-line bg-surface"
    >
      <div
        className={`mx-auto grid w-full max-w-6xl items-start gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:min-h-[28rem] ${
          about.imageUrl ? "lg:grid-cols-2 lg:gap-16" : ""
        }`}
      >
        {about.imageUrl && (
          // fill kullanan görselin üst elemanı relative olmalı: sticky dış kutuda
          <div className="mx-auto w-full max-w-md self-start lg:sticky lg:top-8 lg:max-w-none">
            <div
              className="relative overflow-hidden rounded-xs bg-line aspect-(--about-ratio)"
              style={{ "--about-ratio": ratio } as React.CSSProperties}
            >
              <Image
                src={about.imageUrl}
                alt={about.imageAlt ?? ""}
                fill
                sizes="(min-width: 1024px) 32rem, (min-width: 640px) 28rem, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        )}
        <div className="flex max-w-xl flex-col gap-6">
          <h2
            id="about-heading"
            className="font-serif-site text-3xl leading-tight font-normal tracking-tight sm:text-4xl"
          >
            Hakkımda
          </h2>
          <div
            className="rich-content rich-content-compact"
            // içerik kaydedilirken sunucuda temizlenir (lib/sanitize.ts)
            dangerouslySetInnerHTML={{ __html: optimizeContentHtml(about.content) }}
          />
        </div>
      </div>
    </section>
  )
}
