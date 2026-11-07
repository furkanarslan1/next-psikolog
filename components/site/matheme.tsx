import type { ReactNode } from "react"

// Lacancı matem tarzı küçük imza: her kayda adından türetilen sabit bir sembol verilir.
// Süs amaçlıdır (ekran okuyuculardan gizli). Sembol listesi bilerek karışık tutulur.
const symbols: ReactNode[] = [
  "$",
  <i key="a">a</i>,
  "Φ",
  <span key="s1">
    S<sub>1</sub>
  </span>,
  <span key="s2">
    S<sub>2</sub>
  </span>,
  "A",
  <i key="ia">i(a)</i>,
  "Σ",
]

function pick(seed: string) {
  let hash = 0
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return symbols[hash % symbols.length]
}

export function Matheme({ seed, className = "" }: { seed: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-line font-serif-site text-lg leading-none text-ink-soft select-none [&_sub]:text-[0.6em] ${className}`}
    >
      {pick(seed)}
    </span>
  )
}
