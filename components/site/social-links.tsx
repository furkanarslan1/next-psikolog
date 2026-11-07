import { InstagramIcon, XIcon } from "@/components/site/social-icons"
import type { ContactData } from "@/lib/queries/contact"
import { instagramUrl, xUrl } from "@/lib/social"

export function socialItems(contact: ContactData | null) {
  if (!contact) return []
  const items: { key: string; label: string; handle: string; href: string; icon: typeof XIcon }[] = []
  if (contact.instagram) {
    items.push({
      key: "instagram",
      label: "Instagram",
      handle: `@${contact.instagram}`,
      href: instagramUrl(contact.instagram),
      icon: InstagramIcon,
    })
  }
  if (contact.x) {
    items.push({
      key: "x",
      label: "X",
      handle: `@${contact.x}`,
      href: xUrl(contact.x),
      icon: XIcon,
    })
  }
  return items
}

type Items = ReturnType<typeof socialItems>

// Yuvarlak simge butonları
const buttonVariants = {
  light:
    "border-line text-ink hover:border-brand hover:bg-brand hover:text-on-brand focus-visible:outline-brand",
}

export function SocialIconButtons({
  items,
  className = "",
  variant = "light",
}: {
  items: Items
  className?: string
  variant?: keyof typeof buttonVariants
}) {
  if (items.length === 0) return null
  return (
    <ul className={`flex items-center gap-3 ${className}`}>
      {items.map((item) => (
        <li key={item.key}>
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${item.label}: ${item.handle}`}
            className={`flex size-12 items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${buttonVariants[variant]}`}
          >
            <item.icon className="size-5" />
          </a>
        </li>
      ))}
    </ul>
  )
}

// "Beni sosyal medyadan takip edin" şeridinin içeriği (iletişim bölümü ve sayfası)
export function SocialBandContent({ items }: { items: Items }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
      <p className="font-serif-site text-xl text-ink sm:text-2xl">
        Beni sosyal medyadan takip edin
      </p>
      <SocialIconButtons items={items} />
    </div>
  )
}
