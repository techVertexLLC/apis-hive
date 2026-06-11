'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  AnimatePresence,
  motion,
  useAnimate,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
} from 'framer-motion'
import { EASE } from '@/lib/motion'
import { Reveal } from '@/components/ui/Reveal'
import { Magnetic } from '@/components/ui/Magnetic'
import { BlinkCursor } from '@/components/ui/BlinkCursor'
import {
  ACTIVE,
  CATEGORY_META,
  DOT,
  FILTERS,
  createActivityFactory,
  type ActivityCategory,
  type ActivityEntry,
} from '@/lib/activity'

const MAX_ROWS = 18 // 完整頁最多保留的活動數
const SEED_ROWS = 16 // 初次載入先鋪墊的數量
const TODAY_BASE = 1843 // 「今日已處理」起算基數

// 「今日已處理 X 筆」計數器 —— spring count-up，每次 +1 時數字帶彈跳。
function TaskCounter({ value }: { value: number }) {
  const reduce = useReducedMotion()
  const spring = useSpring(0, { stiffness: 90, damping: 14, mass: 0.8 })
  const [display, setDisplay] = useState(0)
  const [scope, animate] = useAnimate()
  const firstRun = useRef(true)

  useMotionValueEvent(spring, 'change', (v) => setDisplay(Math.round(v)))
  useEffect(() => {
    spring.set(value)
  }, [value, spring])

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    if (reduce || !scope.current) return
    animate(scope.current, { scale: [1.28, 1] }, { duration: 0.45, ease: EASE })
  }, [value, reduce, animate, scope])

  return (
    <span
      ref={scope}
      className="inline-block origin-left font-display text-3xl font-semibold tabular-nums text-honey-400 sm:text-4xl"
    >
      {display.toLocaleString('en-US')}
    </span>
  )
}

interface StatCardProps {
  label: string
  children: React.ReactNode
  hint: string
}

function StatCard({ label, children, hint }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-comb-line bg-bg-raised p-6 transition-colors duration-300 hover:border-honey-500/40">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-text-muted">
        {label}
      </p>
      <div className="mt-3">{children}</div>
      <p className="mt-2 text-xs text-text-muted">{hint}</p>
    </div>
  )
}

export function ActivityStream() {
  const [entries, setEntries] = useState<ActivityEntry[]>([])
  const [count, setCount] = useState(TODAY_BASE)
  const [filter, setFilter] = useState<ActivityCategory>('all')
  const makeEntryRef = useRef(createActivityFactory())

  useEffect(() => {
    const makeEntry = makeEntryRef.current
    const now = Date.now()
    const seeded: ActivityEntry[] = []
    for (let i = 0; i < SEED_ROWS; i++) {
      seeded.push(makeEntry(new Date(now - i * (2600 + Math.random() * 3600))))
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntries(seeded)

    let timer: ReturnType<typeof setTimeout>
    let cancelled = false
    const schedule = () => {
      const delay = 1800 + Math.random() * 2800
      timer = setTimeout(() => {
        if (cancelled) return
        const entry = makeEntry(new Date())
        setEntries((prev) => [entry, ...prev].slice(0, MAX_ROWS))
        setCount((c) => c + 1)
        schedule()
      }, delay)
    }
    schedule()

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [])

  const visible =
    filter === 'all'
      ? entries
      : entries.filter((e) => e.category === filter)

  return (
    <div className="mx-auto w-full max-w-5xl px-6">
      {/* 統計面板 */}
      <Reveal className="grid gap-4 sm:grid-cols-3" delay={0.05}>
        <StatCard label="今日已處理" hint="任務數即時累計">
          <TaskCounter value={count} />
          <span className="ml-1.5 text-sm text-text-secondary">筆</span>
        </StatCard>
        <StatCard label="活躍員工" hint="正在跑任務的 AI 員工">
          <span className="font-display text-3xl font-semibold text-honey-400 sm:text-4xl">
            {ACTIVE.length}
          </span>
          <span className="ml-1.5 text-sm text-text-secondary">位在線</span>
        </StatCard>
        <StatCard label="平均回應時間" hint="近一小時任務啟動延遲">
          <span className="font-display text-3xl font-semibold text-honey-400 sm:text-4xl">
            1.4
          </span>
          <span className="ml-1.5 text-sm text-text-secondary">秒</span>
        </StatCard>
      </Reveal>

      {/* 篩選器 */}
      <Reveal className="mt-10 flex flex-wrap items-center gap-2.5" delay={0.1}>
        {FILTERS.map((f) => {
          const active = filter === f.key
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              aria-pressed={active}
              className={`inline-flex items-center rounded-full border px-4 py-1.5 font-mono text-xs transition-all duration-300 active:scale-[0.97] ${
                active
                  ? 'border-honey-500/60 bg-honey-500/15 text-honey-400'
                  : 'border-comb-line bg-bg-base text-text-secondary hover:border-honey-500/40 hover:text-text-primary'
              }`}
            >
              {f.label}
            </button>
          )
        })}
      </Reveal>

      {/* 終端機風格的即時活動流 */}
      <Reveal
        className="mt-6 overflow-hidden rounded-2xl border border-comb-line bg-bg-raised/60"
        delay={0.12}
      >
        <div className="flex items-center justify-between border-b border-comb-line/60 px-5 py-3 font-mono text-xs text-text-muted">
          <span>hive://activity-stream</span>
          <span className="flex items-center gap-2">
            <span className="hive-breathe inline-block h-1.5 w-1.5 rounded-full bg-status-live" />
            <span className="inline-flex items-center">
              串流中
              <BlinkCursor className="text-status-live" />
            </span>
          </span>
        </div>

        <div className="relative min-h-[12rem]">
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((entry, i) => (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, y: -18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.4, ease: EASE } }}
                transition={{ duration: 0.5, ease: EASE }}
                className="group relative overflow-hidden border-b border-comb-line/50 px-4 py-3.5 font-mono text-[13px] transition-colors duration-300 last:border-b-0 hover:bg-honey-500/[0.045] sm:px-5 sm:text-sm"
              >
                <motion.span
                  aria-hidden
                  className={`absolute left-0 top-0 h-full w-[3px] origin-left ${DOT[entry.stage]}`}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.05 }}
                />
                <div className="flex items-start gap-3 transition-transform duration-300 group-hover:translate-x-1 sm:gap-4">
                  <span className="shrink-0 pt-px tabular-nums text-text-muted">
                    {entry.time}
                  </span>
                  <span
                    className={`mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full ${DOT[entry.stage]} ${
                      i === 0 ? 'hive-breathe' : ''
                    }`}
                  />
                  <span className="flex-1 leading-[1.8] text-text-secondary">
                    <span className="font-semibold text-honey-400">
                      [{entry.name}·{entry.abbr}]
                    </span>{' '}
                    {entry.message}
                    <span className="ml-2 rounded border border-comb-line px-1.5 py-0.5 text-[10px] text-text-muted">
                      {CATEGORY_META[entry.category].label}
                    </span>
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {visible.length === 0 && (
            <p className="px-5 py-12 text-center font-mono text-sm text-text-muted">
              此分類暫無最新活動，稍候會有新任務滾入…
            </p>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-comb-line/60 px-5 py-3.5 font-mono text-xs text-text-muted">
          <span>
            今日已處理 <span className="tabular-nums text-honey-400">{count.toLocaleString('en-US')}</span> 筆任務
          </span>
          <span>{ACTIVE.length} 位員工在線</span>
        </div>
      </Reveal>

      {/* 交叉導航：認識這些員工 */}
      <Reveal className="mt-12 flex justify-center" delay={0.1}>
        <Magnetic strength={0.3}>
          <Link
            href="/team"
            className="group inline-flex items-center gap-2 rounded-full border border-comb-line bg-bg-raised/40 px-6 py-3 text-sm font-medium text-text-primary transition-all duration-300 hover:border-honey-500/40 hover:bg-bg-overlay active:scale-[0.98]"
          >
            認識正在做事的員工
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </Magnetic>
      </Reveal>
    </div>
  )
}
