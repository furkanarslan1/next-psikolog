import { z } from "zod"

const isEmptyHtml = (html: string) =>
  html.replace(/<[^>]*>/g, "").trim().length === 0 && !/<img/i.test(html)

export const aboutSchema = z
  .object({
    content: z.string().refine((value) => !isEmptyHtml(value), "Metin zorunludur"),
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

export type AboutValues = z.infer<typeof aboutSchema>
