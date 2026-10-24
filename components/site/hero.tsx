import Image from "next/image"
import Link from "next/link"

import { frameRatio } from "@/lib/image-ratio"

type HeroData = {
  headline: string
  description: string | null
  buttonLabel: string
  buttonUrl: string
  imageUrl: string | null
  imageAlt: string | null
  imageWidth: number | null
  imageHeight: number | null
}

const buttonClass =
  "inline-flex w-fit items-center rounded-xs bg-paper px-7 py-3.5 text-base font-medium text-anthracite transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"

export function HeroButton({ label, url }: { label: string; url: string }) {
  // site içi yol Link ile, dış adresler yeni sekmede açılır
  if (url.startsWith("/")) {
    return (
      <Link href={url} className={buttonClass}>
        {label}
      </Link>
    )
  }
  const external = url.startsWith("https://")
  return (
    <a
      href={url}
      className={buttonClass}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {label}
    </a>
  )
}

// Dikeyde (portre) mobilde görsel arka plan olur; yatay veya kare görseller bu
// dar ve uzun alanda aşırı kırpılacağı için üstte, kendi oranında gösterilir.
const PORTRAIT_MAX_RATIO = 0.9

export function Hero({ hero }: { hero: HeroData }) {
  const ratio = frameRatio(hero.imageWidth, hero.imageHeight)
  const portrait = ratio < PORTRAIT_MAX_RATIO

  const containerClass = !hero.imageUrl
    ? ""
    : portrait
      ? "min-h-[85svh] items-end lg:grid-cols-[5fr_6fr] lg:gap-16"
      : "gap-8 lg:grid-cols-[5fr_6fr] lg:gap-16"

  const imageClass = portrait
    ? "absolute inset-0 -z-10 lg:relative lg:inset-auto lg:z-0 lg:aspect-(--hero-ratio) lg:overflow-hidden lg:rounded-xs"
    : "relative order-first -mx-5 -mt-14 aspect-(--hero-ratio) overflow-hidden sm:-mx-8 sm:-mt-20 lg:order-none lg:mx-0 lg:mt-0 lg:rounded-xs"

  return (
    <section className="relative isolate overflow-hidden bg-anthracite text-white">
      <div
        className={`mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:min-h-[34rem] lg:items-center lg:py-28 xl:min-h-[40rem] ${containerClass}`}
      >
        <div className="relative z-10 flex flex-col items-start gap-6">
          <h1 className="font-serif-site text-5xl leading-[1.05] font-normal tracking-tight text-balance sm:text-6xl lg:text-7xl">
            {hero.headline}
          </h1>
          {hero.description && (
            <p className="max-w-xl text-base leading-relaxed text-white/75">
              {hero.description}
            </p>
          )}
          <HeroButton label={hero.buttonLabel} url={hero.buttonUrl} />
        </div>

        {hero.imageUrl && (
          <div
            className={imageClass}
            style={{ "--hero-ratio": ratio } as React.CSSProperties}
          >
            <Image
              src={hero.imageUrl}
              alt={hero.imageAlt ?? ""}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1024px) 36rem, 100vw"
              className="object-cover object-top"
            />
            {/* mobil: portrede metin için koyu katman, yatayda alttan zemine geçiş */}
            <div
              className={
                portrait
                  ? "absolute inset-0 bg-linear-to-t from-anthracite/95 via-anthracite/60 to-anthracite/25 lg:hidden"
                  : "absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-anthracite to-transparent lg:hidden"
              }
            />
          </div>
        )}
      </div>
    </section>
  )
}
