import { Rings } from "@/components/site/rings"

export function PageHeading({
  title,
  description,
  as: Heading = "h1",
}: {
  title: string
  description?: string
  as?: "h1" | "h2"
}) {
  return (
    <div className="relative flex min-h-[7.5rem] items-center">
      {/* mobilde başlığın arkasında silik; geniş ekranda küçük bir amblem */}
      <Rings
        disc="none"
        className="absolute top-1/2 -right-16 w-56 -translate-y-1/2 opacity-40 md:right-0 md:w-32 md:opacity-80 lg:right-4"
      />
      <div className="relative flex max-w-3xl flex-col gap-4">
        <Heading className="font-serif-site text-4xl leading-[1.08] font-normal tracking-tight text-balance sm:text-5xl lg:text-6xl">
          {title}
        </Heading>
        {description && (
          <p className="text-lg leading-relaxed text-ink-soft sm:text-xl">{description}</p>
        )}
      </div>
    </div>
  )
}
