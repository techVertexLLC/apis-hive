import { Skeleton } from '@/components/ui/Skeleton'

// 對齊 team/page.tsx：頁首 + 狀態圖例 + 員工卡片 grid。
function CardSkeleton() {
  return (
    <li className="flex flex-col rounded-2xl border border-comb-line bg-bg-raised p-6">
      <div className="flex items-start gap-3">
        <Skeleton variant="circle" className="h-11 w-11 shrink-0" />
        <div className="min-w-0 flex-1">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-2 h-3 w-20" />
        </div>
        <Skeleton className="h-5 w-14 shrink-0 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-3 w-32" />
      <Skeleton className="mt-4 h-3 w-full" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-16 rounded-md" />
        ))}
      </div>
    </li>
  )
}

export default function TeamLoading() {
  return (
    <main className="relative">
      <section className="mx-auto w-full max-w-6xl px-6 py-24">
        {/* 頁首 */}
        <Skeleton className="h-3 w-28" />
        <Skeleton className="mt-5 h-10 w-72 sm:h-12" />
        <div className="mt-6 max-w-2xl space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        {/* 狀態圖例 */}
        <div className="mt-7 flex flex-wrap gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-24" />
          ))}
        </div>

        {/* 分組 + 卡片 grid */}
        <div className="mt-16 flex flex-col gap-16">
          {Array.from({ length: 2 }).map((_, g) => (
            <div key={g}>
              <Skeleton className="h-7 w-40" />
              <Skeleton className="mt-3 h-3 w-64" />
              <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: g === 0 ? 6 : 3 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
