// Türkiye odaklı telefon normalleştirme: "0532 123 45 67" -> "+905321234567".
// Geçersizse null döner.
export function normalizePhone(input: string) {
  const compact = input.replace(/[\s()-]/g, "")
  let digits = compact.replace(/[^\d+]/g, "")

  if (digits.startsWith("+")) digits = digits.slice(1)
  else if (digits.startsWith("00")) digits = digits.slice(2)
  else if (digits.startsWith("0") && digits.length === 11) digits = `90${digits.slice(1)}`
  else if (digits.length === 10 && digits.startsWith("5")) digits = `90${digits}`

  return /^\d{10,15}$/.test(digits) ? `+${digits}` : null
}

export function telHref(input: string) {
  const phone = normalizePhone(input)
  return phone ? `tel:${phone}` : null
}

export function whatsappHref(input: string, text?: string) {
  const phone = normalizePhone(input)
  if (!phone) return null
  const query = text ? `?text=${encodeURIComponent(text)}` : ""
  return `https://wa.me/${phone.slice(1)}${query}`
}
