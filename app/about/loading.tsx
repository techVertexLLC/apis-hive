import { Skeleton } from '@/components/ui/Skeleton'

// 對齊 about/page.tsx：頁首段落 + 蜂箱模型列表 + 三大堅持。
export default function AboutLoading() {
  return (
    <main className="relative">
      {/* 頁首 */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(245,166,35,0.12),transparent)]" />
        <div className="relative mx-auto w-full max-w-4xl px-6 py-24">
          <Skeleton className="h-3 w-28" />
          <div className="mt-5 space-y-3">
            <Skeleton className="h-10 w-4/5 sm:h-12" />
            <Skeleton className="h-10 w-1/2 sm:h-12" />
          </div>
          <div className="mt-7 max-w-3xl space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </section>

      {/* 蜂箱模型列表 */}
      <section className="relative border-t border-comb-line py-24">
        <div className="mx-auto w-full max-w-5xl px-6">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="mt-4 h-8 w-48 sm:h-9" />
          <Skeleton className="mt-4 h-4 w-2/3" />

          <div className="mt-12 flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-1 gap-2 rounded-2xl border border-comb-line bg-bg-raised p-6 sm:grid-cols-[220px_1fr] sm:gap-6"
              >
                <div>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="mt-2 h-3 w-16" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </div>
            ))}
          </div>

          {/* 三大堅持 */}
          <Skeleton className="mt-16 h-7 w-32" />
          <Skeleton className="mt-3 h-4 w-1/2" />
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-comb-line border-t-2 border-t-honey-500/40 bg-bg-raised p-6"
              >
                <Skeleton className="h-5 w-24" />
                <div className="mt-3 space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
