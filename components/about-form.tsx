"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

import { saveAboutAction } from "@/app/admin/(panel)/about/actions"
import { RichTextEditor } from "@/components/rich-text-editor"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { aboutSchema, type AboutValues } from "@/lib/validations/about"

const emptyValues: AboutValues = { content: "", contentFr: "" }

export function AboutForm({ initialValues }: { initialValues?: AboutValues }) {
  const router = useRouter()

  const form = useForm<AboutValues>({
    resolver: zodResolver(aboutSchema),
    defaultValues: initialValues ?? emptyValues,
  })

  async function onSubmit(values: AboutValues) {
    const result = await saveAboutAction(values)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success("Hakkımda kaydedildi")
    router.push("/admin/dashboard")
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex max-w-3xl flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Metin</CardTitle>
          <CardDescription>
            Ana sayfadaki Hakkımda bölümünde olduğu gibi görünür
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Controller
            name="content"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="sr-only">Hakkımda metni</FieldLabel>
                <RichTextEditor value={field.value} onChange={field.onChange} invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fransızca metin (Présentation)</CardTitle>
          <CardDescription>
            Fransızca sürümdeki Présentation sayfasında görünür. Boş bırakırsanız sayfada
            &quot;yakında&quot; yazar. Fransızca seans verilmediği sürece bunu iddia etmeyin
            (örn. &quot;Séances en turc ; contact possible en français&quot;).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Controller
            name="contentFr"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel className="sr-only">Fransızca Hakkımda metni</FieldLabel>
                <RichTextEditor value={field.value} onChange={field.onChange} />
              </Field>
            )}
          />
        </CardContent>
      </Card>

      <Button type="submit" className="w-fit" disabled={form.formState.isSubmitting}>
        Kaydet
      </Button>
    </form>
  )
}
