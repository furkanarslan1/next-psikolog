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

// bcrypt yalnızca ilk 72 baytı dikkate alır
export const passwordSchema = z
  .string()
  .min(6, "Şifre en az 6 karakter olmalıdır")
  .regex(/[A-Z]/, "Şifre en az bir büyük harf içermelidir")
  .regex(/[^A-Za-z0-9]/, "Şifre en az bir özel karakter içermelidir")
  .refine(
    (value) => new TextEncoder().encode(value).length <= 72,
    "Şifre en fazla 72 bayt olabilir"
  )

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Mevcut şifre zorunludur"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Şifre tekrarı zorunludur"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Şifreler eşleşmiyor",
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    path: ["newPassword"],
    message: "Yeni şifre mevcut şifreden farklı olmalıdır",
  })

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>
