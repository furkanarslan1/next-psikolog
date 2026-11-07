"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"

import { Matheme } from "@/components/site/matheme"
import { SectionNumber } from "@/components/site/section-number"
import { formatDate } from "@/lib/format"
import { dict, type Locale } from "@/lib/i18n"

type Item = {
  id: string
  slug: string
  title: string
  excerpt: string
  type: "YAZI" | "CEVIRI"
  lang: string
  publishedAt: Date | null
}

const focus = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
const arrow =
  "flex size-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-brand hover:bg-brand hover:text-on-brand disabled:pointer-events-none disabled:opacity-35"

// Ana sayfada hero'nun altında "Öne çıkanlar": kaydırmalı şerit, "01 / 03" sayacı, oklar.
// Yalnızca yayınlanmış ve admin'de "öne çıkar" işaretlenmiş kayıtlar gelir.
export function FeaturedSlider({
  items,
  locale = "tr",
  number = "01",
}: {
  items: Item[]
  locale?: Locale
  number?: string
}) {
  const t = dict[locale]
  const scroller = useRef<HTMLUListElement>(null)
  const [index, setIndex] = useState(0)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)
  const total = items.length

  const update = useCallback(() => {
    const el = scroller.current
    if (!el) return
    const first = el.children[0] as HTMLElement | undefined
    const step = first ? first.offsetWidth + 24 : el.clientWidth
    setIndex(Math.min(total - 1, Math.round(el.scrollLeft / step)))
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [total])

  useEffect(() => {
    update()
    const el = scroller.current
    if (!el) return
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [update])

  function go(direction: -1 | 1) {
    const el = scroller.current
    if (!el) return
    const first = el.children[0] as HTMLElement | undefined
    const step = first ? first.offsetWidth + 24 : el.clientWidth
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    el.scrollBy({ left: direction * step, behavior: reduce ? "auto" : "smooth" })
  }

  function goTo(position: number) {
    const el = scroller.current
    const card = el?.children[position] as HTMLElement | undefined
    if (!el || !card) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: reduce ? "auto" : "smooth" })
  }

  const pad = (n: number) => String(n).padStart(2, "0")
  const href = (slug: string) => (locale === "fr" ? `/fr/publications/${slug}` : `/yazilar/${slug}`)

  return (
    <section
      aria-roledescription="carousel"
      aria-labelledby="featured-heading"
      className="mx-auto w-full max-w-6xl border-t border-line px-5 py-14 sm:px-8 sm:py-20"
    >
      <div className="flex items-end justify-between gap-6">
        <div className="flex flex-col gap-3">
          <SectionNumber n={number} />
          <h2
            id="featured-heading"
            className="font-serif-site text-3xl font-normal tracking-tight sm:text-4xl"
          >
            {t.featured.title}
          </h2>
        </div>
        {total > 1 && (
          <div className="flex items-center gap-4">
            <p className="label-caps text-ink-soft" aria-live="polite">
              {pad(index + 1)} / {pad(total)}
            </p>
            <div className="hidden gap-2 sm:flex">
              <button
                type="button"
                className={`${arrow} ${focus}`}
                aria-label={t.featured.prev}
                disabled={!canPrev}
                onClick={() => go(-1)}
              >
                <ChevronLeftIcon className="size-5" aria-hidden />
              </button>
              <button
                type="button"
                className={`${arrow} ${focus}`}
                aria-label={t.featured.next}
                disabled={!canNext}
                onClick={() => go(1)}
              >
                <ChevronRightIcon className="size-5" aria-hidden />
              </button>
            </div>
          </div>
        )}
      </div>

      <ul
        ref={scroller}
        onScroll={update}
        tabIndex={0}
        aria-label={t.featured.title}
        className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, position) => (
          <li
            key={item.id}
            aria-label={`${position + 1} / ${total}`}
            className="min-w-0 flex-none basis-[80%] snap-start sm:basis-[calc(50%-0.75rem)] lg:basis-[calc(33.333%-1rem)]"
          >
            <article className="group relative flex h-full min-h-72 flex-col gap-4 rounded-sm border border-line bg-tile p-6 transition-all hover:-translate-y-0.5 hover:border-brand">
              <div className="flex items-start justify-between gap-4">
                <p className="label-caps text-brand">{t.types[item.type]}</p>
                <Matheme seed={item.slug} />
              </div>
              <h3 className="font-serif-site text-2xl leading-snug font-normal tracking-tight text-balance">
                <Link
                  href={href(item.slug)}
                  lang={item.lang}
                  className={`after:absolute after:inset-0 ${focus}`}
                >
                  {item.title}
                </Link>
              </h3>
              <p lang={item.lang} className="line-clamp-3 text-base leading-relaxed text-ink-soft">
                {item.excerpt}
              </p>
              <div className="label-caps mt-auto flex items-center justify-between gap-4 pt-2 text-ink-soft">
                {item.publishedAt && (
                  <time dateTime={item.publishedAt.toISOString()}>
                    {formatDate(item.publishedAt, locale)}
                  </time>
                )}
                <span className="text-brand" aria-hidden>
                  {t.read}
                </span>
              </div>
            </article>
          </li>
        ))}
      </ul>

      {/* mobil: oklar yok; kaydırılabilir olduğunu sonraki kartın görünen kısmı, noktalar ve ipucu yazısı gösterir */}
      {total > 1 && (
        <div className="mt-5 flex items-center justify-between gap-4 sm:hidden">
          <div className="-ml-1 flex items-center">
            {items.map((item, position) => (
              <button
                key={item.id}
                type="button"
                aria-label={`${t.featured.goTo} ${position + 1} / ${total}`}
                aria-current={position === index ? "true" : undefined}
                onClick={() => goTo(position)}
                className={`group flex size-6 items-center justify-center ${focus}`}
              >
                {/* görünen nokta küçük; dokunma alanı 24 px */}
                <span
                  className={`block h-2 rounded-full transition-all ${
                    position === index ? "w-6 bg-brand" : "w-2 bg-line group-hover:bg-ink-soft"
                  }`}
                />
              </button>
            ))}
          </div>
          {index === 0 && (
            <p className="label-caps text-ink-soft" aria-hidden>
              {t.featured.hint}
            </p>
          )}
        </div>
      )}
    </section>
  )
}
