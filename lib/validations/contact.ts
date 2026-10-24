import { z } from "zod"

import { normalizePhone } from "@/lib/phone"
import { parseInstagram, parseX } from "@/lib/social"

const optionalPhone = (label: string) =>
  z
    .string()
    .trim()
    .max(30, `${label} çok uzun`)
    .refine(
      (value) => value === "" || normalizePhone(value) !== null,
      `Geçerli bir ${label.toLowerCase()} girin (örn. 0532 123 45 67)`
    )

export const contactSchema = z.object({
  email: z
    .string()
    .trim()
    .max(120, "E-posta çok uzun")
    .refine(
      (value) => value === "" || z.email().safeParse(value).success,
      "Geçerli bir e-posta adresi girin"
    ),
  phone: optionalPhone("Telefon"),
  whatsapp: optionalPhone("WhatsApp numarası"),
  address: z.string().trim().max(250, "Adres en fazla 250 karakter olabilir"),
  instagram: z
    .string()
    .trim()
    .max(120, "Instagram bilgisi çok uzun")
    .refine((value) => value === "" || parseInstagram(value) !== null, "Geçerli bir Instagram kullanıcı adı veya adresi girin"),
  x: z
    .string()
    .trim()
    .max(120, "X bilgisi çok uzun")
    .refine((value) => value === "" || parseX(value) !== null, "Geçerli bir X kullanıcı adı veya adresi girin"),
})

export type ContactValues = z.infer<typeof contactSchema>
