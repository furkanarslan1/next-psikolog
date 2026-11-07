import sanitizeHtml from "sanitize-html"

// Tiptap çıktısını kaydetmeden önce temizler: yalnızca editörün ürettiği
// etiketlere izin verir. Sitede görsel yoktur; <img> her zaman atılır.
export function sanitizeContent(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "hr", "h2", "h3", "h4", "strong", "em", "u", "s", "code",
      "pre", "blockquote", "ul", "ol", "li", "a",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        target: "_blank",
        rel: "noopener noreferrer",
      }),
    },
  })
}

// Eskiden kaydedilmiş içerikte kalmış <img> etiketlerini ekrana basmadan önce atar.
export function stripImages(html: string) {
  return html.replace(/<img\b[^>]*>/gi, "")
}
