"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

function PromptForm({
  label,
  initialValue,
  placeholder,
  submitLabel,
  cancelLabel,
  onSubmit,
  onCancel,
}: {
  label: string
  initialValue: string
  placeholder?: string
  submitLabel: string
  cancelLabel: string
  onSubmit: (value: string) => void
  onCancel: () => void
}) {
  const [value, setValue] = React.useState(initialValue)

  return (
    <form
      onSubmit={(event) => {
        // diyalog form içindeki bir bileşende render edilebilir:
        // submit olayı üstteki yazı formuna ulaşmamalı
        event.preventDefault()
        event.stopPropagation()
        onSubmit(value.trim())
      }}
      className="flex flex-col gap-4"
    >
      <Field>
        <FieldLabel htmlFor="prompt-input">{label}</FieldLabel>
        <Input
          id="prompt-input"
          autoFocus
          value={value}
          placeholder={placeholder}
          onChange={(event) => setValue(event.target.value)}
        />
      </Field>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </DialogFooter>
    </form>
  )
}

export function TextPromptDialog({
  open,
  onOpenChange,
  title,
  description,
  label,
  initialValue = "",
  placeholder,
  submitLabel = "Kaydet",
  cancelLabel = "Vazgeç",
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  label: string
  initialValue?: string
  placeholder?: string
  submitLabel?: string
  cancelLabel?: string
  onSubmit: (value: string) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <PromptForm
          label={label}
          initialValue={initialValue}
          placeholder={placeholder}
          submitLabel={submitLabel}
          cancelLabel={cancelLabel}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
