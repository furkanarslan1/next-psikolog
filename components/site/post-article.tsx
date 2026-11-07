import Link from "next/link"

import { JsonLd } from "@/components/site/json-ld"
import { formatDate } from "@/lib/format"
import { dict, type Locale } from "@/lib/i18n"
import type { getPostBySlug } from "@/lib/queries/posts"
import { readingMinutes } from "@/lib/reading-time"
import { stripImages } from "@/lib/sanitize"
import { absoluteUrl, siteConfig } from "@/lib/site"

type Post = NonNullable<Awaited<ReturnType<typeof getPostBySlug>>>

const locales = { tr: "tr-TR", fr: "fr-FR" } as const
const focus = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"

// Türkçe (/yazilar/[slug]) ve Fransızca kabuklu (/fr/publications/[slug]) yazı sayfası.
// Metin dili post.lang'dir; menü ve etiketler sayfa diline göre gelir.
export function PostArticle({ post, locale }: { post: Post; locale: Locale }) {
  const t = dict[locale]
  const a = t.article
  // iki sürüm de aynı içeriği taşır; arama motorları için tek kanonik adres Türkçe sayfadır
  const url = absoluteUrl(`/yazilar/${post.slug}`)
  const translation = post.type === "CEVIRI"
  const person = { "@type": "Person", name: siteConfig.name }

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              "@id": `${url}#article`,
              headline: post.title,
              description: post.metaDescription || post.excerpt,
              datePublished: post.publishedAt?.toISOString(),
              dateModified: post.updatedAt.toISOString(),
              inLanguage: locales[post.lang as keyof typeof locales] ?? locales.tr,
              mainEntityOfPage: url,
              ...(translation
                ? {
                    author: post.originalAuthor
                      ? { "@type": "Person", name: post.originalAuthor }
                      : person,
                    translator: person,
                    isBasedOn: {
                      "@type": "CreativeWork",
                      name: post.originalTitle ?? undefined,
                      url: post.sourceUrl ?? undefined,
                    },
                  }
                : { author: person }),
              publisher: person,
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: a.rootLabel,
                  item: absoluteUrl(a.rootHref),
                },
                { "@type": "ListItem", position: 2, name: post.title, item: url },
              ],
            },
          ],
        }}
      />

      <article
        lang={post.lang}
        className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-12 sm:px-8 sm:py-16"
      >
        <header className="mx-auto flex w-full max-w-[70ch] flex-col gap-5">
          <nav aria-label="Konum / Fil d'Ariane" lang={locale} className="label-caps text-ink-soft">
            <Link href={a.rootHref} className={`hover:text-brand ${focus}`}>
              {a.rootLabel}
            </Link>
            {locale === "tr" && (
              <>
                <span aria-hidden className="mx-2">/</span>
                <Link href={a.typeHref[post.type]} className={`text-brand ${focus}`}>
                  {a.typePlural[post.type]}
                </Link>
              </>
            )}
          </nav>
          <h1 className="font-serif-site text-4xl leading-[1.08] font-normal tracking-tight text-balance sm:text-6xl">
            {post.title}
          </h1>
          <p className="text-xl leading-relaxed text-ink-soft">{post.excerpt}</p>
          <p lang={locale} className="label-caps flex flex-wrap gap-x-5 gap-y-2 text-ink-soft">
            <span className="text-brand">{t.types[post.type]}</span>
            {post.publishedAt && (
              <time dateTime={post.publishedAt.toISOString()}>
                {formatDate(post.publishedAt, locale)}
              </time>
            )}
            {post.fullText && (
              <span>
                {readingMinutes(post.content)} {a.readMinutes}
              </span>
            )}
          </p>
          {post.publishedIn && (
            <p lang={locale} className="text-base text-ink-soft">
              {a.publishedIn}: <span className="text-ink">{post.publishedIn}</span>
            </p>
          )}
        </header>

        {translation && (post.originalAuthor || post.originalTitle || post.sourceCitation) && (
          <aside
            lang={locale}
            aria-label={a.originalAria}
            className="mx-auto w-full max-w-[70ch] border-y border-line py-5 text-base leading-relaxed text-ink-soft"
          >
            <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[9rem_1fr]">
              {post.originalAuthor && (
                <>
                  <dt className="label-caps text-ink">{a.originalAuthor}</dt>
                  <dd>{post.originalAuthor}</dd>
                </>
              )}
              {post.originalTitle && (
                <>
                  <dt className="label-caps text-ink">{a.originalTitle}</dt>
                  <dd>
                    <span lang={post.originalLang ?? undefined}>{post.originalTitle}</span>
                    {post.originalLang && ` (${post.originalLang})`}
                  </dd>
                </>
              )}
              {post.sourceCitation && (
                <>
                  <dt className="label-caps text-ink">{a.source}</dt>
                  <dd>
                    {post.sourceCitation}
                    {post.fullText && post.sourceUrl && (
                      <>
                        {" "}
                        <a
                          href={post.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-brand underline underline-offset-4 ${focus}`}
                        >
                          {a.goToSource}
                        </a>
                      </>
                    )}
                  </dd>
                </>
              )}
            </dl>
          </aside>
        )}

        {post.fullText ? (
          <div
            className="rich-content mx-auto w-full max-w-[70ch]"
            // içerik kaydedilirken sunucuda temizlenir (lib/sanitize.ts)
            dangerouslySetInnerHTML={{ __html: stripImages(post.content) }}
          />
        ) : (
          <div lang={locale} className="mx-auto flex w-full max-w-[70ch] flex-col items-start gap-5">
            <p className="text-lg leading-relaxed text-ink-soft">{a.externalNote}</p>
            {post.sourceUrl && (
              <a
                href={post.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn-primary ${focus}`}
              >
                {a.fullTextLink}
              </a>
            )}
          </div>
        )}
      </article>
    </>
  )
}
