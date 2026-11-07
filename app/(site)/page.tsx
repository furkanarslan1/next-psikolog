import type { Metadata } from "next"

import { Hero } from "@/components/site/hero"
import { JsonLd } from "@/components/site/json-ld"
import { RecentPosts } from "@/components/site/recent-posts"
import { socialItems } from "@/components/site/social-links"
import { HOME_POST_COUNT } from "@/lib/blog-config"
import { languageAlternates } from "@/lib/i18n"
import { getContact } from "@/lib/queries/contact"
import { getHero } from "@/lib/queries/hero"
import { getPostsPage } from "@/lib/queries/posts"
import { absoluteUrl, siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  description: siteConfig.description,
  alternates: { canonical: "/", languages: languageAlternates("/") },
}

export default async function HomePage() {
  const [hero, contact, { posts }] = await Promise.all([
    getHero(),
    getContact(),
    getPostsPage({ page: 1, pageSize: HOME_POST_COUNT }),
  ])

  const social = socialItems(contact)

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": `${absoluteUrl("/")}#website`,
              url: absoluteUrl("/"),
              name: siteConfig.name,
              inLanguage: "tr-TR",
            },
            {
              "@type": "Person",
              "@id": `${absoluteUrl("/")}#person`,
              name: siteConfig.name,
              url: absoluteUrl("/"),
              jobTitle: "Psikolog",
              description: siteConfig.description,
              knowsAbout: ["Psikanaliz", "Lacancı psikanaliz"],
              address: { "@type": "PostalAddress", addressLocality: "İstanbul", addressCountry: "TR" },
              sameAs: social.map((item) => item.href),
            },
          ],
        }}
      />
      <Hero hero={hero} social={social} />
      <RecentPosts posts={posts} />
    </>
  )
}
