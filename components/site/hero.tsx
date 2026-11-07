import Link from "next/link"

import { siteConfig } from "@/lib/site"

type HeroData = {
  headline: string
  description: string | null
  buttonLabel: string
  buttonUrl: string
}

const buttonClass =
  "btn-primary w-fit focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"

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

export function Hero({ hero }: { hero: HeroData }) {
  return (
    <section className="border-b border-line">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-8 px-5 py-16 sm:px-8 sm:py-24 lg:py-32">
        <p className="label-caps text-brand">{siteConfig.tagline}</p>
        <h1 className="font-serif-site max-w-4xl text-[clamp(3.5rem,9vw,7.5rem)] leading-[0.95] font-normal tracking-[-0.02em] text-balance">
          {hero.headline}
        </h1>
        {hero.description && (
          <p className="max-w-2xl text-xl leading-relaxed text-ink-soft sm:text-[1.375rem]">
            {hero.description}
          </p>
        )}
        <HeroButton label={hero.buttonLabel} url={hero.buttonUrl} />
      </div>
    </section>
  )
}
