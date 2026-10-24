import Link from "next/link"

const linkClass =
  "border-b-2 pb-1 text-base transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-anthracite"

export function CategoryNav({
  categories,
  activeSlug,
}: {
  categories: { name: string; slug: string }[]
  activeSlug?: string
}) {
  if (categories.length === 0) return null

  return (
    <nav aria-label="Kategoriler" className="flex flex-wrap gap-x-8 gap-y-3">
      <Link
        href="/"
        aria-current={activeSlug ? undefined : "page"}
        className={`${linkClass} ${activeSlug ? "border-transparent text-ink-soft hover:text-ink" : "border-anthracite text-anthracite"}`}
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
            className={`${linkClass} ${active ? "border-anthracite text-anthracite" : "border-transparent text-ink-soft hover:text-ink"}`}
          >
            {category.name}
          </Link>
        )
      })}
    </nav>
  )
}
