"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

import { saveHeroAction } from "@/app/admin/(panel)/hero/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { heroSchema, type HeroValues } from "@/lib/validations/hero"

const emptyValues: HeroValues = {
  headline: "",
  description: "",
}

export function HeroForm({ initialValues }: { initialValues?: HeroValues }) {
  const router = useRouter()

  const form = useForm<HeroValues>({
    resolver: zodResolver(heroSchema),
    defaultValues: initialValues ?? emptyValues,
  })

  async function onSubmit(values: HeroValues) {
    const result = await saveHeroAction(values)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success("Hero kaydedildi")
    router.push("/admin/dashboard")
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex max-w-2xl flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Metin</CardTitle>
          <CardDescription>Ana sayfanın en üstünde görünen bölüm. Altındaki &quot;Hakkımda&quot; ve &quot;İletişime Geçin&quot; butonları sabittir.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Controller
              name="headline"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="headline">Başlık *</FieldLabel>
                  <Input {...field} id="headline" aria-invalid={fieldState.invalid} />
                  <FieldDescription>Büyük harflerle görünen ad, örn. Eren Arslan</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="description">Açıklama</FieldLabel>
                  <Textarea {...field} id="description" rows={3} aria-invalid={fieldState.invalid} />
                  <FieldDescription>
                    {field.value.length}/400 — 2-3 cümlelik tanıtım: yönelim, kurum üyelikleri
                  </FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>
      </Card>

      <Button type="submit" className="w-fit" disabled={form.formState.isSubmitting}>
        Kaydet
      </Button>
    </form>
  )
}
