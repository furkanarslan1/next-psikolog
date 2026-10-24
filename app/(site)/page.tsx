import type { Metadata } from "next"
import Link from "next/link"

import { AboutSection } from "@/components/site/about-section"
import { ContactSection } from "@/components/site/contact-section"
import { CategoryNav } from "@/components/site/category-nav"
import { Hero } from "@/components/site/hero"
import { PageHeading } from "@/components/site/page-heading"
import { EmptyPosts, PostGrid } from "@/components/site/post-card"
import { getAbout } from "@/lib/queries/about"
import { getContact } from "@/lib/queries/contact"
import { getHero } from "@/lib/queries/hero"
import { HOME_POST_COUNT } from "@/lib/blog-config"
import { getCategoriesWithPosts, getPostsPage } from "@/lib/queries/posts"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Yazılarım",
  description: siteConfig.description,
  alternates: { canonical: "/" },
}

export default async function HomePage() {
  const [hero, about, contact, { posts, total }, categories] = await Promise.all([
    getHero(),
    getAbout(),
    getContact(),
    getPostsPage({ page: 1, pageSize: HOME_POST_COUNT }),
    getCategoriesWithPosts(),
  ])

  return (
    <>
      {hero && <Hero hero={hero} />}
      <AboutSection about={about} />
      <div
        id="yazilar"
        className="mx-auto flex w-full max-w-6xl scroll-mt-4 flex-col gap-10 px-5 py-14 sm:px-8 sm:py-20"
      >
        {/* hero varsa sayfanın h1'i hero başlığıdır */}
        <PageHeading title="Yazılarım" as={hero ? "h2" : "h1"} />
        <CategoryNav categories={categories} />
        {posts.length === 0 ? <EmptyPosts /> : <PostGrid posts={posts} />}
        {total > HOME_POST_COUNT && (
          <div className="flex justify-center border-t border-line pt-10">
            <Link
              href="/yazilar"
              className="inline-flex items-center rounded-xs bg-anthracite px-7 py-3.5 text-base font-medium text-white transition-colors hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-anthracite"
            >
              Daha fazla oku
            </Link>
          </div>
        )}
      </div>
      <ContactSection contact={contact} />
    </>
  )
}
