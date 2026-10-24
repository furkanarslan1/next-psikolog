import { z } from "zod"

export const postSchema = z.object({
  title: z.string().trim().min(3, "Başlık en az 3 karakter olmalıdır").max(150, "Başlık en fazla 150 karakter olabilir"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug zorunludur")
    .max(100, "Slug en fazla 100 karakter olabilir")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug yalnızca küçük harf, rakam ve tire içerebilir"),
  excerpt: z.string().trim().min(10, "Özet en az 10 karakter olmalıdır").max(300, "Özet en fazla 300 karakter olabilir"),
  content: z.string().trim().min(1, "İçerik zorunludur"),
  coverImageUrl: z.url("Geçerli bir görsel adresi girin").optional().or(z.literal("")),
  coverImageAlt: z.string().trim().max(150).optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  metaTitle: z.string().trim().max(60, "Meta başlık en fazla 60 karakter olmalıdır").optional(),
  metaDescription: z.string().trim().max(160, "Meta açıklama en fazla 160 karakter olmalıdır").optional(),
})

export type PostValues = z.infer<typeof postSchema>
