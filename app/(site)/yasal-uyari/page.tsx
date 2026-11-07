import type { Metadata } from "next"

import { LEGAL_UPDATED, LegalPage } from "@/components/site/legal-page"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Yasal Uyarı",
  description: `${siteConfig.name} internet sitesinin kullanımına ilişkin yasal uyarılar ve sorumluluk sınırları.`,
  alternates: { canonical: "/yasal-uyari" },
}

export default function DisclaimerPage() {
  return (
    <LegalPage title="Yasal Uyarı" updated={LEGAL_UPDATED}>
      <h2>Bilgilendirme amacı</h2>
      <p>
        Bu sitedeki yazılar, çeviriler ve diğer içerikler yalnızca genel bilgilendirme ve
        düşünsel paylaşım amacıyla hazırlanmıştır. Hiçbir içerik tanı koymak, tedavi önermek
        veya bir psikolojik görüşmenin yerini almak için yazılmamıştır. Kişisel bir durum için
        bir uzmanla yüz yüze görüşmeniz gerekir.
      </p>

      <h2>Acil durumlar</h2>
      <p>
        Bu site acil yardım hizmeti sunmaz. Kendinize veya bir başkasına zarar verme riski gibi
        acil bir durumda <strong>112</strong> Acil Çağrı Merkezi&apos;ni arayın veya en yakın sağlık
        kuruluşuna başvurun.
      </p>

      <h2>Unvan ve mesleki çerçeve</h2>
      <p>
        {siteConfig.name} psikolog olarak çalışmaktadır ve psikanalitik formasyonunu
        sürdürmektedir. Sitede anılan kurumlar ve çalışma alanları, yazarın eğitim ve formasyon
        sürecini tanıtmak amacıyla belirtilmiştir; bu kurumları temsil etmek anlamına gelmez.
      </p>

      <h2>Sonuç vaadi bulunmaması</h2>
      <p>
        Sitedeki hiçbir ifade belirli bir sonuç, iyileşme veya başarı vaadi içermez. Her
        insanın deneyimi farklıdır; görüşmelerin seyri kişiden kişiye değişir.
      </p>

      <h2>Fikri mülkiyet ve çeviriler</h2>
      <p>
        Sitedeki özgün yazıların hakları yazara aittir; izinsiz çoğaltılamaz, kaynak
        gösterilmeden kopyalanamaz. Çeviri metinlerin telif hakkı orijinal yazarlarına ve
        yayıncılarına aittir; çeviriler yalnızca tanıtım ve akademik paylaşım amacıyla ve
        kaynağı belirtilerek yayımlanır. Bazı çevirilerde yalnızca özet verilir ve tam metin
        için orijinal yayının sayfasına bağlantı sunulur.
      </p>

      <h2>Dış bağlantılar</h2>
      <p>
        Sitede yer alan dış bağlantılar kolaylık sağlamak içindir. Bağlantı verilen sitelerin
        içeriğinden ve uygulamalarından sorumluluk kabul edilmez.
      </p>

      <h2>İçerik değişiklikleri</h2>
      <p>
        Sitedeki içerikler önceden haber verilmeksizin değiştirilebilir, güncellenebilir veya
        kaldırılabilir.
      </p>
    </LegalPage>
  )
}
