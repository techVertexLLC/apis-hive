import { Skeleton } from '@/components/ui/Skeleton'

// 對齊 activity/page.tsx：頁首 + 統計卡 + 篩選器 + 終端機串流。
export default function ActivityLoading() {
  return (
    <main className="relative">
      {/* 頁首 */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(245,166,35,0.12),transparent)]" />
        <div className="relative mx-auto w-full max-w-5xl px-6 pb-12 pt-24">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="mt-5 h-10 w-3/4 max-w-md sm:h-12" />
          <div className="mt-6 max-w-2xl space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </section>

      {/* 統計 + 篩選 + 串流 */}
      <section className="pb-28">
        <div className="mx-auto w-full max-w-5xl px-6">
          {/* 統計卡 */}
          <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-comb-line bg-bg-raised p-6"
              >
                <Skeleton className="h-3 w-24" />
                <Skeleton className="mt-4 h-9 w-20" />
                <Skeleton className="mt-3 h-3 w-28" />
              </div>
            ))}
          </div>

          {/* 篩選器 */}
          <div className="mt-10 flex flex-wrap gap-2.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full" />
            ))}
          </div>

          {/* 終端機串流 */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-comb-line bg-bg-raised/60">
            <div className="flex items-center justify-between border-b border-comb-line/60 px-5 py-3">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div>
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 border-b border-comb-line/50 px-4 py-3.5 last:border-b-0 sm:px-5"
                >
                  <Skeleton className="h-3 w-12 shrink-0" />
                  <Skeleton variant="circle" className="mt-1 h-1.5 w-1.5 shrink-0" />
                  <Skeleton
                    className="h-3 flex-1"
                    style={{ maxWidth: `${88 - (i % 4) * 12}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-comb-line/60 px-5 py-3.5">
              <Skeleton className="h-3 w-44" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
