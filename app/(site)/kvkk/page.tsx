import type { Metadata } from "next"
import Link from "next/link"

import { LEGAL_UPDATED, LegalPage } from "@/components/site/legal-page"
import { getContact } from "@/lib/queries/contact"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description: `${siteConfig.name} internet sitesi için 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni.`,
  alternates: { canonical: "/kvkk" },
}

export default async function KvkkPage() {
  const contact = await getContact()
  const email = contact?.email

  return (
    <LegalPage title="KVKK Aydınlatma Metni" updated={LEGAL_UPDATED}>
      <p>
        Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu&apos;nun (&quot;Kanun&quot;) 10.
        maddesi uyarınca, bu internet sitesi üzerinden benimle iletişime geçen kişileri kişisel
        verilerinin nasıl işlendiği konusunda bilgilendirmek amacıyla hazırlanmıştır.
      </p>

      <h2>1. Veri sorumlusu</h2>
      <p>
        Kişisel verileriniz bakımından veri sorumlusu {siteConfig.name}&apos;dır (Psikolog).
        {email ? (
          <>
            {" "}
            İletişim için: <a href={`mailto:${email}`}>{email}</a>
          </>
        ) : (
          <>
            {" "}
            İletişim bilgileri için <Link href="/iletisim">İletişim</Link> sayfasına bakabilirsiniz.
          </>
        )}
      </p>

      <h2>2. İşlenen kişisel veriler</h2>
      <p>Bu sitede sizden otomatik olarak bir form aracılığıyla veri toplanmaz. İşlenebilecek veriler şunlardır:</p>
      <ul>
        <li>
          <strong>İletişim verileri:</strong> E-posta, telefon veya WhatsApp ile bana ulaştığınızda
          paylaştığınız ad, soyad, e-posta adresi, telefon numarası ve mesajınızın içeriği.
        </li>
        <li>
          <strong>İşlem güvenliği verileri:</strong> Siteyi ziyaret ettiğinizde barındırma
          sağlayıcısı tarafından teknik olarak kaydedilen IP adresi, tarayıcı türü ve erişim
          zamanı gibi sunucu kayıtları.
        </li>
      </ul>
      <p>
        <strong>Lütfen e-posta veya mesajlarınızda sağlık bilgilerinizi paylaşmayın.</strong> Sağlık
        verileri Kanun uyarınca özel nitelikli kişisel veridir; ilk iletişimde yalnızca randevu
        ve bilgi talebinizi iletmeniz yeterlidir. Görüşmeye ilişkin ayrıntılar yüz yüze veya
        çevrim içi seanslarda konuşulur.
      </p>

      <h2>3. İşleme amaçları</h2>
      <ul>
        <li>İletişim taleplerinizi yanıtlamak ve bilgi vermek,</li>
        <li>Randevu planlaması yapmak,</li>
        <li>Sitenin ve sunucuların güvenliğini sağlamak,</li>
        <li>Yasal yükümlülüklerin yerine getirilmesi.</li>
      </ul>

      <h2>4. Hukuki sebep</h2>
      <p>
        Verileriniz, Kanun&apos;un 5. maddesinin 2. fıkrasındaki; bir sözleşmenin kurulması veya
        ifasıyla doğrudan ilgili olması (c), veri sorumlusunun hukuki yükümlülüğünü yerine
        getirebilmesi için zorunlu olması (ç) ve ilgili kişinin temel hak ve özgürlüklerine zarar
        vermemek kaydıyla veri sorumlusunun meşru menfaati (f) hukuki sebeplerine dayanılarak
        işlenir.
      </p>

      <h2>5. Verilerin aktarılması</h2>
      <p>
        Kişisel verileriniz, yasal zorunluluklar dışında üçüncü kişilerle paylaşılmaz. Sitenin
        barındırılması, e-posta ve mesajlaşma hizmetleri için kullanılan hizmet sağlayıcıların
        (örneğin barındırma ve e-posta altyapısı) sunucuları yurt dışında bulunabilir; bu
        nedenle verileriniz Kanun&apos;un 9. maddesinde öngörülen koşullara uygun olarak yurt
        dışına aktarılabilir.
      </p>

      <h2>6. Saklama süresi</h2>
      <p>
        İletişim yazışmalarınız, talebinizin sonuçlanması ve ilgili yasal sürelerin gerektirdiği
        süre boyunca saklanır; süre sonunda silinir, yok edilir veya anonim hale getirilir.
        Sunucu kayıtları barındırma sağlayıcısının belirlediği kısa süreler içinde silinir.
      </p>

      <h2>7. Haklarınız</h2>
      <p>Kanun&apos;un 11. maddesi uyarınca veri sorumlusuna başvurarak şunları talep edebilirsiniz:</p>
      <ul>
        <li>Kişisel verilerinizin işlenip işlenmediğini öğrenmek,</li>
        <li>İşlenmişse buna ilişkin bilgi talep etmek,</li>
        <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenmek,</li>
        <li>Yurt içinde veya yurt dışında verilerin aktarıldığı üçüncü kişileri bilmek,</li>
        <li>Eksik veya yanlış işlenmiş verilerin düzeltilmesini istemek,</li>
        <li>Kanun&apos;un 7. maddesindeki şartlar çerçevesinde silinmesini veya yok edilmesini istemek,</li>
        <li>Bu işlemlerin verilerin aktarıldığı üçüncü kişilere bildirilmesini istemek,</li>
        <li>İşlenen verilerin otomatik sistemlerle analiz edilmesi sonucu aleyhinize bir sonuç çıkmasına itiraz etmek,</li>
        <li>Kanuna aykırı işlenmesi nedeniyle zarara uğramanız hâlinde zararın giderilmesini talep etmek.</li>
      </ul>

      <h2>8. Başvuru yöntemi</h2>
      <p>
        Haklarınıza ilişkin taleplerinizi
        {email ? (
          <>
            {" "}
            <a href={`mailto:${email}`}>{email}</a> adresine
          </>
        ) : (
          " İletişim sayfasındaki e-posta adresine"
        )}{" "}
        yazılı olarak iletebilirsiniz. Talebiniz niteliğine göre en geç otuz gün içinde
        sonuçlandırılır.
      </p>
    </LegalPage>
  )
}
