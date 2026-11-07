/** Ana sayfada gösterilen en yeni yazı sayısı */
export const HOME_POST_COUNT = 3
/** /yazilar ve kategori sayfalarında sayfa başına yazı sayısı */
export const POSTS_PER_PAGE = 9

export function totalPages(total: number) {
  return Math.max(1, Math.ceil(total / POSTS_PER_PAGE))
}

/** Sayfa adresi: 1. sayfa kök adres, diğerleri /sayfa/n */
export function pagePath(base: string, page: number) {
  return page <= 1 ? base : `${base}/sayfa/${page}`
}

/** URL'den gelen sayfa numarası geçerli ve 2 veya daha büyük bir tam sayı mı */
export function parsePageNumber(value: string) {
  const page = Number(value)
  return Number.isInteger(page) && page >= 2 ? page : null
}

export type PostTypeValue = "YAZI" | "CEVIRI"

/** Yazı türleri: URL parçası, veritabanı değeri ve etiketler */
export const postTypes = {
  yazi: { value: "YAZI", label: "Yazı", plural: "Yazılar" },
  ceviri: { value: "CEVIRI", label: "Çeviri", plural: "Çeviriler" },
} as const satisfies Record<string, { value: PostTypeValue; label: string; plural: string }>

export type PostTypeSlug = keyof typeof postTypes

export function parseTypeSlug(value: string): PostTypeSlug | null {
  return value in postTypes ? (value as PostTypeSlug) : null
}

export function typeLabel(type: PostTypeValue) {
  return type === "CEVIRI" ? postTypes.ceviri.label : postTypes.yazi.label
}

/** Liste adresi: tür yoksa tümü */
export function listBase(type?: PostTypeSlug | null) {
  return type ? `/yazilar/tur/${type}` : "/yazilar"
}
