import { formatDateLocale, type Locale } from "@/lib/i18n"

export function formatDate(date: Date, locale: Locale = "tr") {
  return formatDateLocale(date, locale)
}
