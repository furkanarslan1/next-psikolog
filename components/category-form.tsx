"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

import { createCategoryAction } from "@/app/admin/(panel)/categories/actions"
import { Button } from "@/components/ui/button"
import { Field, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { categorySchema, type CategoryValues } from "@/lib/validations/post"

export function CategoryForm() {
  const router = useRouter()
  const form = useForm<CategoryValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "" },
  })

  async function onSubmit(values: CategoryValues) {
    const result = await createCategoryAction(values)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success("Kategori eklendi")
    form.reset()
    router.refresh()
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex max-w-md items-start gap-2">
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Input {...field} placeholder="Yeni kategori adı" aria-label="Kategori adı" aria-invalid={fieldState.invalid} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" disabled={form.formState.isSubmitting}>
        Ekle
      </Button>
    </form>
  )
}
