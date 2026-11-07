"use client"

import Placeholder from "@tiptap/extension-placeholder"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import {
  BoldIcon,
  Heading2Icon,
  Heading3Icon,
  ItalicIcon,
  Link2Icon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  Redo2Icon,
  Undo2Icon,
} from "lucide-react"
import * as React from "react"

import { TextPromptDialog } from "@/components/text-prompt-dialog"
import { Button } from "@/components/ui/button"

export function RichTextEditor({
  value,
  onChange,
  invalid,
}: {
  value: string
  onChange: (html: string) => void
  invalid?: boolean
}) {
  const [dialog, setDialog] = React.useState<{ initial: string } | null>(null)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false },
      }),
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

  function applyLink(url: string) {
    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }
    const href = /^(https?:\/\/|mailto:)/i.test(url) ? url : `https://${url}`
    editor?.chain().focus().extendMarkRange("link").setLink({ href }).run()
  }

  const tools = [
    { label: "Kalın", icon: BoldIcon, active: editor.isActive("bold"), run: () => editor.chain().focus().toggleBold().run() },
    { label: "İtalik", icon: ItalicIcon, active: editor.isActive("italic"), run: () => editor.chain().focus().toggleItalic().run() },
    { label: "Başlık 2", icon: Heading2Icon, active: editor.isActive("heading", { level: 2 }), run: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: "Başlık 3", icon: Heading3Icon, active: editor.isActive("heading", { level: 3 }), run: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
    { label: "Madde listesi", icon: ListIcon, active: editor.isActive("bulletList"), run: () => editor.chain().focus().toggleBulletList().run() },
    { label: "Numaralı liste", icon: ListOrderedIcon, active: editor.isActive("orderedList"), run: () => editor.chain().focus().toggleOrderedList().run() },
    { label: "Alıntı", icon: QuoteIcon, active: editor.isActive("blockquote"), run: () => editor.chain().focus().toggleBlockquote().run() },
    { label: "Bağlantı", icon: Link2Icon, active: editor.isActive("link"), run: () => setDialog({ initial: (editor.getAttributes("link").href as string | undefined) ?? "" }) },
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
      </div>
      <EditorContent editor={editor} />
      <TextPromptDialog
        open={dialog !== null}
        onOpenChange={(open) => {
          if (!open) setDialog(null)
        }}
        title="Bağlantı ekle"
        description="Seçili metne bağlantı verilir. Bağlantıyı kaldırmak için alanı boş bırakıp kaydedin."
        label="Bağlantı adresi"
        placeholder="https://ornek.com"
        initialValue={dialog?.initial ?? ""}
        onSubmit={(value) => {
          applyLink(value)
          setDialog(null)
        }}
      />
    </div>
  )
}
