"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Controller, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"

import {
  createPostAction,
  updatePostAction,
} from "@/app/admin/(panel)/posts/actions"
import { RichTextEditor } from "@/components/rich-text-editor"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { postSchema, type PostValues } from "@/lib/validations/post"

const emptyValues: PostValues = {
  type: "YAZI",
  lang: "tr",
  title: "",
  excerpt: "",
  content: "",
  fullText: true,
  featured: false,
  publishedIn: "",
  originalAuthor: "",
  originalTitle: "",
  originalLang: "",
  sourceCitation: "",
  sourceUrl: "",
  status: "DRAFT",
  metaTitle: "",
  metaDescription: "",
}

const selectClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

export function PostForm({
  postId,
  initialValues,
}: {
  postId?: string
  initialValues?: PostValues
}) {
  const router = useRouter()

  const form = useForm<PostValues>({
    resolver: zodResolver(postSchema),
    defaultValues: initialValues ?? emptyValues,
  })

  const type = useWatch({ control: form.control, name: "type" })
  const fullText = useWatch({ control: form.control, name: "fullText" })

  async function onSubmit(values: PostValues) {
    const result = postId
      ? await updatePostAction(postId, values)
      : await createPostAction(values)

    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success(postId ? "Yazı güncellendi" : "Yazı oluşturuldu")
    router.push("/admin/posts")
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
                  <FieldDescription>{field.value.length}/300 — yazı listesinde ve arama sonuçlarında görünür</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="fullText"
              control={form.control}
              render={({ field }) => (
                <Field orientation="horizontal">
                  <input
                    id="fullText"
                    type="checkbox"
                    checked={field.value}
                    onChange={(event) => field.onChange(event.target.checked)}
                    className="size-4"
                  />
                  <FieldLabel htmlFor="fullText">Tam metni sitede yayımla</FieldLabel>
                </Field>
              )}
            />
            {fullText ? (
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
            ) : (
              <Controller
                name="sourceUrl"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="sourceUrl">Tam metnin dış bağlantısı *</FieldLabel>
                    <Input
                      {...field}
                      id="sourceUrl"
                      placeholder="https://..."
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldDescription>
                      Telif nedeniyle yalnızca özet gösterilir; &quot;Tam metne git&quot; bu adrese
                      yönlendirir (örn. dergi veya Corpus).
                    </FieldDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            )}
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
                name="type"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="type">Tür</FieldLabel>
                    <select {...field} id="type" className={selectClass}>
                      <option value="YAZI">Yazı</option>
                      <option value="CEVIRI">Çeviri</option>
                    </select>
                  </Field>
                )}
              />
              <Controller
                name="lang"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="lang">Dil</FieldLabel>
                    <select {...field} id="lang" className={selectClass}>
                      <option value="tr">Türkçe</option>
                      <option value="fr">Fransızca</option>
                    </select>
                    <FieldDescription>
                      Listede dillere göre ayrılmaz; yalnızca sayfanın dil bilgisi için kullanılır.
                    </FieldDescription>
                  </Field>
                )}
              />
              <Controller
                name="publishedIn"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="publishedIn">Yayımlandığı yer</FieldLabel>
                    <Input
                      {...field}
                      id="publishedIn"
                      placeholder="Dergi, sayı veya sempozyum"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="featured"
                control={form.control}
                render={({ field }) => (
                  <Field orientation="horizontal">
                    <input
                      id="featured"
                      type="checkbox"
                      checked={field.value}
                      onChange={(event) => field.onChange(event.target.checked)}
                      className="size-4"
                    />
                    <FieldLabel htmlFor="featured">Ana sayfada öne çıkar</FieldLabel>
                  </Field>
                )}
              />
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {postId ? "Kaydet" : "Oluştur"}
              </Button>
            </FieldGroup>
          </CardContent>
        </Card>

        {type === "CEVIRI" && (
          <Card>
            <CardHeader>
              <CardTitle>Çeviri bilgileri</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Controller
                  name="originalAuthor"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="originalAuthor">Orijinal yazar *</FieldLabel>
                      <Input {...field} id="originalAuthor" aria-invalid={fieldState.invalid} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name="originalTitle"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="originalTitle">Orijinal başlık</FieldLabel>
                      <Input {...field} id="originalTitle" aria-invalid={fieldState.invalid} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name="originalLang"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="originalLang">Orijinal dil</FieldLabel>
                      <Input
                        {...field}
                        id="originalLang"
                        placeholder="Fransızca"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name="sourceCitation"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="sourceCitation">Kaynak</FieldLabel>
                      <Textarea
                        {...field}
                        id="sourceCitation"
                        rows={2}
                        placeholder="Orijinal yayın, yıl"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                {fullText && (
                  <Controller
                    name="sourceUrl"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="sourceUrl">Kaynak bağlantısı</FieldLabel>
                        <Input
                          {...field}
                          id="sourceUrl"
                          placeholder="https://..."
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                )}
              </FieldGroup>
            </CardContent>
          </Card>
        )}

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
