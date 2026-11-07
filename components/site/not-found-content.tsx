import Link from "next/link"

import { dict, type Locale } from "@/lib/i18n"

export function NotFoundContent({ locale }: { locale: Locale }) {
  const t = dict[locale]

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-5 py-20 sm:px-8 sm:py-28">
      <p className="label-caps text-brand">404</p>
      <h1 className="font-serif-site text-5xl leading-tight font-normal tracking-tight text-balance sm:text-7xl">
        {t.notFound.title}
      </h1>
      <p className="max-w-prose text-xl leading-relaxed text-ink-soft">{t.notFound.text}</p>
      <Link
        href={t.home}
        className="btn-primary mt-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
      >
        {t.notFound.button}
      </Link>
    </div>
  )
}
