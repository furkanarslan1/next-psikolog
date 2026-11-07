import { z } from "zod"

const isEmptyHtml = (html: string) => html.replace(/<[^>]*>/g, "").trim().length === 0

export const aboutSchema = z.object({
  content: z.string().refine((value) => !isEmptyHtml(value), "Metin zorunludur"),
  // Fransızca "Présentation" metni isteğe bağlıdır
  contentFr: z.string(),
})

export type AboutValues = z.infer<typeof aboutSchema>
