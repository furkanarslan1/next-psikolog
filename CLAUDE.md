@AGENTS.md

# Proje kuralları

Psikolog tanıtım + blog sitesi. Next.js (App Router), Auth.js v5, Prisma + Neon, shadcn/ui, React Hook Form + Zod. Arayüz metinleri Türkçe.

## Güvenlik (zorunlu)

- Admin verisini okuyan veya değiştiren **her** server action ve route handler `await requireAdmin()` (`lib/require-admin.ts`) ile başlar. İstisna: `loginAction`, `logoutAction`.
- `proxy.ts` yalnızca iyimser kontroldür; yetki kontrolü yerine geçmez. Admin sayfaları da `auth()` ile oturumu kendisi doğrular.
- Girdi her zaman sunucuda Zod ile yeniden doğrulanır (şemalar `lib/validations/`).
- Giriş ve şifre gibi hassas action'lar `lib/rate-limit.ts` ile sınırlanır.
- Hata mesajları genel tutulur (e-posta var mı yok mu belli edilmez).
- Kullanıcı kaynaklı HTML (blog içeriği) basılmadan önce sanitize edilir.
- Admin sayfaları `noindex` olur; `/admin` altındaki yolları `proxy.ts` korur.

## Çalışma kuralları

- `.env*` dosyalarını okuma; değişken eklenmesi gerekiyorsa kullanıcıdan iste.
- Her özellik ayrı `feature/...` dalında yapılır; commit mesajları `feat:`, `fix:`, `chore:` önekiyle.
- `pnpm create-admin` ile admin hesabı oluşturulur/güncellenir.
- Veritabanı değişikliği: `prisma/schema.prisma` → `pnpm prisma migrate dev --name ...`.
- `cacheComponents` açık: `auth()`, `cookies()`, `headers()` veya DB okuyan her sunucu bileşeni `<Suspense>` içinde olmalı ve `auth()` çağrısından önce `await connection()` (`next/server`) almalı; aksi halde `next build` "Blocking Route" hatası verir. Her admin özelliğinden sonra `pnpm build` ile doğrula.
- Cloudinary görseli kullanan her yeni alan (hero gibi) `lib/media.ts` içindeki `getReferencedImageIds`'e eklenmeli; değişen/kaldırılan eski görsel kaydedilirken `deleteIfUnreferenced` ile silinmeli. `pnpm verify-media` ile doğrulanır. Taslaklardaki görseller silinmez.
- Herkese açık sayfalar statik kalmalı (SEO); gereksiz yere `auth()`/`cookies()`/`headers()` kullanma.
