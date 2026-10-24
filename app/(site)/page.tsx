import type { Metadata } from "next"

import { AboutSection } from "@/components/site/about-section"
import { ContactSection } from "@/components/site/contact-section"
import { CategoryNav } from "@/components/site/category-nav"
import { Hero } from "@/components/site/hero"
import { PageHeading } from "@/components/site/page-heading"
import { EmptyPosts, PostGrid } from "@/components/site/post-card"
import { getAbout } from "@/lib/queries/about"
import { getContact } from "@/lib/queries/contact"
import { getHero } from "@/lib/queries/hero"
import { getCategoriesWithPosts, getPublishedPosts } from "@/lib/queries/posts"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Yazılarım",
  description: siteConfig.description,
  alternates: { canonical: "/" },
}

export default async function HomePage() {
  const [hero, about, contact, posts, categories] = await Promise.all([
    getHero(),
    getAbout(),
    getContact(),
    getPublishedPosts(),
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
        <PageHeading
          title="Yazılarım"
          description={siteConfig.description}
          as={hero ? "h2" : "h1"}
        />
        <CategoryNav categories={categories} />
        {posts.length === 0 ? <EmptyPosts /> : <PostGrid posts={posts} />}
      </div>
      <ContactSection contact={contact} />
    </>
  )
}
