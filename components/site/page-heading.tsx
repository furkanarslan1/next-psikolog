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
    <div className="flex max-w-3xl flex-col gap-4">
      <Heading className="font-serif-site text-5xl leading-[1.05] font-normal tracking-tight text-balance sm:text-6xl">
        {title}
      </Heading>
      {description && (
        <p className="text-lg leading-relaxed text-ink-soft">{description}</p>
      )}
    </div>
  )
}
