import { Toaster } from "sonner"

// Bildirimler yalnızca yönetim panelinde yüklenir (herkese açık sayfalara JS eklemez)
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster richColors position="top-center" />
    </>
  )
}
