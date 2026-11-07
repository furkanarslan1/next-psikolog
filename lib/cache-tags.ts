import { updateTag } from "next/cache"

// Herkese açık içerik için önbellek etiketleri. Her sorgu yalnızca ilgili
// etiketleri taşır; admin işlemleri de yalnızca etkilediği etiketleri yeniler.
export const cacheTags = {
  /** Tüm yazı listeleri ve sitemap */
  posts: "posts",
  /** Ana sayfa hero bölümü */
  hero: "hero",
  /** Hakkımda bölümü ve sayfası */
  about: "about",
  /** İletişim bilgileri */
  contact: "contact",
  /** Tek yazı sayfası */
  post: (slug: string) => `post:${slug}`,
}

// Yalnızca Server Action içinden çağrılır (updateTag kısıtı).
export function invalidateBlog({ postSlugs = [] }: { postSlugs?: (string | null | undefined)[] }) {
  const tags = new Set<string>([cacheTags.posts])
  for (const slug of postSlugs) if (slug) tags.add(cacheTags.post(slug))

  for (const tag of tags) updateTag(tag)
}

// Yalnızca Server Action içinden çağrılır.
export function invalidateHero() {
  updateTag(cacheTags.hero)
}

// Yalnızca Server Action içinden çağrılır.
export function invalidateContact() {
  updateTag(cacheTags.contact)
}

// Yalnızca Server Action içinden çağrılır.
export function invalidateAbout() {
  updateTag(cacheTags.about)
}
