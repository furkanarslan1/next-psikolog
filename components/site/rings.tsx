// Süs şekli: üç kesişen halka (Lacan'ın Borromean düğümüne gönderme) ve yumuşak bir disk.
// Yalnızca çizgi ve düz renk, gradyan yok; ekran okuyuculardan gizli, sıfır ağ isteği.
export function Rings({
  className = "",
  disc = "tile",
}: {
  className?: string
  disc?: "tile" | "paper" | "none"
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 520 480"
      fill="none"
      className={`pointer-events-none select-none ${className}`}
    >
      {disc !== "none" && (
        <circle cx="260" cy="225" r="190" className={disc === "tile" ? "fill-tile" : "fill-paper"} />
      )}
      <circle cx="200" cy="190" r="130" className="stroke-brand/60" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
      <circle cx="320" cy="190" r="130" className="stroke-ink/30" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
      <circle cx="260" cy="292" r="130" className="stroke-brand/35" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
      <circle cx="455" cy="62" r="6" className="fill-brand/70" />
      <circle cx="68" cy="410" r="4" className="fill-ink/40" />
    </svg>
  )
}
