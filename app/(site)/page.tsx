import type { Metadata } from "next"

import { Hero } from "@/components/site/hero"
import { RecentPosts } from "@/components/site/recent-posts"
import { socialItems } from "@/components/site/social-links"
import { HOME_POST_COUNT } from "@/lib/blog-config"
import { getContact } from "@/lib/queries/contact"
import { getHero } from "@/lib/queries/hero"
import { getPostsPage } from "@/lib/queries/posts"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  description: siteConfig.description,
  alternates: { canonical: "/" },
}

export default async function HomePage() {
  const [hero, contact, { posts }] = await Promise.all([
    getHero(),
    getContact(),
    getPostsPage({ page: 1, pageSize: HOME_POST_COUNT }),
  ])

  return (
    <>
      <Hero hero={hero} social={socialItems(contact)} />
      <RecentPosts posts={posts} />
    </>
  )
}
