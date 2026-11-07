import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/lib/site";
import "./globals.css";

// Mobil tarayıcı çubuğu rengi sistem temasını izler
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f6f3" },
    { media: "(prefers-color-scheme: dark)", color: "#141413" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    alternateLocale: ["fr_FR"],
  },
  // varsayılan paylaşım görseli app/opengraph-image.png ve twitter-image.png'dir
  twitter: { card: "summary_large_image" },
  // Google Search Console doğrulama kodu (ortam değişkeni verilirse eklenir)
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className="h-full antialiased" suppressHydrationWarning>
      <head>
        {/* kayıtlı tema tercihini sayfa boyanmadan uygular (yanlış tema parlaması olmasın) */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('tema');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}",
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
