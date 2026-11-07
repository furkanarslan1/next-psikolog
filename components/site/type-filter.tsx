import Link from "next/link"

import { listBase, postTypes, type PostTypeSlug } from "@/lib/blog-config"

const tabs: { slug: PostTypeSlug | null; label: string }[] = [
  { slug: null, label: "Tümü" },
  { slug: "yazi", label: postTypes.yazi.plural },
  { slug: "ceviri", label: postTypes.ceviri.plural },
]

// Tür filtresi: Tümü / Yazılar / Çeviriler
export function TypeFilter({ active }: { active: PostTypeSlug | null }) {
  return (
    <nav aria-label="Tür" className="flex flex-wrap gap-x-8 gap-y-3">
      {tabs.map((tab) => {
        const current = tab.slug === active
        return (
          <Link
            key={tab.label}
            href={listBase(tab.slug)}
            aria-current={current ? "page" : undefined}
            className={`label-caps border-b-2 pb-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand ${
              current ? "border-brand text-brand" : "border-transparent text-ink hover:text-brand"
            }`}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
