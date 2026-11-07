import { SiteShell } from "@/components/site/site-shell"

export default function FrenchLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell locale="fr">{children}</SiteShell>
}
