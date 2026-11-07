import Link from "next/link"

import { SocialIconButtons, socialItems } from "@/components/site/social-links"
import { siteConfig } from "@/lib/site"

type HeroData = {
  headline: string
  description: string | null
}

type Social = ReturnType<typeof socialItems>

const focus = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"

export function Hero({ hero, social }: { hero: HeroData | null; social: Social }) {
  return (
    <section>
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-8 px-5 py-16 sm:px-8 sm:py-24 lg:py-32">
        <p className="label-caps text-brand">{siteConfig.tagline}</p>
        <h1 className="font-serif-site max-w-4xl text-[clamp(3.5rem,9vw,7.5rem)] leading-[0.95] font-normal tracking-[-0.02em] text-balance">
          {hero?.headline ?? siteConfig.name}
        </h1>
        {hero?.description && (
          <p className="max-w-2xl text-xl leading-relaxed text-ink-soft sm:text-[1.375rem]">
            {hero.description}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
          <Link href="/hakkimda" className={`btn-primary ${focus}`}>
            Hakkımda
          </Link>
          <Link
            href="/iletisim"
            className={`label-caps border-b border-ink pb-1 transition-colors hover:border-brand hover:text-brand ${focus}`}
          >
            İletişime Geçin →
          </Link>
        </div>
        <SocialIconButtons items={social} />
      </div>
    </section>
  )
}
