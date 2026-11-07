import Link from "next/link"

import { Rings } from "@/components/site/rings"
import { SocialIconButtons, socialItems } from "@/components/site/social-links"
import { dict, type Locale } from "@/lib/i18n"
import { siteConfig } from "@/lib/site"

type HeroData = {
  headline: string
  description: string | null
  descriptionFr: string | null
}

type Social = ReturnType<typeof socialItems>

const focus = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"

export function Hero({
  hero,
  social,
  locale = "tr",
}: {
  hero: HeroData | null
  social: Social
  locale?: Locale
}) {
  const t = dict[locale]
  const description = locale === "fr" ? hero?.descriptionFr : hero?.description

  return (
    <section className="relative overflow-hidden">
      {/* şekil yalnızca geniş ekranda (mobilde yok) */}
      <Rings className="absolute top-1/2 right-[-6rem] hidden w-[32rem] -translate-y-1/2 sm:block lg:right-4 lg:w-[38rem]" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-start gap-8 px-5 py-16 sm:px-8 sm:py-24 lg:py-32">
        <p className="label-caps text-brand">{t.tagline}</p>
        <h1 className="font-serif-site max-w-4xl text-[clamp(3.5rem,9vw,7.5rem)] leading-[0.95] font-normal tracking-[-0.02em] text-balance">
          {hero?.headline ?? siteConfig.name}
        </h1>
        {description && (
          <p className="max-w-2xl text-xl leading-relaxed text-ink-soft sm:text-[1.375rem] lg:max-w-[30rem] xl:max-w-[34rem]">
            {description}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
          <Link href={t.hero.primaryHref} className={`btn-primary ${focus}`}>
            {t.hero.primary}
          </Link>
          <Link
            href={t.hero.secondaryHref}
            className={`label-caps border-b border-ink pb-1 transition-colors hover:border-brand hover:text-brand ${focus}`}
          >
            {t.hero.secondary}
          </Link>
        </div>
        <SocialIconButtons items={social} />
      </div>
    </section>
  )
}
