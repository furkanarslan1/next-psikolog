// Çerçeve görselin kendi oranını izler (kırpma yok); aşırı dar veya geniş
// oranlar sınırlanır. Oran bilinmiyorsa 4:5.
export function frameRatio(width: number | null, height: number | null) {
  if (!width || !height) return 4 / 5
  return Math.min(1.6, Math.max(0.6, width / height))
}
