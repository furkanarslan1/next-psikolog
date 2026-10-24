import { MailIcon, MapPinIcon, MessageCircleIcon, PhoneIcon } from "lucide-react"

import { telHref, whatsappHref } from "@/lib/phone"
import type { ContactData } from "@/lib/queries/contact"

const WHATSAPP_TEXT = "Merhaba, randevu hakkında bilgi almak istiyorum."

type Item = {
  key: string
  icon: typeof MailIcon
  label: string
  value: string
  action?: string
  href: string
  external: boolean
}

export function contactItems(contact: ContactData | null): Item[] {
  if (!contact) return []
  const items: Item[] = []

  if (contact.email) {
    items.push({
      key: "email",
      icon: MailIcon,
      label: "E-posta",
      value: contact.email,
      href: `mailto:${contact.email}`,
      external: false,
    })
  }
  const tel = contact.phone ? telHref(contact.phone) : null
  if (contact.phone && tel) {
    items.push({
      key: "phone",
      icon: PhoneIcon,
      label: "Telefon",
      value: contact.phone,
      href: tel,
      external: false,
    })
  }
  const whatsapp = contact.whatsapp
    ? whatsappHref(contact.whatsapp, WHATSAPP_TEXT)
    : null
  if (contact.whatsapp && whatsapp) {
    items.push({
      key: "whatsapp",
      icon: MessageCircleIcon,
      label: "WhatsApp",
      value: contact.whatsapp,
      action: "Mesaj gönderin",
      href: whatsapp,
      external: true,
    })
  }
  if (contact.address) {
    items.push({
      key: "address",
      icon: MapPinIcon,
      label: "Adres",
      value: contact.address,
      action: "Yol tarifi al",
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`,
      external: true,
    })
  }
  return items
}

const columns: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
}

export function ContactItems({ items }: { items: Item[] }) {
  return (
    <ul className={`grid gap-x-8 gap-y-8 sm:grid-cols-2 ${columns[items.length] ?? "lg:grid-cols-4"}`}>
      {items.map((item) => (
        <li key={item.key}>
          <a
            href={item.href}
            {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="group flex h-full items-start gap-4 border-t border-line pt-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-copper"
          >
            <item.icon className="mt-0.5 size-5 shrink-0 text-anthracite" aria-hidden />
            <span className="flex min-w-0 flex-col gap-1.5">
              <span className="text-sm text-ink-soft">{item.label}</span>
              <span className="font-serif-site text-xl leading-snug break-words whitespace-pre-line decoration-copper decoration-2 underline-offset-4 group-hover:underline">
                {item.value}
              </span>
              {item.action && (
                <span className="text-sm font-medium text-copper-ink">{item.action}</span>
              )}
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}
