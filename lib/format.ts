const dateFormat = new Intl.DateTimeFormat("tr-TR", {
  dateStyle: "long",
  timeZone: "Europe/Istanbul",
})

export function formatDate(date: Date) {
  return dateFormat.format(date)
}
