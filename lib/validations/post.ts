import { z } from "zod"

const isEmptyHtml = (html: string) => html.replace(/<[^>]*>/g, "").trim().length === 0

const optional = (label: string, max: number) =>
  z.string().trim().max(max, `${label} en fazla ${max} karakter olabilir`)

const isHttpUrl = (value: string) => {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol)
  } catch {
    return false
  }
}

export const postSchema = z
  .object({
    type: z.enum(["YAZI", "CEVIRI"]),
    lang: z.enum(["tr", "fr"]),
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
    content: z.string(),
    fullText: z.boolean(),
    publishedIn: optional("Yayımlandığı yer", 150),
    originalAuthor: optional("Orijinal yazar", 120),
    originalTitle: optional("Orijinal başlık", 200),
    originalLang: optional("Orijinal dil", 40),
    sourceCitation: optional("Kaynak", 300),
    sourceUrl: optional("Dış bağlantı", 500).refine(
      (value) => value === "" || isHttpUrl(value),
      "Geçerli bir adres girin (https://...)"
    ),
    status: z.enum(["DRAFT", "PUBLISHED"]),
    metaTitle: z.string().trim().max(60, "Meta başlık en fazla 60 karakter olmalıdır"),
    metaDescription: z
      .string()
      .trim()
      .max(160, "Meta açıklama en fazla 160 karakter olmalıdır"),
  })
  .superRefine((data, ctx) => {
    if (data.fullText && isEmptyHtml(data.content)) {
      ctx.addIssue({ code: "custom", path: ["content"], message: "İçerik zorunludur" })
    }
    if (!data.fullText && !data.sourceUrl) {
      ctx.addIssue({
        code: "custom",
        path: ["sourceUrl"],
        message: "Yalnızca özet gösterilecekse dış bağlantı zorunludur",
      })
    }
    if (data.type === "CEVIRI" && !data.originalAuthor) {
      ctx.addIssue({
        code: "custom",
        path: ["originalAuthor"],
        message: "Çeviri için orijinal yazar zorunludur",
      })
    }
  })

export type PostValues = z.infer<typeof postSchema>
