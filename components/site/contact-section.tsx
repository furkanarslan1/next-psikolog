import { ContactItems, contactItems } from "@/components/site/contact-items"
import type { ContactData } from "@/lib/queries/contact"

// Ana sayfada hero'nun altında görünen iletişim bölümü
export function ContactSection({ contact }: { contact: ContactData | null }) {
  const items = contactItems(contact)
  if (items.length === 0) return null

  return (
    <section aria-labelledby="contact-heading" className="border-t border-line bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-12 sm:px-8 sm:py-14">
        <h2
          id="contact-heading"
          className="font-serif-site text-2xl sm:text-3xl font-normal tracking-tight"
        >
          İletişim
        </h2>
        <ContactItems items={items} />
      </div>
    </section>
  )
}
