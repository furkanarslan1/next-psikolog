"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ImageIcon, XIcon } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import * as React from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"

import { saveHeroAction } from "@/app/admin/(panel)/hero/actions"
import { UploadProgress } from "@/components/upload-progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { uploadImage } from "@/lib/upload-image"
import { heroSchema, type HeroValues } from "@/lib/validations/hero"

const emptyValues: HeroValues = {
  headline: "",
  description: "",
  buttonLabel: "Randevu alın",
  buttonUrl: "",
  imageUrl: "",
  imageAlt: "",
}

export function HeroForm({ initialValues }: { initialValues?: HeroValues }) {
  const router = useRouter()
  const [progress, setProgress] = React.useState<number | null>(null)
  const uploading = progress !== null
  const fileInput = React.useRef<HTMLInputElement>(null)

  const form = useForm<HeroValues>({
    resolver: zodResolver(heroSchema),
    defaultValues: initialValues ?? emptyValues,
  })
  const imageUrl = useWatch({ control: form.control, name: "imageUrl" })

  async function onSubmit(values: HeroValues) {
    const result = await saveHeroAction(values)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success("Hero kaydedildi")
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
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex max-w-2xl flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Metin</CardTitle>
          <CardDescription>Ana sayfanın en üstünde görünen bölüm</CardDescription>
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
                  <FieldDescription>Genellikle ad, soyad ve unvan</FieldDescription>
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
                    {field.value.length}/280 — isteğe bağlı, başlığın altında daha küçük
                    yazıyla görünür
                  </FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="buttonLabel"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="buttonLabel">Buton yazısı *</FieldLabel>
                  <Input {...field} id="buttonLabel" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="buttonUrl"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="buttonUrl">Buton bağlantısı *</FieldLabel>
                  <Input
                    {...field}
                    id="buttonUrl"
                    placeholder="https://randevu-sitesi.com/..."
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>
                    Randevu sayfasının adresi. Site içi sayfa için /iletisim gibi, e-posta
                    için mailto:ad@ornek.com yazabilirsiniz.
                  </FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Görsel</CardTitle>
          <CardDescription>
            Görsel kırpılmadan, kendi oranında gösterilir. Değiştirdiğinizde eski görsel
            silinir.
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

      <Button type="submit" className="w-fit" disabled={form.formState.isSubmitting || uploading}>
        Kaydet
      </Button>
    </form>
  )
}
