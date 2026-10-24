"use client"

import * as React from "react"
import { toast } from "sonner"

import { cleanupMediaAction } from "@/app/admin/(panel)/dashboard/actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function CleanupMediaCard() {
  const [open, setOpen] = React.useState(false)
  const [pending, setPending] = React.useState(false)

  async function cleanup() {
    setPending(true)
    const result = await cleanupMediaAction()
    setPending(false)
    setOpen(false)
    if (result.error) toast.error(result.error)
    else toast.success(`${result.deleted} kullanılmayan görsel silindi`)
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Kullanılmayan görseller</CardTitle>
        <CardDescription>
          Yüklenip hiçbir yazıya kaydedilmemiş görseller depolamada yer kaplar.
          Taslaklardaki görseller silinmez.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button type="button" variant="outline" onClick={() => setOpen(true)}>
          Kullanılmayanları temizle
        </Button>
      </CardContent>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kullanılmayan görseller silinsin mi?</AlertDialogTitle>
            <AlertDialogDescription>
              Hiçbir yazıda (taslaklar dahil) geçmeyen ve 24 saatten eski görseller
              kalıcı olarak silinir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Vazgeç</AlertDialogCancel>
            <AlertDialogAction variant="destructive" disabled={pending} onClick={cleanup}>
              {pending ? "Siliniyor..." : "Temizle"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
