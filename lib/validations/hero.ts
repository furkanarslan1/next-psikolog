import { z } from "zod"

// Site içi yol (/iletisim), https adresi, mailto: veya tel: kabul edilir.
// "//" ile başlayanlar (protokolsüz dış adres) ve javascript: reddedilir.
const isSafeLink = (value: string) =>
  (value.startsWith("/") && !value.startsWith("//")) ||
  value.startsWith("https://") ||
  value.startsWith("mailto:") ||
  value.startsWith("tel:")

export const heroSchema = z
  .object({
    headline: z
      .string()
      .trim()
      .min(2, "Başlık en az 2 karakter olmalıdır")
      .max(120, "Başlık en fazla 120 karakter olabilir"),
    description: z.string().trim().max(280, "Açıklama en fazla 280 karakter olabilir"),
    buttonLabel: z
      .string()
      .trim()
      .min(2, "Buton yazısı en az 2 karakter olmalıdır")
      .max(30, "Buton yazısı en fazla 30 karakter olabilir"),
    buttonUrl: z
      .string()
      .trim()
      .min(1, "Buton bağlantısı zorunludur")
      .refine(
        isSafeLink,
        "Bağlantı / ile (örn. /iletisim), https:// , mailto: veya tel: ile başlamalıdır"
      ),
    imageUrl: z
      .string()
      .refine(
        (value) => value === "" || value.startsWith("https://res.cloudinary.com/"),
        "Görsel Cloudinary üzerinden yüklenmelidir"
      ),
    imageAlt: z.string().trim().max(150, "Alt metin en fazla 150 karakter olabilir"),
  })
  .superRefine((data, ctx) => {
    if (data.imageUrl && !data.imageAlt) {
      ctx.addIssue({
        code: "custom",
        path: ["imageAlt"],
        message: "Görsel için bir açıklama girin",
      })
    }
  })

export type HeroValues = z.infer<typeof heroSchema>
