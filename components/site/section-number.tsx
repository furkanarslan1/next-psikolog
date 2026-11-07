// "No. 01" tarzı bölüm numarası (küçük, harf aralıklı)
export function SectionNumber({ n }: { n: string }) {
  return <p className="label-caps text-brand">No. {n}</p>
}
