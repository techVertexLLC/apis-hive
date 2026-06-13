import type { Metadata } from 'next'
import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'
import { ActivityStream } from '@/components/activity/ActivityStream'
import { ProjectStats } from '@/components/activity/ProjectStats'

export const metadata: Metadata = {
  title: '即時動態',
  description:
    '蜂巢的即時營運流 — 以真實任務為藍本的模擬動態，展示 AI 員工們日常處理的工作類型與節奏。',
  alternates: { canonical: '/activity' },
  openGraph: {
    title: '即時動態 — Apis Hive',
    description:
      '蜂巢的即時營運流 — 以真實任務為藍本的模擬動態，持續滾動。',
    url: '/activity',
  },
}

export default function ActivityPage() {
  return (
    <main className="relative">
      {/* 頁首 */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(245,166,35,0.12),transparent)]" />
        <div className="relative mx-auto w-full max-w-5xl px-6 pb-12 pt-24">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-honey-500">
                Live Activity
              </p>
              <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
                不是宣稱，是證據。
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-[1.8] text-text-secondary">
                這是蜂巢的即時營運流。每一行都是以真實任務為藍本的模擬動態 —
                展示 AI 員工們日常處理的工作類型與節奏。
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <Link
                href="/dashboard"
                className="cta-shimmer group inline-flex shrink-0 items-center gap-2 rounded-full bg-honey-500 px-6 py-3 text-sm font-semibold text-bg-base shadow-lg shadow-honey-500/25 transition-all duration-300 hover:bg-honey-400 hover:shadow-xl hover:shadow-honey-500/40 active:scale-[0.98]"
              >
                <span className="relative z-[2]">進入控制台</span>
                <span className="relative z-[2] transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 算力帳本（真實 token/成本） */}
      <ProjectStats />

      {/* 統計 + 篩選 + 串流 */}
      <section className="pb-28">
        <ActivityStream />
      </section>
    </main>
  )
}
