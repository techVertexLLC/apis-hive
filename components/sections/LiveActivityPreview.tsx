'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE, fadeUp } from '@/lib/motion'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { BlinkCursor } from '@/components/ui/BlinkCursor'
import {
  ACTIVE,
  DOT,
  createActivityFactory,
  type ActivityEntry,
} from '@/lib/activity'

const MAX_ROWS = 4 // 首頁精簡版只顯示最新 4 條
const SEED_ROWS = 4

/** 首頁精簡版即時動態 —— 只露出最新幾條，完整版在 /activity。 */
export function LiveActivityPreview() {
  const [entries, setEntries] = useState<ActivityEntry[]>([])
  const makeEntryRef = useRef(createActivityFactory())

  useEffect(() => {
    const makeEntry = makeEntryRef.current
    const now = Date.now()
    const seeded: ActivityEntry[] = []
    for (let i = 0; i < SEED_ROWS; i++) {
      seeded.push(makeEntry(new Date(now - i * (4000 + Math.random() * 4000))))
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntries(seeded)

    let timer: ReturnType<typeof setTimeout>
    let cancelled = false
    const schedule = () => {
      const delay = 2600 + Math.random() * 3200
      timer = setTimeout(() => {
        if (cancelled) return
        const entry = makeEntry(new Date())
        setEntries((prev) => [entry, ...prev].slice(0, MAX_ROWS))
        schedule()
      }, delay)
    }
    schedule()

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [])

  return (
    // whileInView：捲動進入視窗 10% 才觸發，once 避免重複播放
    <motion.section
      id="live"
      className="relative border-t border-comb-line py-28"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
    >
      <div className="mx-auto w-full max-w-5xl px-6">
        <motion.div variants={fadeUp}>
          <SectionHeading
            eyebrow="Live Activity"
            title="不是宣稱，是證據。"
            description={
              <>
                這是蜂巢即時營運流的一隅。每一行都是以真實任務為藍本的模擬動態 —
                展示 AI 員工們日常處理的工作類型與節奏。
              </>
            }
          />
        </motion.div>

        {/* 終端機風格的即時活動流（精簡） */}
        <Reveal
          className="mt-8 overflow-hidden rounded-2xl border border-comb-line bg-bg-raised/60"
          delay={0.1}
        >
          {/* Terminal header：加入 macOS 風格圓點讓終端機感更到位 */}
          <div className="flex items-center justify-between border-b border-comb-line/60 px-5 py-3 font-mono text-xs text-text-muted">
            <div className="flex items-center gap-3">
              {/* mock 視窗圓點：紅/黃/綠，純裝飾 */}
              <div className="flex items-center gap-1.5" aria-hidden>
                <span className="inline-block h-3 w-3 rounded-full bg-red-500/60" />
                <span className="inline-block h-3 w-3 rounded-full bg-yellow-500/60" />
                <span className="inline-block h-3 w-3 rounded-full bg-green-500/60" />
              </div>
              <span className="text-text-muted/70">hive://activity-stream</span>
            </div>
            <span className="flex items-center gap-2">
              <span className="hive-breathe inline-block h-1.5 w-1.5 rounded-full bg-status-live" />
              <span className="inline-flex items-center">
                串流中
                <BlinkCursor className="text-status-live" />
              </span>
            </span>
          </div>

          <div className="relative">
            <AnimatePresence initial={false} mode="popLayout">
              {entries.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  layout
                  initial={{ opacity: 0, y: -18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.4, ease: EASE } }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="group relative overflow-hidden border-b border-comb-line/50 px-4 py-3.5 font-mono text-[13px] transition-colors duration-300 last:border-b-0 hover:bg-honey-500/[0.06] sm:px-5 sm:text-sm"
                >
                  {/* 左側彩色 bar：加寬至 4px，視覺強化狀態感 */}
                  <motion.span
                    aria-hidden
                    className={`absolute left-0 top-0 h-full w-1 origin-left ${DOT[entry.stage]}`}
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
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* 頁尾：導向完整動態頁，加底色讓層次分隔清楚 */}
          <Link
            href="/activity"
            className="group flex items-center justify-between border-t border-comb-line/60 bg-bg-raised/30 px-5 py-3.5 font-mono text-xs text-text-muted transition-colors duration-300 hover:bg-bg-overlay/50"
          >
            <span>{ACTIVE.length} 位員工在線 · 持續滾動中</span>
            <span className="inline-flex items-center gap-1.5 text-honey-400">
              查看完整動態
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          </Link>
        </Reveal>
      </div>
    </motion.section>
  )
}
