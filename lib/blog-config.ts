/** Ana sayfada gösterilen en yeni yazı sayısı */
export const HOME_POST_COUNT = 5
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
