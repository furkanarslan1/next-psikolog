import type { Metadata } from "next"

import { PageHeading } from "@/components/site/page-heading"
import { PostList } from "@/components/site/post-list"
import { frDescription, languageAlternates } from "@/lib/i18n"
import { getPostsPage } from "@/lib/queries/posts"
import { defaultOgImages, siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Publications",
  description: frDescription,
  alternates: { canonical: "/fr/publications", languages: languageAlternates("/yazilar") },
  openGraph: {
    type: "website",
    title: "Publications",
    description: frDescription,
    url: "/fr/publications",
    siteName: siteConfig.name,
    locale: "fr_FR",
    alternateLocale: ["tr_TR"],
    images: defaultOgImages,
  },
}

// Fransızca sürümde sayfalama yok: tüm yayınlar tek listede
const PAGE_SIZE = 100

export default async function PublicationsPage() {
  const { posts } = await getPostsPage({ page: 1, pageSize: PAGE_SIZE })

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-14 sm:px-8 sm:py-20">
      <PageHeading
        title="Publications"
        description="Textes et traductions. Les titres et les textes sont en turc."
      />
      {posts.length === 0 ? (
        <p className="max-w-prose text-lg text-ink-soft">
          Aucune publication pour le moment.
        </p>
      ) : (
        <PostList posts={posts} locale="fr" />
      )}
    </div>
  )
}
