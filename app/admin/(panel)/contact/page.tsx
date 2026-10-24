import type { Metadata } from "next"
import { connection } from "next/server"
import { Suspense } from "react"

import { FormSkeleton } from "@/components/admin/skeletons"
import { ContactForm } from "@/components/contact-form"
import { db } from "@/lib/db"

export const metadata: Metadata = {
  title: "İletişim",
  robots: { index: false, follow: false },
}

export default function ContactPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold">İletişim</h1>
      <Suspense fallback={<FormSkeleton />}>
        <ContactEditor />
      </Suspense>
    </>
  )
}

async function ContactEditor() {
  await connection()
  const contact = await db.contact.findUnique({ where: { id: "main" } })

  return (
    <ContactForm
      initialValues={
        contact
          ? {
              email: contact.email ?? "",
              phone: contact.phone ?? "",
              whatsapp: contact.whatsapp ?? "",
              address: contact.address ?? "",
              instagram: contact.instagram ?? "",
              x: contact.x ?? "",
            }
          : undefined
      }
    />
  )
}
