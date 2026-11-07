// Kullanım: pnpm seed-sample
// Test verisini (Lorem Ipsum yazıları, genel hero/hakkımda metni, test iletişim bilgisi)
// örnek ama gerçekçi içerikle değiştirir. Tekrar çalıştırılabilir. Metinler ÖRNEKTİR;
// Eren gerçek metinleri admin panelinden girer.
import { loadEnvConfig } from "@next/env"

loadEnvConfig(process.cwd())

const TEST_TITLES = ["Lorem Ipsum Dolor Sit Amet", "Lorem Ipsum", "Anksiyete", "Kaygı"]

const HERO = {
  headline: "Eren Arslan",
  description:
    "Psikanalitik yönelimle çalışan bir psikolog. Lacancı psikanalizin dinleme ve konuşma etiğine bağlı olarak formasyonumu sürdürüyorum. İstanbul'da yüz yüze ve çevrim içi görüşüyorum.",
  descriptionFr:
    "Psychologue d'orientation psychanalytique. Je poursuis ma formation dans l'éthique de l'écoute et de la parole propre à la psychanalyse lacanienne. Je reçois à Istanbul, en présentiel et en ligne.",
}

const ABOUT = `<p>Psikolog olarak çalışıyorum ve psikanalitik formasyonumu sürdürüyorum. Bu sayfada öğrenimimi, klinik deneyimimi ve bugün nasıl çalıştığımı kısaca anlatıyorum.</p>
<h2>Öğrenim</h2>
<p>Lisans eğitimimi Abant İzzet Baysal Üniversitesi'nde psikoloji alanında tamamladım. Ardından Arel Üniversitesi'nde klinik psikoloji yüksek lisansına başladım; çalışmalarım sürüyor.</p>
<h2>Klinik deneyim</h2>
<p>Eğitimim sırasında süpervizyon eşliğinde klinik stajlar yaptım ve farklı yaş gruplarıyla çalışma deneyimi edindim. Bu yıllar, bir insanı dinlemenin yalnızca duymak olmadığını, söylenenin ve söylenemeyenin arasında bir yer açmak olduğunu öğretti.</p>
<h2>Psikanalitik formasyon</h2>
<p>Lacancı psikanaliz çizgisinde formasyonumu sürdürüyorum. IF-EPFCL ve Lacancı Forum Türkiye çevresindeki seminerlere, okuma gruplarına ve süpervizyon çalışmalarına katılıyorum. Psikanaliz bana, konuşmanın ne kadar ciddi bir iş olduğunu her gün yeniden gösteriyor.</p>
<h2>Bugünkü pratik</h2>
<p>İstanbul'da, yüz yüze ve çevrim içi görüşmeler yapıyorum. Görüşmeler Türkçedir. Bilgi almak ve randevu için bana yazabilirsiniz.</p>
<blockquote><p>Aşk, sahip olmadığın şeyi, onu istemeyen birine vermektir.</p><p>Jacques Lacan</p></blockquote>`

const ABOUT_FR = `<p>Je suis psychologue et je poursuis ma formation psychanalytique. Cette page présente brièvement mon parcours et ma pratique.</p>
<h2>Formation universitaire</h2>
<p>J'ai obtenu ma licence de psychologie à l'Université Abant İzzet Baysal. J'ai ensuite entamé un master de psychologie clinique à l'Université Arel ; mes études sont en cours.</p>
<h2>Expérience clinique</h2>
<p>Au cours de ma formation, j'ai effectué des stages cliniques sous supervision auprès de publics variés. Ces années m'ont appris qu'écouter ne se réduit pas à entendre : il s'agit de faire place à ce qui se dit et à ce qui ne parvient pas à se dire.</p>
<h2>Formation psychanalytique</h2>
<p>Je poursuis ma formation dans l'orientation lacanienne, autour de l'IF-EPFCL et du Forum Lacanien de Turquie : séminaires, groupes de lecture et supervision.</p>
<h2>Pratique actuelle</h2>
<p>Je reçois à Istanbul, en présentiel et en ligne. Séances en turc ; contact possible en français.</p>
<blockquote><p>L'amour, c'est donner ce qu'on n'a pas à quelqu'un qui n'en veut pas.</p><p>Jacques Lacan</p></blockquote>`

const CONTACT = {
  email: "pskerenarslan@gmail.com",
  instagram: "pskerenarslan",
  // test amaçlı girilmiş geçersiz numara
  phone: null,
}

type Sample = {
  slug: string
  type: "YAZI" | "CEVIRI"
  lang?: "tr" | "fr"
  title: string
  excerpt: string
  content: string
  fullText?: boolean
  daysAgo: number
  originalAuthor?: string
  originalTitle?: string
  originalLang?: string
  sourceCitation?: string
  sourceUrl?: string
}

const POSTS: Sample[] = [
  {
    slug: "psikanalizde-dinlemek",
    type: "YAZI",
    title: "Psikanalizde Dinlemek",
    excerpt:
      "Psikanalitik dinleme, söyleneni anlamaya çalışmaktan çok, söylenenin içinde konuşan başka bir şeye yer açmaktır.",
    content: `<p>Gündelik hayatta dinlemek, karşımızdakinin ne demek istediğini anlamak ve ona bir karşılık vermek demektir. Psikanalizde ise dinlemek biraz daha geride durmayı, anlamak için acele etmemeyi gerektirir.</p>
<p>Konuşan kişi çoğu zaman kendi söylediğinden fazlasını söyler. Bir kelimenin seçimi, bir cümlenin yarım kalışı, aynı konuya tekrar tekrar dönmek: bunların hepsi kişinin kendi bilmediği bir şeye işaret edebilir.</p>
<h2>Anlamaktan önce</h2>
<p>Bu yüzden analitik dinleme, hemen yorum yapmaktan kaçınır. Anlam, çoğu zaman anlatılanın içinde değil, anlatılanın bir sonraki cümlede nasıl değiştiğinde ortaya çıkar. Dinleyenin işi, bu değişime alan bırakmaktır.</p>
<p>Bu bir teknik olmaktan önce bir tutumdur: karşımızdakinin kendi sözüne yaklaşabilmesi için ona zaman tanımak.</p>`,
    daysAgo: 6,
  },
  {
    slug: "konusmanin-bir-yolu-olarak-seans",
    type: "YAZI",
    title: "Konuşmanın Bir Yolu Olarak Seans",
    excerpt:
      "Seans, bir sorunun çözüldüğü yerden çok, kişinin kendi sözüyle yeniden karşılaştığı bir alan olarak düşünülebilir.",
    content: `<p>Birçok kişi terapiye ya da analize, hızlı bir yanıt bulma beklentisiyle gelir. Oysa seansın işleyişi bunun tersini önerir: önce konuşmak, sonra konuştuklarımızın bizi nereye götürdüğüne bakmak.</p>
<p>Düzenli görüşmeler, konuşmanın kendi ritmini kurmasına izin verir. Aynı cümleler farklı günlerde farklı duyulur; bir hafta önce önemsiz görünen bir ayrıntı, bugün başka bir yerden anlam kazanır.</p>
<h2>Zamanın payı</h2>
<p>Bu süreçte zaman bir engel değil, çalışmanın malzemesidir. Kişi, acele etmeden kendi sözünün izini sürebildiğinde, kendisiyle ilişkisinin nasıl kurulduğunu da fark etmeye başlar.</p>`,
    daysAgo: 20,
  },
  {
    slug: "cocukluk-animlari-ve-sonradanlik",
    type: "YAZI",
    title: "Çocukluk Anıları ve Sonradanlık",
    excerpt:
      "Geçmişe dair anılar, yaşandıkları gibi değil, sonradan yeniden kurulduğu hâliyle bizimle konuşur.",
    content: `<p>Freud'un "sonradanlık" (Nachträglichkeit) kavramı, bir anının yaşandığı anda değil, daha sonraki bir olayla birlikte anlam kazandığını söyler. Geçmiş, bu anlamda hiçbir zaman bitmiş bir şey değildir.</p>
<p>Çocukken yaşanan bir olay, o sırada anlaşılamayabilir. Yıllar sonra başka bir deneyim, o olaya yeni bir anlam yükler. Biz de geçmişi anlatırken aslında bugünden anlatırız.</p>
<h2>Anlatmanın yeri</h2>
<p>Bu yüzden analizde anılar, doğrulanması gereken olaylar olarak değil, anlatıldıkça değişen bir malzeme olarak ele alınır. Anlatılan kadar, anlatma biçimi de önemlidir.</p>`,
    daysAgo: 41,
  },
  {
    slug: "ayna-evresi-uzerine",
    type: "CEVIRI",
    title: "Ayna Evresi Üzerine",
    excerpt:
      "Lacan'ın, Ben işlevinin oluşumunda ayna evresinin rolünü ele aldığı kısa ve etkili metnin çevirisi. Yalnızca özet burada, tam metin dış kaynakta.",
    content: "",
    fullText: false,
    daysAgo: 12,
    originalAuthor: "Jacques Lacan",
    originalTitle: "Le stade du miroir comme formateur de la fonction du Je",
    originalLang: "Fransızca",
    sourceCitation: "Écrits, Éditions du Seuil, 1966 (ilk sunum 1949)",
    sourceUrl: "http://www.champlacanien.net/",
  },
  {
    slug: "ecouter-est-ce-deja-interpreter",
    type: "YAZI",
    lang: "fr",
    title: "Écouter, est-ce déjà interpréter ?",
    excerpt:
      "Une courte réflexion sur la place de l'écoute dans la cure : laisser la parole se déployer avant de chercher à comprendre.",
    content: `<p>Dans la cure analytique, l'écoute ne consiste pas à saisir aussitôt ce que l'autre veut dire. Elle suppose de laisser à la parole le temps de se déployer et de se démentir.</p>
<p>Ce que le sujet dit contient toujours plus que ce qu'il croit dire. Un mot choisi, une phrase interrompue, un retour insistant sur le même point : autant d'indices d'un savoir qui ne se sait pas encore.</p>
<p>Écouter, c'est alors faire place à ce décalage, sans se hâter de le combler.</p>`,
    daysAgo: 30,
  },
]

async function main() {
  const { db } = await import("../lib/db")
  const { sanitizeContent } = await import("../lib/sanitize")

  const removed = await db.post.deleteMany({ where: { title: { in: TEST_TITLES } } })

  await db.hero.upsert({
    where: { id: "main" },
    update: HERO,
    create: { id: "main", ...HERO },
  })
  const about = { content: sanitizeContent(ABOUT), contentFr: sanitizeContent(ABOUT_FR) }
  await db.about.upsert({ where: { id: "main" }, update: about, create: { id: "main", ...about } })
  await db.contact.upsert({
    where: { id: "main" },
    update: CONTACT,
    create: { id: "main", ...CONTACT },
  })

  for (const post of POSTS) {
    const data = {
      type: post.type,
      lang: post.lang ?? "tr",
      title: post.title,
      excerpt: post.excerpt,
      content: post.fullText === false ? "" : sanitizeContent(post.content),
      fullText: post.fullText ?? true,
      originalAuthor: post.originalAuthor ?? null,
      originalTitle: post.originalTitle ?? null,
      originalLang: post.originalLang ?? null,
      sourceCitation: post.sourceCitation ?? null,
      sourceUrl: post.sourceUrl ?? null,
      status: "PUBLISHED" as const,
      publishedAt: new Date(Date.now() - post.daysAgo * 24 * 60 * 60 * 1000),
    }
    await db.post.upsert({
      where: { slug: post.slug },
      update: data,
      create: { slug: post.slug, ...data },
    })
  }

  console.log(
    `${removed.count} test yazısı silindi; hero, hakkımda, iletişim ve ${POSTS.length} örnek kayıt yazıldı.`
  )
  await db.$disconnect()
}

main().catch((error) => {
  console.error("Hata:", error instanceof Error ? error.message : error)
  process.exit(1)
})
