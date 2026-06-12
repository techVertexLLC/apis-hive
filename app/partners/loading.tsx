import { Skeleton } from '@/components/ui/Skeleton'

// 對齊 partners/page.tsx：頁首 + 好處三卡 + 夥伴雙卡。
export default function PartnersLoading() {
  return (
    <main className="relative">
      {/* 頁首 */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(245,166,35,0.12),transparent)]" />
        <div className="relative mx-auto w-full max-w-4xl px-6 pb-12 pt-24">
          <Skeleton className="h-3 w-40" />
          <div className="mt-5 space-y-3">
            <Skeleton className="h-10 w-4/5 sm:h-12" />
            <Skeleton className="h-10 w-3/5 sm:h-12" />
          </div>
          <div className="mt-7 max-w-3xl space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </section>

      {/* 好處三卡 */}
      <section className="relative border-t border-comb-line py-24">
        <div className="mx-auto w-full max-w-6xl px-6">
          <Skeleton className="h-8 w-72 sm:h-9" />
          <Skeleton className="mt-4 h-4 w-96 max-w-full" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col rounded-2xl border border-comb-line bg-bg-raised p-7"
              >
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="mt-5 h-5 w-32" />
                <div className="mt-3 space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 夥伴雙卡 */}
      <section className="relative border-t border-comb-line py-24">
        <div className="mx-auto w-full max-w-6xl px-6">
          <Skeleton className="h-8 w-64 sm:h-9" />
          <Skeleton className="mt-4 h-4 w-80 max-w-full" />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col rounded-2xl border border-comb-line bg-bg-raised p-8"
              >
                <Skeleton className="h-3 w-24" />
                <Skeleton className="mt-4 h-7 w-3/4" />
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-11/12" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
                <div className="mt-6 space-y-2.5">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <Skeleton key={j} className="h-3 w-2/3" />
                  ))}
                </div>
                <Skeleton className="mt-7 h-11 w-36 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
