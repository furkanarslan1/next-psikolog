@AGENTS.md

# Proje

Psikolog **Eren Arslan** için tanıtım + blog sitesi. SEO çok önemli. Arayüz metinleri Türkçe.
Next.js 16 (App Router, `cacheComponents` + `partialPrefetching` açık), Auth.js v5, Prisma 7 + Neon (Postgres), Tiptap, shadcn/ui (base-nova), React Hook Form + Zod, Tailwind v4. Paket yöneticisi: pnpm.

Ortam değişkenleri (yalnızca adları): `DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL` (yayında zorunlu: canonical, sitemap, OG), `GOOGLE_SITE_VERIFICATION` (isteğe bağlı, Search Console).

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
- Herkese açık veri `'use cache'` + `cacheTag` ile okunur (`lib/queries/`), süre `days` yalnızca güvenlik ağıdır. Etiketler `lib/cache-tags.ts`: `posts`, `post:<slug>`, `hero`, `contact`, `about`.
- Admin işlemleri **yalnızca etkilediği** etiketleri `updateTag` ile yeniler (`invalidateBlog`, `invalidateHero`, `invalidateContact`, `invalidateAbout`). Yeni içerik alanı eklenirse hem sorguya etiket hem action'a invalidation ekle.
- `generateStaticParams` en az bir parametre dönmeli; veri yokken yer tutucu (`__yok__`, sayfa `"2"`, tür sayfası `yazi`) döner ve sayfa `notFound()` verir. Bilinmeyen adresler statik üretilmediği için 404 yerine 200 + noindex ("soft 404") dönebilir; bilinen sınır.

## Görseller

Müşteri geri bildirimi: sitede **hiçbir yerde fotoğraf yok** (`docs/geri-bildirim/musteri-geri-bildirimi.md`). Cloudinary, görsel yükleme, Tiptap görsel eklentisi ve medya temizliği kaldırıldı; `sanitizeContent` `<img>` atar, eski içerikteki görseller `stripImages` ile gizlenir. Görsel sütunları migration `20261107200000_posts_archive` ile silindi.

## Site yapısı

Herkese açık (`app/(site)`): `/` (hero → Instagram → "Öne çıkanlar" kaydırıcısı [admin'de "Ana sayfada öne çıkar" işaretli yayınlanmış kayıtlar, en çok 6, `01 / 03` sayacı ve oklar; hiç yoksa gizli] → son yazılar [en yeni 3: ilki özetli büyük, diğerleri tek satır; "Tüm Yazılar →"]; her sayfanın altında `ContactCta` "Bana Ulaşın"), `/yazilar` ve `/yazilar/sayfa/[n]` (9/sayfa, liste görünümü), tür filtresi `/yazilar/tur/[yazi|ceviri]` (+ `/sayfa/[n]`), `/yazilar/[slug]`, `/hakkimda`, `/iletisim`, `robots.ts`, `sitemap.ts`. Ayarlar: `lib/blog-config.ts`, site adı/açıklama `lib/site.ts`.

Admin (`app/admin`, giriş `/admin`; panel `(panel)` grubunda): Panel, **Hero** (başlık, açıklama), **Hakkımda** (zengin metin), **İletişim** (e-posta, telefon, WhatsApp, adres; hepsi isteğe bağlı), **Yazılar** (Tiptap, taslak/yayın, "Ana sayfada öne çıkar", tür Yazı/Çeviri, dil tr/fr, yayımlandığı yer, çeviri alanları, "tam metin" anahtarı, SEO alanları), Şifre değiştir. Tek satırlık kayıtlar (`Hero`, `About`, `Contact`) `id = "main"` ile upsert edilir. Eski `/blog/*`, `/kategori/*`, `/etiket/*` adresleri `next.config.ts`'te 308 ile yönlenir. Yazı türü/dil: `Post.type` (YAZI/CEVIRI), `Post.lang` (`tr`/`fr`; listede ayrılmaz). Çeviriye özel alanlar yazıda boş kalır; `fullText=false` ise yalnızca özet + `sourceUrl` dış linki gösterilir. Slug'lar başlıktan sunucuda üretilir (benzersiz `-2`, `-3`); yayınlanmış yazının slug'ı değişmez.

## Performans / erişilebilirlik notları

- Ölçüm: `npx lighthouse` (mobil, simüle yavaş 4G) `pnpm build` + `next start` üzerinde: performans 89-92, erişilebilirlik/en iyi uygulamalar/SEO 100. Kalan LCP (3.3-3.7 sn) web fontu boyutundan (EB Garamond değişken font, ~200 KB); `display: swap`.
- Yazı tipleri yalnızca `components/site/site-shell.tsx`'te (EB Garamond + Instrument Sans; italik ayrı ve `preload: false`). Kök layout'ta yazı tipi/Toaster yok; Toaster `app/admin/layout.tsx`'te. Admin yazı tipi sistem sans (`globals.css` `--font-sans`). Yeni global font/JS kök layout'a eklenmemeli (herkese açık sayfalara yüklenir).
- Özel 404: `app/not-found.tsx` (kök), `app/(site)/not-found.tsx`, `app/(fr)/fr/not-found.tsx`. Bilinmeyen `/yazilar/<slug>` yine 200 + noindex döner (soft 404, `generateStaticParams` + yeni yazı yayınlanabilmesi için bilinen sınır).
- Dil adı → `lang` kodu: `lib/lang.ts` (`originalLang` serbest metin; tanınmazsa `lang` yazılmaz).
- Bir `globals.css` değişikliği derlenen CSS'e yansımıyorsa Turbopack önbelleği bayatlamıştır; dosyada içerik değişikliği yapıp yeniden derle (`git stash` sonrası görüldü).

## Fransızca sürüm (i18n)

- Kütüphane yok: `lib/i18n.ts` (sözlük `dict`, `pairs`, `counterpart`, `languageAlternates`). Fransızca sayfalar: `/fr` (ana sayfa, TR ana sayfanın karşılığı), `/fr/presentation` (Hakkımda), `/fr/publications` (liste) ve `/fr/publications/[slug]` (yazı; aynı yazının Fransızca menülü hali, kanonik adres Türkçe `/yazilar/[slug]`), `/fr/contact`. Rotalar `app/(fr)/fr/`, iskelet `components/site/site-shell.tsx` (`locale` prop'u; bileşenler `locale` alır), yazı gövdesi `components/site/post-article.tsx` (iki dil ortak).
- Kök `<html lang="tr">` sabit; Fransızca sayfa dili `SiteShell`'deki `<div lang="fr">` ile belirtilir (tüm app'i `[lang]` altına taşımak admin'i de etkilerdi). Yazı gövdesi `lang={post.lang}` taşır. Yazı metinleri/başlıkları yazıldığı dilde kalır (çevrilmez); Fransızca yazmak için admin'de dil "Fransızca" seçilir.
- Karşılığı olmayan sayfada dil seçici diğer dilin ana sayfasına gider (TR→`/fr`, FR→`/`). `hreflang` (`alternates.languages`) ve sitemap `alternates` yalnızca eşleşen çiftlerde; `og:locale:alternate` fr_FR/tr_TR. Yasal sayfalar yalnızca Türkçe.
- Fransızca içerik admin'de: Hakkımda sayfasında `About.contentFr` (boşsa "bientôt disponible"), Hero sayfasında `Hero.descriptionFr` (boşsa Fransızca ana sayfada açıklama yok). Fransızca seans iddia edilmez ("Séances en turc ; contact possible en français"). Yeni Fransızca sayfa eklenirse `pairs`, `dict`, sitemap ve CLAUDE.md güncellenmeli.

## Tasarım kararları (herkese açık site)

- Referans: oguzhannacak.com (açık, editoryal, büyük serif isim, harf aralıklı büyük harfli etiketler). Müşteri notu: "kırık beyaz zemin, tek vurgu rengi, renkli kutu/gradyan yok".
- Palet (`app/globals.css`, `.site` değişkenleri): zemin `paper #F8F7F2`, **kartlar `tile #F0ECE1` (zeminden belirgin koyu, kenarlık `line #D9D5C8`)**, footer `surface #EBE6D8` (en koyu ton), `ink #161615`, `ink-soft #55554F`. **Tek vurgu `brand #8A3A28`** (paslı kırmızı, Nacak'tan; değiştirmek için yalnızca `--site-brand`). Vurgu: aktif menü, birincil buton (`btn-primary`), tür etiketi, bağlantı çizgisi. **Site yalnızca açık temadır** (koyu mod yok). Koyu dolgulu bloklar yok (yalnızca mobil menü hapı `bg-panel`).
- Kartlar (`bg-tile`): öne çıkanlar kartları, "Son yazılar" ilk yazı, iletişim kutuları, CTA bandı. Hover: kart hafif yükselir ve kenarlık vurgu olur; menü bağlantılarında `link-slide` alt çizgi animasyonu; liste satırında `bg-tile` ve ok kayması; `prefers-reduced-motion`a uyulur.
- Header: yuvarlak EA monogramı + "Eren Arslan" yan yana; TR/FR seçici yuvarlak köşeli düğme ("pill", aktif dil vurgu dolgulu).
- Süs şekli `components/site/rings.tsx` (üç kesişen halka + disk, yalnızca çizgi/düz renk, gradyan yok, `aria-hidden`): hero (masaüstünde sağda, mobilde büyük silik arka plan), sayfa başlıkları (`PageHeading`), CTA bandı. Başlık ölçeği tek: iç sayfa h1 `text-4xl sm:text-5xl lg:text-6xl`, bölüm h2 `text-3xl sm:text-4xl`.
- Slider mobilde ok göstermez: sonraki kartın görünen kısmı, nokta göstergesi ve ilk kartta "Kaydırın →" ipucu.
- Etiketler (`label-caps`): menü, tür, kategori, "Yukarı": küçük, harf aralıklı büyük harf, sans. Yazı tipleri: başlık ve gövde EB Garamond (`font-serif-site`), UI Instrument Sans (`font-sans-site`). Yazı gövdesi en çok 70ch. "No. 01" bölüm numaraları (`SectionNumber`, Hakkımda'da CSS sayaçlı `h2`); kayıtlara adından türetilen küçük Lacancı matem imzası (`Matheme`: $, a, Φ, S₁, S₂, A, i(a), Σ; süs, `aria-hidden`). Hakkımda alıntı bloğu (`blockquote`: son paragraf yazar adı) tırnak işaretli tipografiyle çizilir. Logo: yuvarlak çerçeveli "EA" monogramı, favicon `app/icon.svg`.
- Menü dört sayfa (Anasayfa, Hakkımda, Yazılar, İletişim; `components/site/site-nav.tsx`, mobil alt menü aynı listeyi kullanır). TR/FR seçici header'da (`LanguageSwitch`). Tek sade footer: kimlik, kurumsal bağlantılar (`institutions` in `lib/site.ts`), e-posta, Instagram, yasal sayfa linkleri, "Yukarı". Yasal sayfalar (`/kvkk`, `/gizlilik`, `/yasal-uyari`, `components/site/legal-page.tsx`, tarih `LEGAL_UPDATED`) koddadır; **hukuki gözden geçirme gerektiren taslaktır**. Sitede ziyaretçi çerezi/analiz yok; analiz eklenirse çerez onayı ve gizlilik metni güncellenmeli. Sosyal: yalnızca Instagram (`siteConfig.instagram`, admin'de girilmediyse varsayılan).
- SEO: başlık `siteConfig.title`, iç sayfalar `%s — Eren Arslan`; paylaşım görseli `app/opengraph-image.png` (+ twitter-image, 1200×630, fotoğrafsız; `docs`te kaynağı yok, yeniden üretmek için aynı tasarım); `twitter:card` summary_large_image; ana sayfada Person + WebSite JSON-LD.
- Hero: açık zemin, vurgu renkli unvan satırı (`siteConfig.tagline`), çok büyük serif başlık, açıklama, sabit iki buton (Hakkımda / İletişime Geçin) ve Instagram simgesi (görsel yok). Hakkımda: ana sayfada ~10 satır önizleme + "Devamını oku", `/hakkimda` tam metin + WhatsApp'a giden kapanış bandı. 
- Okuma süresi yazı sayfasında otomatik hesaplanır (200 kelime/dk).

## Veri / yardımcı script'ler

- `pnpm create-admin`, `pnpm seed-sample` (örnek hero/hakkımda/iletişim + 5 örnek kayıt; tekrar çalıştırılabilir), `pnpm seed-posts` / `pnpm seed-posts --remove` (sayfalamayı denemek için 15 Lorem kaydı).
- **Veritabanındaki hero, hakkımda ve 5 yazı ÖRNEKTİR** (`pnpm seed-sample`): staj/kurum ayrıntıları ve alıntı Eren'in gerçek metniyle değiştirilmeli; çeviri kaydının kaynak bağlantısı örnektir. WhatsApp numarası ve adres kullanıcının girdiği değerlerdir.

## Yapılacaklar (sırasız)

Çalışma alanları, 404 sayfası, varsayılan OG görseli, SEO başlık şablonu/meta açıklama, Fransızca sürüm (`docs/geri-bildirim/musteri-geri-bildirimi.md` 9. konu), yayına alma hazırlığı (alan adı, `NEXT_PUBLIC_SITE_URL`, Vercel), site adının admin'den düzenlenebilmesi (isteğe bağlı).
