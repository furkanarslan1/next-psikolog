@AGENTS.md

# Proje

Psikolog **Eren Arslan** için tanıtım + blog sitesi. SEO çok önemli. Arayüz metinleri Türkçe.
Next.js 16 (App Router, `cacheComponents` + `partialPrefetching` açık), Auth.js v5, Prisma 7 + Neon (Postgres), Tiptap, shadcn/ui (base-nova), React Hook Form + Zod, Tailwind v4. Paket yöneticisi: pnpm.

Ortam değişkenleri (yalnızca adları): `DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`.

## Çalışma kuralları

- `.env*` dosyalarını **okuma**; değişken gerekiyorsa kullanıcıdan iste.
- Her özellik ayrı `feature/...` dalında; commit mesajları `feat:`, `fix:`, `chore:`, `style:` önekiyle. Müşteri geri bildirimi çalışmasında (`docs/geri-bildirim/`) dalı, commit'i ve `main`'e `--no-ff` merge'ü Claude yapar; **push'u yalnızca kullanıcı yapar**.
- Next.js 16'nın API'leri eğitim verisinden farklı: kod yazmadan önce `node_modules/next/dist/docs/` altındaki ilgili rehberi oku (`proxy.ts` = eski middleware).
- Her özellikten sonra `npx tsc --noEmit`, `npx eslint .` ve `pnpm build` ile doğrula. Tarayıcıda görmediğin şeyi "çalışıyor" diye raporlama.
- Kullanıcının çalıştırdığı `pnpm dev` sürecini öldürme, `.next` klasörünü silme (kendi testin için başka port kullan, yalnızca kendi başlattığın süreci sonlandır).
- Şema değişikliğinden sonra kullanıcıdan **dev sunucusunu yeniden başlatmasını** iste (Prisma istemcisi bellekte kalır).
- Migration: `pnpm prisma migrate dev --name ...`. Neon'da "advisory lock" zaman aşımı olursa yeniden dene; sürerse `PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK=1` ile çalıştır. Veri taşıması gereken değişikliklerde `migration.sql`'i elle yazıp `prisma migrate deploy` ile uygula.
- Dev terminaline Server Function argümanları yazılmaz (`logging.serverFunctions: false`, şifreler sızmasın).

## Güvenlik (zorunlu)

- Admin verisini okuyan/değiştiren **her** server action ve route handler `await requireAdmin()` (`lib/require-admin.ts`) ile başlar. İstisna: `loginAction`, `logoutAction`.
- `proxy.ts` yalnızca iyimser kontroldür (imzalı çerez var mı); yetki kontrolü yerine geçmez. Admin sayfaları `auth()` ile oturumu kendisi doğrular.
- Girdi sunucuda Zod ile yeniden doğrulanır (`lib/validations/`). Giriş ve şifre değiştirme `lib/rate-limit.ts` ile sınırlıdır; hata mesajları genel tutulur.
- Kullanıcı HTML'i (blog, hakkımda) kaydedilirken `lib/sanitize.ts` ile temizlenir.
- Oturum JWT; `Admin.passwordChangedAt` değişince tüm oturumlar düşer. Tek admin, `pnpm create-admin` ile oluşturulur/güncellenir. Şifre kuralı: min 6, bir büyük harf, bir özel karakter, en çok 72 bayt.
- Admin sayfaları `noindex`; CSP/güvenlik başlıkları `next.config.ts` içinde (statik, nonce yok: sayfalar statik kalsın).

## Önbellek (cacheComponents)

- `auth()`, `cookies()`, `headers()` veya DB okuyan sunucu bileşeni `<Suspense>` içinde olmalı; `auth()` öncesi `await connection()`. Admin veri sayfalarında başlık gibi sabit kısım dışarıda, veri kısmı sayfa **içinde** `<Suspense>` ile sarılır (yalnızca `loading.tsx` yetmez).
- Herkese açık veri `'use cache'` + `cacheTag` ile okunur (`lib/queries/`), süre `days` yalnızca güvenlik ağıdır. Etiketler `lib/cache-tags.ts`: `posts`, `categories`, `post:<slug>`, `category:<slug>`, `tag:<slug>`, `hero`, `contact`, `about`.
- Admin işlemleri **yalnızca etkilediği** etiketleri `updateTag` ile yeniler (`invalidateBlog`, `invalidateHero`, `invalidateContact`, `invalidateAbout`). Yeni içerik alanı eklenirse hem sorguya etiket hem action'a invalidation ekle.
- `generateStaticParams` en az bir parametre dönmeli; veri yokken yer tutucu (`__yok__`, sayfa `"2"`) döner ve sayfa `notFound()` verir. Bilinmeyen adresler statik üretilmediği için 404 yerine 200 + noindex ("soft 404") dönebilir; bilinen sınır.

## Görseller

Müşteri geri bildirimi: sitede **hiçbir yerde fotoğraf yok** (`docs/geri-bildirim/musteri-geri-bildirimi.md`). Cloudinary, görsel yükleme, Tiptap görsel eklentisi ve medya temizliği kaldırıldı; `sanitizeContent` `<img>` atar, eski içerikteki görseller `stripImages` ile gizlenir. `Post.coverImage*`, `Hero.image*`, `About.image*` sütunları şemada duruyor ama kullanılmıyor; `feature/posts-archive` migration'ında silinecek.

## Site yapısı

Herkese açık (`app/(site)`): `/` (hero → hakkımda önizlemesi → yazılar [en yeni 5 + "Daha fazla oku"] → iletişim), `/yazilar` ve `/yazilar/sayfa/[n]` (9/sayfa), `/blog/[slug]`, `/kategori/[slug]` (+ `/sayfa/[n]`), `/etiket/[slug]` (noindex), `/hakkimda`, `/iletisim`, `robots.ts`, `sitemap.ts`. Ayarlar: `lib/blog-config.ts`, site adı/açıklama `lib/site.ts`.

Admin (`app/admin`, giriş `/admin`; panel `(panel)` grubunda): Panel, **Hero** (başlık, açıklama, buton, görsel), **Hakkımda** (zengin metin + görsel), **İletişim** (e-posta, telefon, WhatsApp, adres; hepsi isteğe bağlı), **Blog yazıları** (Tiptap, taslak/yayın, kategori zorunlu yayında, etiketler, SEO alanları), Kategoriler, Şifre değiştir. Tek satırlık kayıtlar (`Hero`, `About`, `Contact`) `id = "main"` ile upsert edilir. Slug'lar başlıktan sunucuda üretilir (benzersiz `-2`, `-3`); yayınlanmış yazının slug'ı değişmez.

## Tasarım kararları (herkese açık site)

- Palet (`app/globals.css`, `.site` değişkenleri): kırık beyaz `paper #FAFAF7`, `ink #161615`, `ink-soft #5E5E5A`, `line #DEDED8`, `surface #F3F3EE`. Tek vurgu `anthracite` = zeminin tersi (açıkta `#1F2327`, koyuda `#ECECE7`; üstündeki yazı `on-anthracite`). Koyu kalan paneller (hero, footer, kapanış bandı, mobil menü) `bg-panel`. Bakır/turuncu vurgu, renkli kutu ve gradyan yok. Karanlık mod yalnızca sistem tercihini izler (`prefers-color-scheme`), anahtar yok.
- Yazı tipleri: başlık ve gövde EB Garamond (serif, `font-serif-site`); menü, buton, etiket, meta Instrument Sans (`font-sans-site`). Yazı gövdesi en çok 70ch. Logo "EA" monogramı (`components/site/site-header.tsx`), favicon `app/icon.svg`.
- Hero: koyu antrasit, başlık/açıklama/açık buton (görsel yok). Hakkımda: ana sayfada ~10 satır önizleme + "Devamını oku", `/hakkimda` tam metin + WhatsApp'a giden kapanış bandı. Kategori adı kartlarda koyu yuvarlak rozet.
- Okuma süresi yazı sayfasında otomatik hesaplanır (200 kelime/dk).

## Veri / yardımcı script'ler

- `pnpm create-admin`, `pnpm seed-posts` / `pnpm seed-posts --remove`.
- **Veritabanında 15 test yazısı var** ("Lorem Ipsum Dolor Sit Amet", Kaygı kategorisi). Kullanıcı şimdilik silmek istemiyor; yayına almadan önce `pnpm seed-posts --remove` ile silinmeli, hatırlat.

## Yapılacaklar (sırasız)

Çalışma alanları, gizlilik/KVKK sayfası, 404 sayfası, varsayılan OG görseli, yayına alma hazırlığı (alan adı, `NEXT_PUBLIC_SITE_URL`, Vercel), site adının admin'den düzenlenebilmesi (isteğe bağlı).
