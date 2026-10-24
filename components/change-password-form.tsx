"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

import { changePasswordAction, logoutAction } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from "@/lib/validations/auth"

const fields = [
  { name: "currentPassword", label: "Mevcut şifre", autoComplete: "current-password" },
  { name: "newPassword", label: "Yeni şifre", autoComplete: "new-password" },
  { name: "confirmPassword", label: "Yeni şifre (tekrar)", autoComplete: "new-password" },
] as const

export function ChangePasswordForm() {
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  })

  async function onSubmit(values: ChangePasswordValues) {
    const result = await changePasswordAction(values)
    if (result.error) {
      toast.error(result.error)
      form.reset()
      return
    }
    toast.success("Şifre değiştirildi. Lütfen yeniden giriş yapın.")
    await logoutAction()
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Şifre Değiştir</CardTitle>
        <CardDescription>
          Şifre değiştikten sonra yeniden giriş yapmanız gerekir
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            {fields.map(({ name, label, autoComplete }) => (
              <Controller
                key={name}
                name={name}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={name}>{label}</FieldLabel>
                    <Input
                      {...field}
                      id={name}
                      type="password"
                      autoComplete={autoComplete}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            ))}
            <Field>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Şifreyi Değiştir
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
