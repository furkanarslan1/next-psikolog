"use client"

import { Trash2Icon } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function DeleteButton({
  label,
  description,
  onDelete,
}: {
  label: string
  description: string
  onDelete: () => Promise<{ error?: string } | void>
}) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [pending, setPending] = React.useState(false)

  async function confirm() {
    setPending(true)
    try {
      const result = await onDelete()
      if (result?.error) {
        toast.error(result.error)
        setOpen(false)
        return
      }
      toast.success("Silindi")
      setOpen(false)
      router.refresh()
    } catch {
      toast.error("Silinemedi")
    } finally {
      setPending(false)
    }
  }

  return (
    <>
      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        aria-label={label}
        title={label}
        onClick={() => setOpen(true)}
      >
        <Trash2Icon />
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Vazgeç</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={pending}
              onClick={confirm}
            >
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
