import type { Metadata } from "next"
import Link from "next/link"

import { LEGAL_UPDATED, LegalPage } from "@/components/site/legal-page"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Gizlilik ve Çerez Politikası",
  description: `${siteConfig.name} internet sitesinde ziyaretçi verilerinin nasıl ele alındığı ve çerez kullanımı hakkında bilgi.`,
  alternates: { canonical: "/gizlilik" },
}

export default function PrivacyPage() {
  return (
    <LegalPage title="Gizlilik ve Çerez Politikası" updated={LEGAL_UPDATED}>
      <p>
        Bu sayfa, {siteConfig.name} internet sitesini ziyaret ettiğinizde hangi verilerin
        işlendiğini ve çerezlerin nasıl kullanıldığını açıklar. Kişisel verilerin işlenmesine
        ilişkin ayrıntılar için <Link href="/kvkk">KVKK Aydınlatma Metni</Link>&apos;ne bakabilirsiniz.
      </p>

      <h2>Ziyaretçi verileri</h2>
      <p>
        Bu sitede ziyaretçiler için üyelik, yorum veya form bulunmaz. Ziyaretiniz sırasında sizden
        ad, e-posta gibi bilgiler istenmez. Siteyi barındıran hizmet sağlayıcı, güvenlik ve
        işleyişin sürdürülmesi amacıyla IP adresi, tarayıcı türü ve erişim zamanı gibi teknik
        kayıtları yalnızca kısa bir süre tutabilir.
      </p>

      <h2>Çerezler</h2>
      <p>
        Bu sitede ziyaretçilere yönelik <strong>analiz, reklam veya takip çerezi kullanılmaz</strong>.
        Yalnızca site yöneticisinin içerik yönetim paneline giriş yapabilmesi için gerekli olan
        oturum çerezi, yönetici girişi sırasında oluşturulur; ziyaretçileri etkilemez.
      </p>
      <p>
        İleride analiz veya benzeri bir hizmet eklenirse bu politika güncellenir ve gerekli olan
        durumlarda çerez onayınız ayrıca alınır.
      </p>

      <h2>Üçüncü taraf bağlantılar</h2>
      <p>
        Sitede Instagram profiline ve kurumsal sayfalara, çevirilerde ise orijinal yayınlara
        dış bağlantılar bulunabilir. Bu sitelerin gizlilik uygulamaları ilgili sitelerin
        sorumluluğundadır; bağlantıya tıkladığınızda o sitenin kendi politikaları geçerlidir.
      </p>

      <h2>İletişim</h2>
      <p>
        Benimle e-posta, telefon veya WhatsApp ile iletişime geçtiğinizde paylaştığınız bilgiler
        yalnızca talebinizi yanıtlamak ve randevu planlamak için kullanılır. Lütfen bu
        kanallarda sağlık bilgilerinizi paylaşmayın.
      </p>

      <h2>Değişiklikler</h2>
      <p>
        Bu politika zaman zaman güncellenebilir. Güncel sürüm her zaman bu sayfada yayımlanır ve
        yukarıda son güncelleme tarihi belirtilir.
      </p>
    </LegalPage>
  )
}
