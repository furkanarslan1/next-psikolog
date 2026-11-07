// Küçük iki dilli yapı: Türkçe (varsayılan, ön eksiz) ve Fransızca (/fr/...).
// Fransızca yalnızca üç sayfadır: Présentation, Publications, Contact.
export type Locale = "tr" | "fr"

export const FR_HOME = "/fr"

type Page = { href: string; label: string; prefixes: string[] }

export const dict = {
  tr: {
    lang: "tr",
    ogLocale: "tr_TR",
    home: "/",
    nav: [
      { href: "/", label: "Anasayfa", prefixes: [] },
      { href: "/hakkimda", label: "Hakkımda", prefixes: ["/hakkimda"] },
      { href: "/yazilar", label: "Yazılar", prefixes: ["/yazilar"] },
      { href: "/iletisim", label: "İletişim", prefixes: ["/iletisim"] },
    ] as Page[],
    navAria: "Ana menü",
    skip: "İçeriğe atla",
    notFound: { title: "Sayfa bulunamadı", text: "Aradığınız sayfa taşınmış ya da hiç var olmamış olabilir.", button: "Ana sayfaya dön" },
    mobileNavAria: "Mobil menü",
    role: "Psikolog",
    tagline: "Psikolog · Psikanaliz Formasyonunda",
    cta: {
      title: "Bana Ulaşın",
      text: "Bilgi almak ve randevu için yazın",
      button: "İletişim",
      hideOn: "/iletisim",
    },
    footer: { links: "Bağlantılar", up: "Yukarı ↑" },
    types: { YAZI: "Yazı", CEVIRI: "Çeviri" },
    read: "Oku →",
    featured: { title: "Öne çıkanlar", prev: "Önceki", next: "Sonraki", hint: "Kaydırın →", goTo: "Kart" },
    hero: { primary: "Hakkımda", primaryHref: "/hakkimda", secondary: "İletişime Geçin →", secondaryHref: "/iletisim" },
    recent: { title: "Son yazılar", all: "Tüm Yazılar →", allHref: "/yazilar", empty: "Henüz yayınlanmış kayıt yok. Yeni yazılar yayınlandığında burada görünecek." },
    article: {
      rootLabel: "Yazılar",
      rootHref: "/yazilar",
      typePlural: { YAZI: "Yazılar", CEVIRI: "Çeviriler" },
      typeHref: { YAZI: "/yazilar/tur/yazi", CEVIRI: "/yazilar/tur/ceviri" },
      readMinutes: "dk okuma",
      publishedIn: "Yayımlandığı yer",
      originalAria: "Orijinal metin",
      originalAuthor: "Orijinal yazar",
      originalTitle: "Orijinal başlık",
      source: "Kaynak",
      goToSource: "Kaynağa git",
      externalNote: "Bu metnin tamamı dış kaynakta yayımlanmıştır.",
      fullTextLink: "Tam metne git →",
    },
    contact: {
      email: "E-posta",
      phone: "Telefon",
      whatsapp: "WhatsApp",
      whatsappAction: "Mesaj gönderin",
      address: "Adres",
      addressAction: "Yol tarifi al",
      whatsappText: "Merhaba, randevu hakkında bilgi almak istiyorum.",
    },
    dateLocale: "tr-TR",
  },
  fr: {
    lang: "fr",
    ogLocale: "fr_FR",
    home: FR_HOME,
    nav: [
      { href: "/fr", label: "Accueil", prefixes: [] },
      { href: "/fr/presentation", label: "Présentation", prefixes: ["/fr/presentation"] },
      { href: "/fr/publications", label: "Publications", prefixes: ["/fr/publications"] },
      { href: "/fr/contact", label: "Contact", prefixes: ["/fr/contact"] },
    ] as Page[],
    navAria: "Menu principal",
    skip: "Aller au contenu",
    notFound: { title: "Page introuvable", text: "La page demandée a peut-être été déplacée ou n'a jamais existé.", button: "Retour à l'accueil" },
    mobileNavAria: "Menu mobile",
    role: "Psychologue",
    tagline: "Psychologue · formation psychanalytique en cours",
    cta: {
      title: "Me contacter",
      text: "Pour toute information ou prise de rendez-vous, écrivez-moi",
      button: "Contact",
      hideOn: "/fr/contact",
    },
    footer: { links: "Liens", up: "Haut ↑" },
    types: { YAZI: "Texte", CEVIRI: "Traduction" },
    read: "Lire →",
    featured: { title: "À la une", prev: "Précédent", next: "Suivant", hint: "Faites glisser →", goTo: "Carte" },
    hero: { primary: "Présentation", primaryHref: "/fr/presentation", secondary: "Me contacter →", secondaryHref: "/fr/contact" },
    recent: { title: "Dernières publications", all: "Toutes les publications →", allHref: "/fr/publications", empty: "Aucune publication pour le moment." },
    article: {
      rootLabel: "Publications",
      rootHref: "/fr/publications",
      typePlural: { YAZI: "Textes", CEVIRI: "Traductions" },
      typeHref: { YAZI: "/fr/publications", CEVIRI: "/fr/publications" },
      readMinutes: "min de lecture",
      publishedIn: "Publié dans",
      originalAria: "Texte original",
      originalAuthor: "Auteur original",
      originalTitle: "Titre original",
      source: "Source",
      goToSource: "Voir la source",
      externalNote: "Le texte intégral est publié sur une source externe.",
      fullTextLink: "Lire le texte intégral →",
    },
    contact: {
      email: "E-mail",
      phone: "Téléphone",
      whatsapp: "WhatsApp",
      whatsappAction: "Envoyer un message",
      address: "Adresse",
      addressAction: "Itinéraire",
      whatsappText: "Bonjour, je souhaiterais des informations sur un rendez-vous.",
    },
    dateLocale: "fr-FR",
  },
} as const

export const frDescription =
  "Eren Arslan, psychologue à Istanbul : formation psychanalytique d'orientation lacanienne, séances en turc, textes et traductions sur la psychanalyse."

// Karşılıklı sayfalar: dil seçici ve hreflang bu eşleşmeyi kullanır.
// Karşılığı olmayan sayfa, diğer dilin ana sayfasına gider (404'e düşmez).
export const pairs = [
  { tr: "/", fr: "/fr" },
  { tr: "/hakkimda", fr: "/fr/presentation" },
  { tr: "/yazilar", fr: "/fr/publications" },
  { tr: "/iletisim", fr: "/fr/contact" },
] as const

export function counterpart(pathname: string, to: Locale) {
  if (to === "fr") {
    // yazı sayfası: aynı yazının Fransızca kabuklu hali
    const post = pathname.match(/^\/yazilar\/([^/]+)$/)
    if (post && post[1] !== "sayfa" && post[1] !== "tur") return `/fr/publications/${post[1]}`
    const match = pairs.find(
      (pair) =>
        pathname === pair.tr ||
        (pair.tr === "/yazilar" && /^\/yazilar\/(sayfa|tur)(\/|$)/.test(pathname))
    )
    return match ? match.fr : FR_HOME
  }
  const post = pathname.match(/^\/fr\/publications\/([^/]+)$/)
  if (post) return `/yazilar/${post[1]}`
  const match = pairs.find((pair) => pathname === pair.fr)
  return match ? match.tr : "/"
}

// TR sayfası için <link rel="alternate" hreflang>; FR karşılığı olan sayfalarda kullanılır
export function languageAlternates(trPath: string) {
  const pair = pairs.find((item) => item.tr === trPath)
  if (!pair) return undefined
  return { "tr-TR": pair.tr, "fr-FR": pair.fr, "x-default": pair.tr }
}

export function formatDateLocale(date: Date, locale: Locale) {
  return new Intl.DateTimeFormat(dict[locale].dateLocale, {
    dateStyle: "long",
    timeZone: "Europe/Istanbul",
  }).format(date)
}
