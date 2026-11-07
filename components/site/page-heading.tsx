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
      {/* küçük amblem yalnızca geniş ekranda */}
      <Rings
        disc="none"
        className="absolute top-1/2 right-0 hidden w-32 -translate-y-1/2 opacity-80 md:block lg:right-4"
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
