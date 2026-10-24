import { cacheLife } from "next/cache"

import { siteConfig } from "@/lib/site"

export async function SiteFooter() {
  // yıl bilgisi build anında sabitlenmesin diye önbellekli bileşen
  "use cache"
  cacheLife("days")

  return (
    <footer className="bg-anthracite text-white/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-10 sm:px-8">
        <p className="font-serif-site text-lg text-white">{siteConfig.name}</p>
        <p className="text-sm">
          © {new Date().getFullYear()} Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  )
}
