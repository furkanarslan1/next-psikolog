// Gerçek bilgiler hazır olunca yalnızca bu dosya güncellenir.
export const siteConfig = {
  name: "Eren Arslan",
  // hero üstündeki unvan satırı (yer tutucu; metni Eren yazacak)
  tagline: "Psikolog · Psikanaliz Formasyonunda",
  description: "Psikoloji ve ruh sağlığı üzerine yazılar.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "tr_TR",
}

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString()
}
