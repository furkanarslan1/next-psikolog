import { z } from "zod"

export const heroSchema = z.object({
  headline: z
    .string()
    .trim()
    .min(2, "Başlık en az 2 karakter olmalıdır")
    .max(120, "Başlık en fazla 120 karakter olabilir"),
  description: z.string().trim().max(400, "Açıklama en fazla 400 karakter olabilir"),
})

export type HeroValues = z.infer<typeof heroSchema>
