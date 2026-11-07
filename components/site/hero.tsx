import Link from "next/link"

type HeroData = {
  headline: string
  description: string | null
  buttonLabel: string
  buttonUrl: string
}

const buttonClass =
  "inline-flex w-fit items-center rounded-xs bg-white px-7 py-3.5 font-sans-site text-base font-medium text-panel transition-colors hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"

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
    <section className="bg-panel text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-5 py-14 sm:px-8 sm:py-20 lg:py-28">
        <h1 className="font-serif-site max-w-3xl text-4xl leading-[1.08] font-normal tracking-tight text-balance sm:text-5xl lg:text-6xl">
          {hero.headline}
        </h1>
        {hero.description && (
          <p className="max-w-xl text-base leading-relaxed text-white/75">
            {hero.description}
          </p>
        )}
        <HeroButton label={hero.buttonLabel} url={hero.buttonUrl} />
      </div>
    </section>
  )
}
