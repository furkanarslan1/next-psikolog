"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ImageIcon, XIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"

import {
  createPostAction,
  updatePostAction,
} from "@/app/admin/(panel)/posts/actions"
import { RichTextEditor } from "@/components/rich-text-editor"
import { TagInput } from "@/components/tag-input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UploadProgress } from "@/components/upload-progress"
import { uploadImage } from "@/lib/upload-image"
import { postSchema, type PostValues } from "@/lib/validations/post"

const emptyValues: PostValues = {
  title: "",
  excerpt: "",
  content: "",
  coverImageUrl: "",
  coverImageAlt: "",
  categoryId: "",
  tags: [],
  status: "DRAFT",
  metaTitle: "",
  metaDescription: "",
}

const selectClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

export function PostForm({
  categories,
  postId,
  initialValues,
}: {
  categories: { id: string; name: string }[]
  postId?: string
  initialValues?: PostValues
}) {
  const router = useRouter()
  const [progress, setProgress] = React.useState<number | null>(null)
  const uploading = progress !== null
  const coverInput = React.useRef<HTMLInputElement>(null)

  const form = useForm<PostValues>({
    resolver: zodResolver(postSchema),
    defaultValues: initialValues ?? emptyValues,
  })
  const coverImageUrl = useWatch({ control: form.control, name: "coverImageUrl" })

  async function onSubmit(values: PostValues) {
    const result = postId
      ? await updatePostAction(postId, values)
      : await createPostAction(values)

    if (result.error) {
      toast.error(result.error)
      return
    }
    if (postId) {
      toast.success("Yazı güncellendi")
      router.refresh()
    } else {
      toast.success("Yazı oluşturuldu")
      router.push("/admin/posts")
    }
  }

  async function onCoverSelected(file: File | undefined) {
    if (!file) return
    setProgress(0)
    try {
      form.setValue("coverImageUrl", await uploadImage(file, setProgress), {
        shouldDirty: true,
      })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Görsel yüklenemedi")
    } finally {
      setProgress(null)
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      className="grid gap-6 lg:grid-cols-[1fr_20rem]"
    >
      <Card>
        <CardContent>
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="title">Başlık *</FieldLabel>
                  <Input
                    {...field}
                    id="title"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="excerpt"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="excerpt">Özet *</FieldLabel>
                  <Textarea {...field} id="excerpt" rows={3} aria-invalid={fieldState.invalid} />
                  <FieldDescription>{field.value.length}/300 — blog listesinde ve arama sonuçlarında görünür</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="content"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>İçerik *</FieldLabel>
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Yayın</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Controller
                name="status"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="status">Durum</FieldLabel>
                    <select {...field} id="status" className={selectClass}>
                      <option value="DRAFT">Taslak</option>
                      <option value="PUBLISHED">Yayında</option>
                    </select>
                  </Field>
                )}
              />
              <Controller
                name="categoryId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="categoryId">Kategori (yayın için zorunlu)</FieldLabel>
                    <select
                      {...field}
                      id="categoryId"
                      className={selectClass}
                      aria-invalid={fieldState.invalid}
                    >
                      <option value="">Kategori seçin</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {categories.length === 0 && (
                      <FieldDescription>
                        Henüz kategori yok.{" "}
                        <Link href="/admin/categories" className="underline">
                          Önce bir kategori ekleyin
                        </Link>
                        .
                      </FieldDescription>
                    )}
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="tags"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="tags">Etiketler</FieldLabel>
                    <TagInput id="tags" value={field.value} onChange={field.onChange} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Button type="submit" disabled={form.formState.isSubmitting || uploading}>
                {postId ? "Kaydet" : "Oluştur"}
              </Button>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kapak görseli</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                {coverImageUrl ? (
                  <div className="relative aspect-video overflow-hidden rounded-lg border">
                    <Image src={coverImageUrl} alt="" fill sizes="20rem" className="object-cover" />
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="secondary"
                      className="absolute top-2 right-2"
                      aria-label="Görseli kaldır"
                      onClick={() => form.setValue("coverImageUrl", "", { shouldDirty: true })}
                    >
                      <XIcon />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={uploading}
                      onClick={() => coverInput.current?.click()}
                    >
                      <ImageIcon />
                      {uploading ? "Yükleniyor..." : "Görsel yükle"}
                    </Button>
                    {progress !== null && <UploadProgress percent={progress} />}
                  </>
                )}
                <input
                  ref={coverInput}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(event) => {
                    void onCoverSelected(event.target.files?.[0])
                    event.target.value = ""
                  }}
                />
              </Field>
              <Controller
                name="coverImageAlt"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="coverImageAlt">Alt metin</FieldLabel>
                    <Input {...field} id="coverImageAlt" aria-invalid={fieldState.invalid} />
                    <FieldDescription>Görsel seçildiyse zorunlu (SEO ve erişilebilirlik)</FieldDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Arama motoru (isteğe bağlı)</CardTitle>
          </CardHeader>
          <CardContent>
            <details className="group">
              <summary className="cursor-pointer text-sm text-muted-foreground">
                Google&apos;da görünümü özelleştir
              </summary>
              <p className="mt-2 mb-4 text-sm text-muted-foreground">
                Boş bırakırsanız yazının başlığı ve özeti otomatik kullanılır.
              </p>
            <FieldGroup>
              <Controller
                name="metaTitle"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="metaTitle">Meta başlık</FieldLabel>
                    <Input {...field} id="metaTitle" aria-invalid={fieldState.invalid} />
                    <FieldDescription>{field.value.length}/60 karakter</FieldDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="metaDescription"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="metaDescription">Meta açıklama</FieldLabel>
                    <Textarea {...field} id="metaDescription" rows={3} aria-invalid={fieldState.invalid} />
                    <FieldDescription>{field.value.length}/160 karakter</FieldDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
            </details>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
