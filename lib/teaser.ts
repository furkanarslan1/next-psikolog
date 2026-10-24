// Zengin metinden düz metin önizleme üretir (paragraf sonları korunur).
export function plainText(html: string) {
  return html
    .replace(/<\/(p|h[1-6]|li|blockquote)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n\n")
    .trim()
}

// En fazla `max` karakter, kelime sınırında keser. Kesildiyse truncated true döner.
export function teaser(html: string, max: number) {
  const text = plainText(html)
  if (text.length <= max) return { text, truncated: false }
  const cut = text.slice(0, max)
  const lastSpace = cut.lastIndexOf(" ")
  return { text: `${cut.slice(0, lastSpace > 0 ? lastSpace : max).trimEnd()}…`, truncated: true }
}
