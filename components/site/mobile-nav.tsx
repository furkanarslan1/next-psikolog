"use client"

import { CalendarCheckIcon, HomeIcon, MailIcon, NewspaperIcon, UserRoundIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const left = [
  { href: "/", label: "Anasayfa", icon: HomeIcon, prefixes: [] as string[] },
  {
    href: "/yazilar",
    label: "Blog",
    icon: NewspaperIcon,
    prefixes: ["/yazilar", "/blog", "/kategori", "/etiket"],
  },
]
const right = [
  { href: "/hakkimda", label: "Hakkımda", icon: UserRoundIcon, prefixes: ["/hakkimda"] },
  { href: "/iletisim", label: "İletişim", icon: MailIcon, prefixes: ["/iletisim"] },
]

type Item = (typeof left)[number]

export function MobileNav({
  appointmentHref,
  external,
}: {
  appointmentHref: string
  external: boolean
}) {
  const pathname = usePathname()

  function renderItem(item: Item) {
    const active =
      item.href === "/" ? pathname === "/" : item.prefixes.some((p) => pathname.startsWith(p))
    return (
      <li key={item.href} className="flex-1">
        <Link
          href={item.href}
          aria-current={active ? "page" : undefined}
          className={`flex flex-col items-center gap-1 rounded-2xl py-1.5 text-[11px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
            active ? "text-white" : "text-white/55 active:text-white"
          }`}
        >
          <item.icon className="size-5" strokeWidth={active ? 2.25 : 1.75} aria-hidden />
          {item.label}
          <span
            aria-hidden
            className={`-mt-0.5 h-0.5 w-4 rounded-full transition-opacity ${
              active ? "bg-white opacity-100" : "opacity-0"
            }`}
          />
        </Link>
      </li>
    )
  }

  return (
    <nav
      aria-label="Mobil menü"
      className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
    >
      <ul className="relative mx-auto flex max-w-md items-end rounded-[1.75rem] bg-anthracite px-2 pt-2 pb-1.5 shadow-[0_10px_30px_-8px_rgba(31,35,39,0.55)] ring-1 ring-white/10">
        {left.map(renderItem)}
        <li className="flex flex-1 justify-center">
          <a
            href={appointmentHref}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            aria-label="Randevu al"
            className="-mt-9 flex flex-col items-center gap-1 text-[11px] font-semibold text-white focus-visible:outline-none"
          >
            <span className="flex size-14 items-center justify-center rounded-full bg-white text-anthracite shadow-[0_8px_20px_-4px_rgba(31,35,39,0.5)] ring-4 ring-paper transition-transform active:scale-95">
              <CalendarCheckIcon className="size-6" aria-hidden />
            </span>
            Randevu al
          </a>
        </li>
        {right.map(renderItem)}
      </ul>
    </nav>
  )
}
