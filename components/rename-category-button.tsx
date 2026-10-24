"use client"

import { PencilIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"
import { toast } from "sonner"

import { renameCategoryAction } from "@/app/admin/(panel)/categories/actions"
import { TextPromptDialog } from "@/components/text-prompt-dialog"
import { Button } from "@/components/ui/button"

export function RenameCategoryButton({
  id,
  name,
}: {
  id: string
  name: string
}) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  async function rename(value: string) {
    const result = await renameCategoryAction(id, { name: value })
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success("Kategori güncellendi")
    setOpen(false)
    router.refresh()
  }

  return (
    <>
      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        aria-label="Adı değiştir"
        title="Adı değiştir"
        onClick={() => setOpen(true)}
      >
        <PencilIcon />
      </Button>
      <TextPromptDialog
        open={open}
        onOpenChange={setOpen}
        title="Kategori adını değiştir"
        label="Kategori adı"
        initialValue={name}
        onSubmit={rename}
      />
    </>
  )
}
