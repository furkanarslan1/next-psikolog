import type { ReactNode } from "react"

// Yasal sayfaların ortak görünümü: başlık, son güncelleme ve okunabilir metin
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string
  updated: string
  children: ReactNode
}) {
  return (
    <article className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-14 sm:px-8 sm:py-20">
      <header className="mx-auto flex w-full max-w-[70ch] flex-col gap-4">
        <h1 className="font-serif-site text-4xl leading-[1.08] font-normal tracking-tight text-balance sm:text-6xl">
          {title}
        </h1>
        <p className="label-caps text-ink-soft">Son güncelleme: {updated}</p>
      </header>
      <div className="rich-content mx-auto w-full max-w-[70ch]">{children}</div>
    </article>
  )
}

export const LEGAL_UPDATED = "7 Kasım 2026"
