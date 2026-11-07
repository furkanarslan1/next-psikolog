// Serbest metin dil adını (admin'de "Fransızca" gibi yazılır) geçerli BCP 47 koduna çevirir.
// Tanınmayan ad için undefined döner; böyle bir metne lang özniteliği konmaz.
const codes: Record<string, string> = {
  türkçe: "tr",
  turkce: "tr",
  fransızca: "fr",
  fransizca: "fr",
  français: "fr",
  francais: "fr",
  french: "fr",
  ingilizce: "en",
  english: "en",
  almanca: "de",
  deutsch: "de",
  german: "de",
  italyanca: "it",
  italiano: "it",
  ispanyolca: "es",
  español: "es",
  espanol: "es",
  latince: "la",
  latin: "la",
  yunanca: "el",
  rusça: "ru",
  rusca: "ru",
  arapça: "ar",
  arapca: "ar",
}

export function langCode(name: string | null | undefined) {
  if (!name) return undefined
  const key = name.trim().toLocaleLowerCase("tr")
  if (/^[a-z]{2,3}(-[a-z0-9]{2,8})*$/i.test(key)) return key
  return codes[key]
}
