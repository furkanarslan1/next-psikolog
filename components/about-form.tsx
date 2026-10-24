"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ImageIcon, XIcon } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import * as React from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"

import { saveAboutAction } from "@/app/admin/(panel)/about/actions"
import { RichTextEditor } from "@/components/rich-text-editor"
import { UploadProgress } from "@/components/upload-progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { uploadImage } from "@/lib/upload-image"
import { aboutSchema, type AboutValues } from "@/lib/validations/about"

const emptyValues: AboutValues = { content: "", imageUrl: "", imageAlt: "" }

export function AboutForm({ initialValues }: { initialValues?: AboutValues }) {
  const router = useRouter()
  const [progress, setProgress] = React.useState<number | null>(null)
  const uploading = progress !== null
  const fileInput = React.useRef<HTMLInputElement>(null)

  const form = useForm<AboutValues>({
    resolver: zodResolver(aboutSchema),
    defaultValues: initialValues ?? emptyValues,
  })
  const imageUrl = useWatch({ control: form.control, name: "imageUrl" })

  async function onSubmit(values: AboutValues) {
    const result = await saveAboutAction(values)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success("Hakkımda kaydedildi")
    router.push("/admin/dashboard")
  }

  async function onImageSelected(file: File | undefined) {
    if (!file) return
    setProgress(0)
    try {
      const image = await uploadImage(file, setProgress)
      form.setValue("imageUrl", image.url, { shouldDirty: true })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Görsel yüklenemedi")
    } finally {
      setProgress(null)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex max-w-3xl flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Görsel</CardTitle>
          <CardDescription>
            Görsel kırpılmadan, kendi oranında gösterilir. Değiştirdiğinizde eski görsel silinir.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              {imageUrl ? (
                <div className="relative aspect-[4/5] w-64 overflow-hidden rounded-lg border bg-muted">
                  <Image src={imageUrl} alt="" fill sizes="320px" className="object-contain" />
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="secondary"
                    className="absolute top-2 right-2"
                    aria-label="Görseli kaldır"
                    onClick={() => form.setValue("imageUrl", "", { shouldDirty: true })}
                  >
                    <XIcon />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-fit"
                    disabled={uploading}
                    onClick={() => fileInput.current?.click()}
                  >
                    <ImageIcon />
                    {uploading ? "Yükleniyor..." : "Görsel yükle"}
                  </Button>
                  {progress !== null && <UploadProgress percent={progress} />}
                </div>
              )}
              <input
                ref={fileInput}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(event) => {
                  void onImageSelected(event.target.files?.[0])
                  event.target.value = ""
                }}
              />
            </Field>
            {imageUrl && (
              <Controller
                name="imageAlt"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="imageAlt">Alt metin *</FieldLabel>
                    <Input {...field} id="imageAlt" aria-invalid={fieldState.invalid} />
                    <FieldDescription>Görseli kısaca tanımlayın (SEO ve erişilebilirlik)</FieldDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            )}
          </FieldGroup>
        </CardContent>
      </Card>

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

      <Button type="submit" className="w-fit" disabled={form.formState.isSubmitting || uploading}>
        Kaydet
      </Button>
    </form>
  )
}
