"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

import { saveContactAction } from "@/app/admin/(panel)/contact/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { contactSchema, type ContactValues } from "@/lib/validations/contact"

const emptyValues: ContactValues = { email: "", phone: "", whatsapp: "", address: "" }

export function ContactForm({ initialValues }: { initialValues?: ContactValues }) {
  const router = useRouter()
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: initialValues ?? emptyValues,
  })

  async function onSubmit(values: ContactValues) {
    const result = await saveContactAction(values)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success("İletişim bilgileri kaydedildi")
    router.push("/admin/dashboard")
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>İletişim bilgileri</CardTitle>
          <CardDescription>
            Boş bıraktığınız alan sitede görünmez. Hiçbiri doldurulmazsa iletişim bölümü
            gizlenir.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">E-posta</FieldLabel>
                  <Input {...field} id="email" type="email" aria-invalid={fieldState.invalid} />
                  <FieldDescription>Tıklayınca ziyaretçinin e-posta uygulaması açılır</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="phone">Telefon</FieldLabel>
                  <Input {...field} id="phone" type="tel" placeholder="0532 123 45 67" aria-invalid={fieldState.invalid} />
                  <FieldDescription>Tıklayınca arama başlar</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="whatsapp"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="whatsapp">WhatsApp numarası</FieldLabel>
                  <Input {...field} id="whatsapp" type="tel" placeholder="0532 123 45 67" aria-invalid={fieldState.invalid} />
                  <FieldDescription>
                    Tıklayınca WhatsApp&apos;ta yeni bir yazışma açılır. Telefonla aynıysa yine de
                    yazın.
                  </FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="address"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="address">Adres</FieldLabel>
                  <Textarea {...field} id="address" rows={3} aria-invalid={fieldState.invalid} />
                  <FieldDescription>
                    Sitede &quot;Yol tarifi al&quot; bağlantısı otomatik oluşur (Google Haritalar).
                  </FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Button type="submit" className="w-fit" disabled={form.formState.isSubmitting}>
              Kaydet
            </Button>
          </FieldGroup>
        </CardContent>
      </Card>
    </form>
  )
}
