"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"

const linkClass =
  "shrink-0 whitespace-nowrap border-b-2 pb-1 text-base transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-anthracite"

const arrowClass =
  "absolute top-0 flex h-[calc(100%-0.25rem)] w-14 items-center focus-visible:outline-none"

export function CategoryNav({
  categories,
  activeSlug,
}: {
  categories: { name: string; slug: string }[]
  activeSlug?: string
}) {
  const scroller = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  const update = useCallback(() => {
    const el = scroller.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    const el = scroller.current
    if (!el) return

    // aktif kategori görünür alanda değilse ortaya getir
    const active = el.querySelector<HTMLElement>('[aria-current="page"]')
    if (active) {
      el.scrollLeft = active.offsetLeft - (el.clientWidth - active.offsetWidth) / 2
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [update, activeSlug])

  function scrollByPage(direction: -1 | 1) {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ left: direction * el.clientWidth * 0.7, behavior: "smooth" })
  }

  if (categories.length === 0) return null

  return (
    <nav aria-label="Kategoriler" className="relative">
      <div
        ref={scroller}
        onScroll={update}
        className="flex snap-x gap-x-8 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <Link
          href="/yazilar"
          aria-current={activeSlug ? undefined : "page"}
          className={`${linkClass} snap-start ${activeSlug ? "border-transparent text-ink-soft hover:text-ink" : "border-anthracite text-anthracite"}`}
        >
          Tümü
        </Link>
        {categories.map((category) => {
          const active = category.slug === activeSlug
          return (
            <Link
              key={category.slug}
              href={`/kategori/${category.slug}`}
              aria-current={active ? "page" : undefined}
              className={`${linkClass} snap-start ${active ? "border-anthracite text-anthracite" : "border-transparent text-ink-soft hover:text-ink"}`}
            >
              {category.name}
            </Link>
          )
        })}
      </div>

      {canLeft && (
        <button
          type="button"
          onClick={() => scrollByPage(-1)}
          aria-label="Önceki kategoriler"
          className={`${arrowClass} left-0 justify-start bg-linear-to-r from-paper from-50% to-transparent`}
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-anthracite text-white transition-colors hover:bg-ink">
            <ChevronLeftIcon className="size-4" aria-hidden />
          </span>
        </button>
      )}
      {canRight && (
        <button
          type="button"
          onClick={() => scrollByPage(1)}
          aria-label="Sonraki kategoriler"
          className={`${arrowClass} right-0 justify-end bg-linear-to-l from-paper from-50% to-transparent`}
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-anthracite text-white transition-colors hover:bg-ink">
            <ChevronRightIcon className="size-4" aria-hidden />
          </span>
        </button>
      )}
    </nav>
  )
}
