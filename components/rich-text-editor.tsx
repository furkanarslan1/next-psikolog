"use client"

import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import {
  BoldIcon,
  Heading2Icon,
  Heading3Icon,
  ImageIcon,
  ItalicIcon,
  Link2Icon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  Redo2Icon,
  TypeIcon,
  Undo2Icon,
} from "lucide-react"
import * as React from "react"
import { toast } from "sonner"

import { TextPromptDialog } from "@/components/text-prompt-dialog"
import { Button } from "@/components/ui/button"
import { UploadProgress } from "@/components/upload-progress"
import { uploadImage, type UploadedImage } from "@/lib/upload-image"

const IMAGE_INPUT_ID = "rich-text-editor-image"

export function RichTextEditor({
  value,
  onChange,
  invalid,
}: {
  value: string
  onChange: (html: string) => void
  invalid?: boolean
}) {
  type Dialog =
    | { kind: "link"; initial: string }
    | { kind: "alt"; initial: string }
    | { kind: "new-image"; image: UploadedImage }
  const [dialog, setDialog] = React.useState<Dialog | null>(null)
  const [progress, setProgress] = React.useState<number | null>(null)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false },
      }),
      Image,
      Placeholder.configure({ placeholder: "Yazınızı buraya yazın..." }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "rich-content min-h-72 px-3 py-2 outline-none",
      },
    },
  })

  if (!editor) return null

  async function handleImage(file: File | undefined) {
    if (!file) return
    try {
      setProgress(0)
      const image = await uploadImage(file, setProgress)
      setDialog({ kind: "new-image", image })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Görsel yüklenemedi")
    } finally {
      setProgress(null)
    }
  }

  function insertImage(image: UploadedImage, alt: string) {
    editor
      ?.chain()
      .focus()
      .setImage({ src: image.url, alt, width: image.width, height: image.height })
      .run()
  }

  function applyLink(url: string) {
    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }
    const href = /^(https?:\/\/|mailto:)/i.test(url) ? url : `https://${url}`
    editor?.chain().focus().extendMarkRange("link").setLink({ href }).run()
  }

  function closeDialog(open: boolean) {
    if (open) return
    // alt metin girilmeden kapatılan yeni görsel yine de eklenir
    if (dialog?.kind === "new-image") {
      insertImage(dialog.image, "")
    }
    setDialog(null)
  }

  const tools = [
    { label: "Kalın", icon: BoldIcon, active: editor.isActive("bold"), run: () => editor.chain().focus().toggleBold().run() },
    { label: "İtalik", icon: ItalicIcon, active: editor.isActive("italic"), run: () => editor.chain().focus().toggleItalic().run() },
    { label: "Başlık 2", icon: Heading2Icon, active: editor.isActive("heading", { level: 2 }), run: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: "Başlık 3", icon: Heading3Icon, active: editor.isActive("heading", { level: 3 }), run: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
    { label: "Madde listesi", icon: ListIcon, active: editor.isActive("bulletList"), run: () => editor.chain().focus().toggleBulletList().run() },
    { label: "Numaralı liste", icon: ListOrderedIcon, active: editor.isActive("orderedList"), run: () => editor.chain().focus().toggleOrderedList().run() },
    { label: "Alıntı", icon: QuoteIcon, active: editor.isActive("blockquote"), run: () => editor.chain().focus().toggleBlockquote().run() },
    { label: "Bağlantı", icon: Link2Icon, active: editor.isActive("link"), run: () => setDialog({ kind: "link", initial: (editor.getAttributes("link").href as string | undefined) ?? "" }) },
    { label: "Görsel", icon: ImageIcon, active: false, run: () => document.getElementById(IMAGE_INPUT_ID)?.click() },
    { label: "Görsel alt metni (görsel seçiliyken)", icon: TypeIcon, active: editor.isActive("image"), run: () => setDialog({ kind: "alt", initial: (editor.getAttributes("image").alt as string | undefined) ?? "" }) },
    { label: "Geri al", icon: Undo2Icon, active: false, run: () => editor.chain().focus().undo().run() },
    { label: "Yinele", icon: Redo2Icon, active: false, run: () => editor.chain().focus().redo().run() },
  ]

  return (
    <div
      className="rounded-lg border border-input data-[invalid=true]:border-destructive"
      data-invalid={invalid}
    >
      <div className="flex flex-wrap gap-1 border-b p-1">
        {tools.map(({ label, icon: Icon, active, run }) => (
          <Button
            key={label}
            type="button"
            size="icon-sm"
            variant={active ? "secondary" : "ghost"}
            aria-label={label}
            title={label}
            onClick={run}
          >
            <Icon />
          </Button>
        ))}
        <input
          id={IMAGE_INPUT_ID}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(event) => {
            void handleImage(event.target.files?.[0])
            event.target.value = ""
          }}
        />
      </div>
      {progress !== null && (
        <div className="border-b px-3 py-2">
          <UploadProgress percent={progress} />
        </div>
      )}
      <EditorContent editor={editor} />
      <TextPromptDialog
        open={dialog?.kind === "link"}
        onOpenChange={closeDialog}
        title="Bağlantı ekle"
        description="Seçili metne bağlantı verilir. Bağlantıyı kaldırmak için alanı boş bırakıp kaydedin."
        label="Bağlantı adresi"
        placeholder="https://ornek.com"
        initialValue={dialog?.kind === "link" ? dialog.initial : ""}
        onSubmit={(value) => {
          applyLink(value)
          setDialog(null)
        }}
      />
      <TextPromptDialog
        open={dialog?.kind === "alt" || dialog?.kind === "new-image"}
        onOpenChange={closeDialog}
        title="Görsel açıklaması"
        description="Görseli kısaca tanımlayın. Arama motorları ve ekran okuyucular bunu kullanır."
        label="Alt metin"
        placeholder="Örn. Danışan ve terapist görüşme yapıyor"
        initialValue={dialog?.kind === "alt" ? dialog.initial : ""}
        cancelLabel={dialog?.kind === "new-image" ? "Atla" : "Vazgeç"}
        onSubmit={(value) => {
          if (dialog?.kind === "new-image") {
            insertImage(dialog.image, value)
          } else {
            editor.chain().focus().updateAttributes("image", { alt: value }).run()
          }
          setDialog(null)
        }}
      />
    </div>
  )
}
