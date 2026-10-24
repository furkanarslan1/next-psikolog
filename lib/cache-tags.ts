import { updateTag } from "next/cache"

// Herkese açık içerik için önbellek etiketleri. Her sorgu yalnızca ilgili
// etiketleri taşır; admin işlemleri de yalnızca etkilediği etiketleri yeniler.
export const cacheTags = {
  /** Tüm yazı listeleri ve sitemap */
  posts: "posts",
  /** Kategori menüsü (yayınlanmış yazısı olan kategoriler) */
  categories: "categories",
  /** Ana sayfa hero bölümü */
  hero: "hero",
  /** Tek yazı sayfası */
  post: (slug: string) => `post:${slug}`,
  /** Kategori sayfası, o kategorideki yazılar ve onların "benzer yazılar" bölümü */
  category: (slug: string) => `category:${slug}`,
  /** Etiket sayfası */
  tag: (slug: string) => `tag:${slug}`,
}

type Affected = {
  postSlugs?: (string | null | undefined)[]
  categorySlugs?: (string | null | undefined)[]
  tagSlugs?: (string | null | undefined)[]
  /** Kategori menüsü veya listeler etkilenmiyorsa false */
  lists?: boolean
}

// Yalnızca Server Action içinden çağrılır (updateTag kısıtı).
export function invalidateBlog({
  postSlugs = [],
  categorySlugs = [],
  tagSlugs = [],
  lists = true,
}: Affected) {
  const tags = new Set<string>()
  if (lists) {
    tags.add(cacheTags.posts)
    tags.add(cacheTags.categories)
  }
  for (const slug of postSlugs) if (slug) tags.add(cacheTags.post(slug))
  for (const slug of categorySlugs) if (slug) tags.add(cacheTags.category(slug))
  for (const slug of tagSlugs) if (slug) tags.add(cacheTags.tag(slug))

  for (const tag of tags) updateTag(tag)
}

// Yalnızca Server Action içinden çağrılır.
export function invalidateHero() {
  updateTag(cacheTags.hero)
}
