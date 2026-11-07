"use client"

import { MoonIcon, SunIcon } from "lucide-react"
import { useSyncExternalStore } from "react"

import { dict, type Locale } from "@/lib/i18n"

type Theme = "light" | "dark"

const query = "(prefers-color-scheme: dark)"

// Geçerli tema: kullanıcı düğmeyle seçtiyse o, seçmediyse sistem ayarı
function readTheme(): Theme {
  const chosen = document.documentElement.dataset.theme
  if (chosen === "light" || chosen === "dark") return chosen
  return window.matchMedia(query).matches ? "dark" : "light"
}

// Tema <html data-theme>'de ve sistem ayarında yaşar; React'in dışındaki bu değerleri abonelikle okuruz
const listeners = new Set<() => void>()
function subscribe(callback: () => void) {
  listeners.add(callback)
  const media = window.matchMedia(query)
  media.addEventListener("change", callback)
  return () => {
    listeners.delete(callback)
    media.removeEventListener("change", callback)
  }
}

// İki seçenekli tema düğmesi (açık / koyu). Varsayılan sistem ayarıdır; düğmeyle seçilen tema
// tarayıcıda ("tema") saklanır. Simge CSS ile temaya bağlıdır, sayfa açılırken titremez; simge
// basınca geçilecek temayı gösterir.
export function ThemeToggle({ locale }: { locale: Locale }) {
  const t = dict[locale].theme
  const theme = useSyncExternalStore(subscribe, readTheme, () => "light" as Theme)
  const target: Theme = theme === "dark" ? "light" : "dark"
  const label = target === "dark" ? t.toDark : t.toLight

  function toggle() {
    const root = document.documentElement
    const next: Theme = readTheme() === "dark" ? "light" : "dark"
    // renkler yumuşak geçsin: kısa süreliğine geçiş sınıfı ekle
    root.classList.add("theme-transition")
    window.setTimeout(() => root.classList.remove("theme-transition"), 400)
    root.dataset.theme = next
    try {
      localStorage.setItem("tema", next)
    } catch {
      // gizli modda saklama başarısız olabilir; tema yine de bu sayfada değişir
    }
    listeners.forEach((callback) => callback())
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="flex size-10 shrink-0 items-center justify-center rounded-full border border-line bg-tile text-ink transition-colors hover:border-brand hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <MoonIcon className="theme-icon theme-icon-moon size-[18px]" aria-hidden />
      <SunIcon className="theme-icon theme-icon-sun size-[18px]" aria-hidden />
    </button>
  )
}
