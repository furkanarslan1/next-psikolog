"use client"

import { XIcon } from "lucide-react"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export function TagInput({
  value,
  onChange,
  id,
}: {
  value: string[]
  onChange: (tags: string[]) => void
  id?: string
}) {
  const [draft, setDraft] = React.useState("")

  function addTag() {
    const tag = draft.trim().replace(/,$/, "").trim()
    setDraft("")
    if (!tag) return
    if (value.some((item) => item.toLowerCase() === tag.toLowerCase())) return
    onChange([...value, tag])
  }

  return (
    <div className="flex flex-col gap-2">
      <Input
        id={id}
        value={draft}
        placeholder="Etiket yazıp Enter'a basın"
        onChange={(event) => setDraft(event.target.value)}
        onBlur={addTag}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === ",") {
            event.preventDefault()
            addTag()
          }
        }}
      />
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <button
                type="button"
                aria-label={`${tag} etiketini kaldır`}
                onClick={() => onChange(value.filter((item) => item !== tag))}
              >
                <XIcon className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
