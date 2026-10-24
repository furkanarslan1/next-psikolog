// Gerçek bilgiler hazır olunca yalnızca bu dosya güncellenir.
export const siteConfig = {
  name: "Psikolog Ad Soyad",
  description: "Psikoloji ve ruh sağlığı üzerine yazılar.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "tr_TR",
}

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString()
}
