export function readingMinutes(html: string) {
  const words = html.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}
