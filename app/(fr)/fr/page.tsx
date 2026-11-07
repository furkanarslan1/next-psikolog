import type { Metadata } from "next"

import { Hero } from "@/components/site/hero"
import { RecentPosts } from "@/components/site/recent-posts"
import { socialItems } from "@/components/site/social-links"
import { HOME_POST_COUNT } from "@/lib/blog-config"
import { frDescription, languageAlternates } from "@/lib/i18n"
import { getContact } from "@/lib/queries/contact"
import { getHero } from "@/lib/queries/hero"
import { getPostsPage } from "@/lib/queries/posts"
import { defaultOgImages, siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: { absolute: "Eren Arslan — Psychologue, orientation psychanalytique" },
  description: frDescription,
  alternates: { canonical: "/fr", languages: languageAlternates("/") },
  openGraph: {
    type: "website",
    title: "Eren Arslan — Psychologue, orientation psychanalytique",
    description: frDescription,
    url: "/fr",
    siteName: siteConfig.name,
    locale: "fr_FR",
    alternateLocale: ["tr_TR"],
    images: defaultOgImages,
  },
}

export default async function FrenchHomePage() {
  const [hero, contact, { posts }] = await Promise.all([
    getHero(),
    getContact(),
    getPostsPage({ page: 1, pageSize: HOME_POST_COUNT }),
  ])

  return (
    <>
      <Hero hero={hero} social={socialItems(contact)} locale="fr" />
      <RecentPosts posts={posts} locale="fr" />
    </>
  )
}
