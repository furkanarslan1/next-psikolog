import { Skeleton } from "@/components/ui/skeleton"

export function ListSkeleton() {
  return (
    <div
      className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-14 sm:px-8 sm:py-20"
      aria-busy="true"
    >
      <Skeleton className="h-14 w-72" />
      <Skeleton className="h-6 w-96 max-w-full" />
      <div className="flex flex-col gap-10">
        {[0, 1, 2].map((item) => (
          <div key={item} className="flex flex-col gap-3 border-t border-line pt-8">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ArticleSkeleton() {
  return (
    <div
      className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-5 py-12 sm:px-8 sm:py-16"
      aria-busy="true"
    >
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-14 w-full" />
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="mt-6 h-40 w-full" />
    </div>
  )
}
