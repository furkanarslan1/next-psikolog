import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "E-posta zorunludur")
    .pipe(z.email("Geçerli bir e-posta adresi girin")),
  password: z.string().min(1, "Şifre zorunludur"),
})

export type LoginValues = z.infer<typeof loginSchema>
