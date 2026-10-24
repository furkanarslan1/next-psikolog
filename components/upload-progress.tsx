export function UploadProgress({ percent }: { percent: number }) {
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-label="Görsel yükleniyor"
      className="flex items-center gap-3 text-sm text-muted-foreground"
    >
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-200"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="w-20 shrink-0 text-right tabular-nums">
        {percent === 0 ? "Hazırlanıyor" : `%${percent}`}
      </span>
    </div>
  )
}
