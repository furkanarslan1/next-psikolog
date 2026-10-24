import Link from "next/link"

import { pagePath } from "@/lib/blog-config"

const linkClass =
  "border-b-2 pb-1 text-base transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-anthracite"

// Geçerli sayfanın etrafındaki numaralar; arada boşluk varsa "…" gösterilir
function visiblePages(current: number, total: number) {
  const pages = new Set([1, total, current - 1, current, current + 1])
  const sorted = [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b)
  const result: (number | "gap")[] = []
  for (const page of sorted) {
    const previous = result[result.length - 1]
    if (typeof previous === "number" && page - previous > 1) result.push("gap")
    result.push(page)
  }
  return result
}

export function Pagination({
  base,
  current,
  total,
}: {
  base: string
  current: number
  total: number
}) {
  if (total <= 1) return null

  return (
    <nav aria-label="Sayfalar" className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-8">
      {current > 1 && (
        <Link
          href={pagePath(base, current - 1)}
          rel="prev"
          className={`${linkClass} border-transparent text-ink-soft hover:text-ink`}
        >
          Önceki
        </Link>
      )}
      {visiblePages(current, total).map((item, index) =>
        item === "gap" ? (
          <span key={`gap-${index}`} aria-hidden className="text-ink-soft">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={pagePath(base, item)}
            aria-label={`Sayfa ${item}`}
            aria-current={item === current ? "page" : undefined}
            className={`${linkClass} ${
              item === current
                ? "border-anthracite text-anthracite"
                : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {item}
          </Link>
        )
      )}
      {current < total && (
        <Link
          href={pagePath(base, current + 1)}
          rel="next"
          className={`${linkClass} border-transparent text-ink-soft hover:text-ink`}
        >
          Sonraki
        </Link>
      )}
    </nav>
  )
}
