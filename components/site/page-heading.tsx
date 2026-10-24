export function PageHeading({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="flex max-w-3xl flex-col gap-4">
      <h1 className="font-serif-site text-5xl leading-[1.05] font-normal tracking-tight text-balance sm:text-6xl">
        {title}
      </h1>
      {description && (
        <p className="text-lg leading-relaxed text-ink-soft">{description}</p>
      )}
    </div>
  )
}
