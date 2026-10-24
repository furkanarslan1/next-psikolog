@AGENTS.md

# Proje

Psikolog **Eren Arslan** için tanıtım + blog sitesi. SEO çok önemli. Arayüz metinleri Türkçe.
Next.js 16 (App Router, `cacheComponents` + `partialPrefetching` açık), Auth.js v5, Prisma 7 + Neon (Postgres), Cloudinary, Tiptap, shadcn/ui (base-nova), React Hook Form + Zod, Tailwind v4. Paket yöneticisi: pnpm.

Ortam değişkenleri (yalnızca adları): `DATABASE_URL`, `AUTH_SECRET`, `CLOUDINARY_URL` (`cloudinary://KEY:SECRET@CLOUD`), `NEXT_PUBLIC_SITE_URL`.

## Çalışma kuralları

- `.env*` dosyalarını **okuma**; değişken gerekiyorsa kullanıcıdan iste.
- Her özellik ayrı `feature/...` dalında; commit mesajları `feat:`, `fix:`, `chore:`, `style:` önekiyle. Dalı kullanıcı açar; dal/commit işlemini kendin yapma.
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
- Kullanıcı HTML'i (blog, hakkımda) kaydedilirken `lib/sanitize.ts` ile temizlenir; görseller yalnızca Cloudinary'den olabilir.
- Oturum JWT; `Admin.passwordChangedAt` değişince tüm oturumlar düşer. Tek admin, `pnpm create-admin` ile oluşturulur/güncellenir. Şifre kuralı: min 6, bir büyük harf, bir özel karakter, en çok 72 bayt.
- Admin sayfaları `noindex`; CSP/güvenlik başlıkları `next.config.ts` içinde (statik, nonce yok: sayfalar statik kalsın).

## Önbellek (cacheComponents)

- `auth()`, `cookies()`, `headers()` veya DB okuyan sunucu bileşeni `<Suspense>` içinde olmalı; `auth()` öncesi `await connection()`. Admin veri sayfalarında başlık gibi sabit kısım dışarıda, veri kısmı sayfa **içinde** `<Suspense>` ile sarılır (yalnızca `loading.tsx` yetmez).
- Herkese açık veri `'use cache'` + `cacheTag` ile okunur (`lib/queries/`), süre `days` yalnızca güvenlik ağıdır. Etiketler `lib/cache-tags.ts`: `posts`, `categories`, `post:<slug>`, `category:<slug>`, `tag:<slug>`, `hero`, `contact`, `about`.
- Admin işlemleri **yalnızca etkilediği** etiketleri `updateTag` ile yeniler (`invalidateBlog`, `invalidateHero`, `invalidateContact`, `invalidateAbout`). Yeni içerik alanı eklenirse hem sorguya etiket hem action'a invalidation ekle.
- `generateStaticParams` en az bir parametre dönmeli; veri yokken yer tutucu (`__yok__`, sayfa `"2"`) döner ve sayfa `notFound()` verir. Bilinmeyen adresler statik üretilmediği için 404 yerine 200 + noindex ("soft 404") dönebilir; bilinen sınır.

## Görseller (Cloudinary)

- Tarayıcı yüklemeden önce 2000 px'e küçültüp WebP'ye çevirir; imzalı yükleme `lib/cloudinary.ts` (gelen dönüşüm `c_limit,w_2000,h_2000`, klasör `psikolog-blog`).
- Gösterimde tek yükleyici: `lib/cloudinary-loader.ts` (`f_auto,q_auto:good`), genişlikler `next.config.ts`'te bilerek az (640/960/1280/1920, 320) → Cloudinary dönüşüm sayısı düşük. Yazı içi görseller `lib/content-images.ts` ile aynı genişliklere çevrilir.
- Cloudinary görseli kullanan her yeni alan `lib/media.ts` → `getReferencedImageIds`'e eklenmeli; değişen/kaldırılan eski görsel kaydedilirken `deleteIfUnreferenced` ile silinmeli. **Taslaklardaki görseller silinmez** (her kayıt "kullanımda" sayılır). `pnpm verify-media` gerçek hesapta yaşam döngüsünü doğrular. Panelde "Kullanılmayan görselleri temizle" (24 saatten eski yetimler) butonu var.
- LCP: hero, öne çıkan yazı ve ilk 3 kart `loading="eager"` + `fetchPriority="high"`; `priority` prop'u kullanılmaz (kullanımdan kalktı). `fill` kullanan görselin üst elemanı `relative` olmalı (`sticky` olamaz).

## Site yapısı

Herkese açık (`app/(site)`): `/` (hero → hakkımda önizlemesi → yazılar [en yeni 5 + "Daha fazla oku"] → iletişim), `/yazilar` ve `/yazilar/sayfa/[n]` (9/sayfa), `/blog/[slug]`, `/kategori/[slug]` (+ `/sayfa/[n]`), `/etiket/[slug]` (noindex), `/hakkimda`, `/iletisim`, `robots.ts`, `sitemap.ts`. Ayarlar: `lib/blog-config.ts`, site adı/açıklama `lib/site.ts`.

Admin (`app/admin`, giriş `/admin`; panel `(panel)` grubunda): Panel, **Hero** (başlık, açıklama, buton, görsel), **Hakkımda** (zengin metin + görsel), **İletişim** (e-posta, telefon, WhatsApp, adres; hepsi isteğe bağlı), **Blog yazıları** (Tiptap, taslak/yayın, kategori zorunlu yayında, etiketler, SEO alanları), Kategoriler, Şifre değiştir. Tek satırlık kayıtlar (`Hero`, `About`, `Contact`) `id = "main"` ile upsert edilir. Slug'lar başlıktan sunucuda üretilir (benzersiz `-2`, `-3`); yayınlanmış yazının slug'ı değişmez.

## Tasarım kararları (herkese açık site)

- Palet: antrasit `#1F2327`, ink `#23272B`, ink-soft `#5B6168`, paper `#F4F5F6`, beyaz yüzey, çizgi `#DCDFE3`. **Bakır/turuncu vurgu kullanılmaz.** Vurgu/aktif durum zeminin tersidir: açık zeminde `#1F2327`, koyu zeminde `#FFFFFF`.
- Yazı tipleri: başlıklar Newsreader (serif), gövde Instrument Sans. Büyük harfli etiket, numaralandırma, ok işareti, her şeyi aynı gölgeli karta koyma yok.
- Hero: koyu antrasit, solda başlık/açıklama/açık butonu, sağda görsel (kırpılmadan kendi oranında); mobilde yatay görsel üstte, dikey görsel arka plan+overlay. Hakkımda: yuvarlak halkalı portre; ana sayfada ~10 satır önizleme + "Devamını oku", `/hakkimda` tam metin + WhatsApp'a giden kapanış bandı. Kategori adı kartlarda koyu yuvarlak rozet.
- Okuma süresi yazı sayfasında otomatik hesaplanır (200 kelime/dk).

## Veri / yardımcı script'ler

- `pnpm create-admin`, `pnpm verify-media`, `pnpm seed-posts <görsel>` / `pnpm seed-posts --remove`.
- **Veritabanında 15 test yazısı var** ("Lorem Ipsum Dolor Sit Amet", aynı görsel, Kaygı kategorisi). Kullanıcı şimdilik silmek istemiyor; yayına almadan önce `pnpm seed-posts --remove` ile silinmeli, hatırlat.

## Yapılacaklar (sırasız)

Çalışma alanları, gizlilik/KVKK sayfası, 404 sayfası, varsayılan OG görseli, yayına alma hazırlığı (alan adı, `NEXT_PUBLIC_SITE_URL`, Vercel), site adının admin'den düzenlenebilmesi (isteğe bağlı).
