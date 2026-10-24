import { MobileNav } from "@/components/site/mobile-nav"
import { WHATSAPP_TEXT } from "@/components/site/contact-items"
import { whatsappHref } from "@/lib/phone"
import { getContact } from "@/lib/queries/contact"

export async function MobileNavLoader() {
  const contact = await getContact()
  const whatsapp = contact?.whatsapp ? whatsappHref(contact.whatsapp, WHATSAPP_TEXT) : null

  return whatsapp ? (
    <MobileNav appointmentHref={whatsapp} external />
  ) : (
    <MobileNav appointmentHref="/iletisim" external={false} />
  )
}
