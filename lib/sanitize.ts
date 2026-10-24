import sanitizeHtml from "sanitize-html"

// Tiptap çıktısını kaydetmeden önce temizler: yalnızca editörün ürettiği
// etiketlere izin verir, görseller sadece Cloudinary'den gelebilir.
export function sanitizeContent(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "hr", "h2", "h3", "h4", "strong", "em", "u", "s", "code",
      "pre", "blockquote", "ul", "ol", "li", "a", "img",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { img: ["https"] },
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        target: "_blank",
        rel: "noopener noreferrer",
      }),
    },
    exclusiveFilter: (frame) =>
      frame.tag === "img" &&
      !frame.attribs.src?.startsWith("https://res.cloudinary.com/"),
  })
}
