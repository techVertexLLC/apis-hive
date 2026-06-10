import type { Metadata } from 'next'
import Link from 'next/link'
import { fadeUp } from '@/lib/motion'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { TiltCard } from '@/components/ui/TiltCard'
import { Magnetic } from '@/components/ui/Magnetic'
import { BlinkCursor } from '@/components/ui/BlinkCursor'
import { EMPLOYEES, STAGE_META, type Stage, type Employee } from '@/lib/employees'

export const metadata: Metadata = {
  title: 'AI 員工團隊',
  description:
    '認識蜂巢裡的每一位 AI 員工 — 從營運、產品、工程到分銷業務，各司其職。我們坦誠標示每位的成熟度：上線、測試，或還在孵化。',
  alternates: { canonical: '/team' },
  openGraph: {
    title: 'AI 員工團隊 — Apis Hive',
    description:
      '認識蜂巢裡的每一位 AI 員工 — 從營運、產品、工程到分銷業務，各司其職。',
    url: '/team',
  },
}

// 顯示順序：上線 → 測試 → 孵化
const STAGE_ORDER: Stage[] = ['live', 'beta', 'incubating']

const GROUP_INTRO: Record<Stage, string> = {
  live: '已穩定運作、每天都在跑任務的員工。',
  beta: '正在驗證流程、逐步交付真實成果的員工。',
  incubating: '規格已定、仍在打磨上線前最後一哩路的員工。',
}

function EmployeeCard({ emp }: { emp: Employee }) {
  const meta = STAGE_META[emp.stage]
  return (
    <RevealItem
      as="li"
      className="flex flex-col rounded-2xl border border-comb-line bg-bg-raised p-6 transition-all duration-300 hover:-translate-y-1 hover:border-honey-500/40 hover:bg-bg-overlay hover:shadow-xl hover:shadow-honey-500/10"
    >
      {/* 標頭：縮寫徽章 + 名字 / 角色 + 狀態標籤 */}
      <div className="flex items-start gap-3">
        <span
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold tracking-wider"
          style={{ color: meta.color, backgroundColor: `${meta.color}1f` }}
        >
          {emp.abbr}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-semibold leading-tight text-text-primary">
            {emp.name}
          </h3>
          <p className="mt-0.5 text-sm text-text-secondary">{emp.role}</p>
        </div>
        <span
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px]"
          style={{ color: meta.color, backgroundColor: `${meta.color}1f` }}
        >
          <span
            className={`inline-block h-1.5 w-1.5 rounded-full ${emp.stage === 'live' ? 'hive-breathe' : ''}`}
            style={{ backgroundColor: meta.color }}
          />
          {meta.dotLabel}
        </span>
      </div>

      {/* 團隊 · 導入階段 */}
      <p className="mt-4 font-mono text-[11px] text-honey-400">
        {emp.department} · {emp.phase}
      </p>

      {/* 個性一句話 */}
      <p className="mt-3 text-sm italic leading-[1.8] text-text-secondary">
        「{emp.personality}」
      </p>

      {/* 詳細 bio */}
      <p className="mt-3 text-sm leading-[1.8] text-text-secondary">{emp.bio}</p>

      {/* 技能標籤 */}
      <ul className="mt-5 flex flex-wrap gap-2">
        {emp.focus.map((f) => (
          <li
            key={f}
            className="rounded-md border border-comb-line px-2.5 py-1 font-mono text-[11px] text-text-muted"
          >
            {f}
          </li>
        ))}
      </ul>
    </RevealItem>
  )
}

export default function TeamPage() {
  return (
    <main className="relative">
      <section className="mx-auto w-full max-w-6xl px-6 py-24">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-honey-500">
            Meet the Hive
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
            AI 員工團隊
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-[1.8] text-text-secondary">
            {EMPLOYEES.length} 位 AI
            員工組成這座蜂巢。每一位各司其職，從不下班。我們依成熟度坦誠分組 —
            正在運作、測試中，或仍在孵化。
          </p>
        </Reveal>

        {/* 狀態圖例 */}
        <Reveal className="mt-7 flex flex-wrap gap-x-5 gap-y-2" delay={0.1}>
          {STAGE_ORDER.map((stage) => {
            const meta = STAGE_META[stage]
            return (
              <span
                key={stage}
                className="inline-flex items-center gap-2 font-mono text-xs text-text-muted"
              >
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: meta.color }}
                />
                {meta.dotLabel} · {meta.label}
              </span>
            )
          })}
        </Reveal>

        {/* 按狀態分組 */}
        <div className="mt-16 flex flex-col gap-16">
          {STAGE_ORDER.map((stage) => {
            const group = EMPLOYEES.filter((e) => e.stage === stage)
            if (group.length === 0) return null
            const meta = STAGE_META[stage]
            return (
              <div key={stage}>
                <Reveal>
                  <div className="flex items-baseline gap-3">
                    <h2 className="font-display text-2xl font-semibold tracking-tight text-text-primary">
                      {meta.label}
                    </h2>
                    <span className="font-mono text-sm text-text-muted">
                      {meta.dotLabel} · {group.length} 位
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-[1.8] text-text-secondary">
                    {GROUP_INTRO[stage]}
                  </p>
                </Reveal>

                <RevealGroup
                  as="ul"
                  className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {group.map((emp) => (
                    <EmployeeCard key={emp.id} emp={emp} />
                  ))}
                </RevealGroup>
              </div>
            )
          })}
        </div>

        {/* 收尾交叉導航：看他們即時運作 / 讀懂背後的理念，避免頁面變成死路 */}
        <Reveal className="mt-20 rounded-2xl border border-comb-line bg-bg-raised/50 px-6 py-10 text-center sm:mt-24 sm:px-10 sm:py-12">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
            想看他們真的在做事？
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-[1.8] text-text-secondary">
            名冊是靜態的，蜂巢是活的。回首頁看即時動態流，或讀懂這套組織背後的設計理念。
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/#live"
              className="group inline-flex items-center gap-2 rounded-full bg-honey-500 px-6 py-3 text-sm font-semibold text-bg-base shadow-lg shadow-honey-500/20 transition-all duration-300 hover:scale-[1.03] hover:bg-honey-400 hover:shadow-honey-500/40 active:scale-[0.98]"
            >
              看即時動態
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-comb-line px-6 py-3 text-sm font-medium text-text-primary transition-all duration-300 hover:scale-[1.03] hover:border-honey-500/40 hover:bg-bg-overlay active:scale-[0.98]"
            >
              了解我們的理念
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  )
}
