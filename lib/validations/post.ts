import { z } from "zod"

const isEmptyHtml = (html: string) =>
  html.replace(/<[^>]*>/g, "").trim().length === 0 && !/<img/i.test(html)

export const postSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Başlık en az 3 karakter olmalıdır")
    .max(150, "Başlık en fazla 150 karakter olabilir"),
  excerpt: z
    .string()
    .trim()
    .min(10, "Özet en az 10 karakter olmalıdır")
    .max(300, "Özet en fazla 300 karakter olabilir"),
  content: z.string().refine((value) => !isEmptyHtml(value), "İçerik zorunludur"),
  coverImageUrl: z
    .url("Geçerli bir görsel adresi girin")
    .refine(
      (value) => value.startsWith("https://res.cloudinary.com/"),
      "Görsel Cloudinary üzerinden yüklenmelidir"
    )
    .or(z.literal("")),
  coverImageAlt: z.string().trim().max(150, "Alt metin en fazla 150 karakter olabilir"),
  categoryId: z.string(),
  tags: z
    .array(z.string().trim().min(1).max(30, "Etiket en fazla 30 karakter olabilir"))
    .max(10, "En fazla 10 etiket ekleyebilirsiniz"),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  metaTitle: z.string().trim().max(60, "Meta başlık en fazla 60 karakter olmalıdır"),
  metaDescription: z
    .string()
    .trim()
    .max(160, "Meta açıklama en fazla 160 karakter olmalıdır"),
}).superRefine((data, ctx) => {
  if (data.status === "PUBLISHED" && !data.categoryId) {
    ctx.addIssue({
      code: "custom",
      path: ["categoryId"],
      message: "Yayınlamak için bir kategori seçin",
    })
  }
  if (data.coverImageUrl && !data.coverImageAlt) {
    ctx.addIssue({
      code: "custom",
      path: ["coverImageAlt"],
      message: "Kapak görseli için bir açıklama girin",
    })
  }
})

export type PostValues = z.infer<typeof postSchema>

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Kategori adı en az 2 karakter olmalıdır")
    .max(50, "Kategori adı en fazla 50 karakter olabilir"),
})

export type CategoryValues = z.infer<typeof categorySchema>
