import { NotFoundContent } from "@/components/site/not-found-content"
import { SiteShell } from "@/components/site/site-shell"

// Eşleşmeyen adresler (kök 404): site iskeletiyle gösterilir
export default function NotFound() {
  return (
    <SiteShell locale="tr">
      <NotFoundContent locale="tr" />
    </SiteShell>
  )
}
