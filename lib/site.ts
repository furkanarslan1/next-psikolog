// Gerçek bilgiler hazır olunca yalnızca bu dosya güncellenir.
export const siteConfig = {
  name: "Eren Arslan",
  // hero üstündeki unvan satırı (yer tutucu; metni Eren yazacak)
  tagline: "Psikolog · Psikanaliz Formasyonunda",
  description: "Psikoloji ve ruh sağlığı üzerine yazılar.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "tr_TR",
  // yalnızca Instagram gösterilir; admin'de girilmezse bu kullanıcı adı kullanılır
  instagram: "pskerenarslan",
}

// Footer'daki kurumsal bağlantılar. href yoksa düz yazı olarak gösterilir.
export const institutions: { name: string; href?: string }[] = [
  { name: "IF-EPFCL", href: "http://www.champlacanien.net/public/2/epPresentation.php" },
  // TODO: Lacancı Forum Türkiye'nin adresi gelince href eklenecek
  { name: "Lacancı Forum Türkiye" },
]

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString()
}
