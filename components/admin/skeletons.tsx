import { Skeleton } from "@/components/ui/skeleton"

export function TableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-2" aria-busy="true">
      <Skeleton className="h-9 w-full" />
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} className="h-12 w-full" />
      ))}
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]" aria-busy="true">
      <Skeleton className="h-96 w-full" />
      <div className="flex flex-col gap-6">
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  )
}
