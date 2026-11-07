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

Herkese açık (`app/(site)`): `/` (hero → Instagram → son yazılar [en yeni 3: ilki özetli büyük, diğerleri tek satır; "Tüm Yazılar →"]; her sayfanın altında `ContactCta` "Bana Ulaşın"), `/yazilar` ve `/yazilar/sayfa/[n]` (9/sayfa), `/blog/[slug]`, `/kategori/[slug]` (+ `/sayfa/[n]`), `/etiket/[slug]` (noindex), `/hakkimda`, `/iletisim`, `robots.ts`, `sitemap.ts`. Ayarlar: `lib/blog-config.ts`, site adı/açıklama `lib/site.ts`.

Admin (`app/admin`, giriş `/admin`; panel `(panel)` grubunda): Panel, **Hero** (başlık, açıklama), **Hakkımda** (zengin metin), **İletişim** (e-posta, telefon, WhatsApp, adres; hepsi isteğe bağlı), **Blog yazıları** (Tiptap, taslak/yayın, kategori zorunlu yayında, etiketler, SEO alanları), Kategoriler, Şifre değiştir. Tek satırlık kayıtlar (`Hero`, `About`, `Contact`) `id = "main"` ile upsert edilir. Slug'lar başlıktan sunucuda üretilir (benzersiz `-2`, `-3`); yayınlanmış yazının slug'ı değişmez.

## Tasarım kararları (herkese açık site)

- Referans: oguzhannacak.com (açık, editoryal, büyük serif isim, harf aralıklı büyük harfli etiketler). Müşteri notu: "kırık beyaz zemin, tek vurgu rengi, renkli kutu/gradyan yok".
- Palet (`app/globals.css`, `.site` değişkenleri): `paper #FAFAF7`, `surface #F3EFE5` (footer/ara bölümler), `ink #161615`, `ink-soft #5F5F5B`, `line #E2DFD6`. **Tek vurgu `brand #8A3A28`** (paslı kırmızı, Nacak'tan; değiştirmek için yalnızca `--site-brand`). Karanlık modda brand `#D9917B`. Vurgu: aktif menü, birincil buton (`btn-primary`), tür etiketi, bağlantı üstü çizgisi. Karanlık mod yalnızca sistem tercihini izler. Koyu dolgulu bloklar yok (yalnızca mobil menü hapı `bg-panel`).
- Etiketler (`label-caps`): menü, tür, kategori, "Yukarı": küçük, harf aralıklı büyük harf, sans. Yazı tipleri: başlık ve gövde EB Garamond (`font-serif-site`), UI Instrument Sans (`font-sans-site`). Yazı gövdesi en çok 70ch. Logo: yuvarlak çerçeveli "EA" monogramı, favicon `app/icon.svg`.
- Menü dört sayfa (Anasayfa, Hakkımda, Yazılar, İletişim; `components/site/site-nav.tsx`, mobil alt menü aynı listeyi kullanır). TR/FR seçici i18n konusuyla gelecek. Tek sade footer: kimlik, kurumsal bağlantılar (`institutions` in `lib/site.ts`), e-posta, Instagram, "Yukarı". Sosyal: yalnızca Instagram (`siteConfig.instagram`, admin'de girilmediyse varsayılan).
- Hero: açık zemin, vurgu renkli unvan satırı (`siteConfig.tagline`), çok büyük serif başlık, açıklama, sabit iki buton (Hakkımda / İletişime Geçin) ve Instagram simgesi (görsel yok). Hakkımda: ana sayfada ~10 satır önizleme + "Devamını oku", `/hakkimda` tam metin + WhatsApp'a giden kapanış bandı. Kategori adı kartlarda koyu yuvarlak rozet.
- Okuma süresi yazı sayfasında otomatik hesaplanır (200 kelime/dk).

## Veri / yardımcı script'ler

- `pnpm create-admin`, `pnpm seed-posts` / `pnpm seed-posts --remove`.
- **Veritabanında 15 test yazısı var** ("Lorem Ipsum Dolor Sit Amet", Kaygı kategorisi). Kullanıcı şimdilik silmek istemiyor; yayına almadan önce `pnpm seed-posts --remove` ile silinmeli, hatırlat.

## Yapılacaklar (sırasız)

Çalışma alanları, gizlilik/KVKK sayfası, 404 sayfası, varsayılan OG görseli, yayına alma hazırlığı (alan adı, `NEXT_PUBLIC_SITE_URL`, Vercel), site adının admin'den düzenlenebilmesi (isteğe bağlı).
