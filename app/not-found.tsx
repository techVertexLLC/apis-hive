import type { Metadata } from 'next'
import Link from 'next/link'
import { Magnetic } from '@/components/ui/Magnetic'

export const metadata: Metadata = {
  title: '找不到頁面',
  description: '這裡什麼都沒有，但蜂巢裡很熱鬧。',
}

/**
 * 品牌化 404 —— 暖黑底 + 蜂格紋 + 巨大琥珀 404。
 * 在 root layout 內渲染，Navbar 與 Footer 自動共用，維持全站一致收尾。
 */
export default function NotFound() {
  return (
    <main className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden">
      {/* 蜂格紋背景 —— 極克制，緩慢呼吸 */}
      <div
        aria-hidden
        className="hex-field pointer-events-none absolute inset-[-4%] opacity-60"
      />
      {/* 主視覺光暈 */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[42%] h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-honey-500/10 blur-[110px] sm:h-[36rem] sm:w-[36rem]"
      />
      {/* 底部漸層，讓文字浮起 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg-base/40 via-bg-base/10 to-bg-base"
      />

      <div className="relative mx-auto w-full max-w-3xl px-6 py-24 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-honey-500">
          Error 404
        </p>

        {/* 巨大 404 —— Fraunces 琥珀 */}
        <p className="mt-6 font-display text-[7rem] font-semibold leading-none tracking-tight text-honey-500 sm:text-[12rem]">
          404
        </p>

        <h1 className="mt-6 font-display text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
          這裡什麼都沒有，但蜂巢裡很熱鬧。
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-[1.8] text-text-secondary">
          你找的這格蜂房是空的 —— 也許網址打錯了，也許它已經搬走。
          回首頁看看那群從不下班的 AI 員工正在忙什麼。
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Magnetic strength={0.4}>
            <Link
              href="/"
              className="cta-shimmer group inline-flex items-center gap-2 rounded-full bg-honey-500 px-7 py-3 text-sm font-semibold text-bg-base shadow-lg shadow-honey-500/25 transition-all duration-300 hover:bg-honey-400 hover:shadow-xl hover:shadow-honey-500/40 active:scale-[0.98]"
            >
              <span className="relative z-[2]">回到首頁</span>
              <span className="relative z-[2] transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </Magnetic>
          <Magnetic strength={0.3}>
            <Link
              href="/activity"
              className="inline-flex items-center gap-2 rounded-full border border-comb-line bg-bg-raised/40 px-7 py-3 text-sm font-medium text-text-primary backdrop-blur-sm transition-all duration-300 hover:border-honey-500/40 hover:bg-bg-overlay active:scale-[0.98]"
            >
              看即時動態
            </Link>
          </Magnetic>
        </div>
      </div>
    </main>
  )
}
