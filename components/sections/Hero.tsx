'use client'

import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, EASE } from '@/lib/motion'
import { EMPLOYEE_COUNT, LIVE_EMPLOYEES } from '@/lib/employees'

// 產生 flat-top 六邊形的多邊形座標
function hexPoints(cx: number, cy: number, r: number) {
  const pts: string[] = []
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 180) * (60 * i)
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`)
  }
  return pts.join(' ')
}

// 靜態蜂巢佔位 — flat-top honeycomb backdrop（P1 將升級為互動 Canvas）
function HiveBackdrop() {
  const R = 64
  const colStep = R * 1.5
  const rowStep = R * Math.sqrt(3)
  const cols = 13
  const rows = 7
  // 隨機感但決定性：固定幾格發光，避免 hydration 不一致
  const glow = new Set([5, 11, 18, 27, 34, 41, 53, 60, 68, 72, 79, 85, 91])

  const cells: { cx: number; cy: number; on: boolean }[] = []
  let idx = 0
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const cx = c * colStep
      const cy = r * rowStep + (c % 2 ? rowStep / 2 : 0)
      cells.push({ cx, cy, on: glow.has(idx) })
      idx++
    }
  }

  return (
    <svg
      aria-hidden
      className="absolute inset-0 h-full w-full"
      viewBox="-40 -40 880 620"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="hive-glow" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="rgba(245,166,35,0.18)" />
          <stop offset="55%" stopColor="rgba(245,166,35,0.04)" />
          <stop offset="100%" stopColor="rgba(245,166,35,0)" />
        </radialGradient>
      </defs>
      <rect x="-40" y="-40" width="880" height="620" fill="url(#hive-glow)" />
      {cells.map((cell, i) => (
        <motion.polygon
          key={i}
          points={hexPoints(cell.cx, cell.cy, R - 4)}
          fill={cell.on ? 'rgba(245,166,35,0.10)' : 'transparent'}
          stroke={cell.on ? 'rgba(245,166,35,0.45)' : 'rgba(245,166,35,0.14)'}
          strokeWidth={1}
          initial={{ opacity: 0 }}
          animate={{ opacity: cell.on ? [0.45, 1, 0.45] : 1 }}
          transition={
            cell.on
              ? { duration: 3.2 + (i % 5) * 0.4, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 1.2, ease: EASE }
          }
        />
      ))}
    </svg>
  )
}

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      {/* 蜂格紋動態背景 — 最底層細密蜂巢紋理，緩慢呼吸（comb.line 色） */}
      <div aria-hidden className="hex-field pointer-events-none absolute inset-0" />
      {/* 蜂巢背景 */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <HiveBackdrop />
      </div>
      {/* 主視覺光暈 — 讓 Hero 更有存在感 */}
      <div className="pointer-events-none absolute left-1/2 top-[38%] h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-honey-500/10 blur-[110px] sm:h-[42rem] sm:w-[42rem]" />
      {/* 底部漸層，讓文字浮起 */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg-base/40 via-bg-base/10 to-bg-base" />

      <motion.div
        className="relative mx-auto w-full max-w-5xl px-6 py-24 sm:py-32"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={fadeUp}
          className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-comb-line bg-bg-raised/60 px-4 py-1.5 backdrop-blur-sm"
        >
          <span className="hive-breathe inline-block h-2 w-2 rounded-full bg-status-live" />
          <span className="font-mono text-xs tracking-wide text-text-secondary">
            {LIVE_EMPLOYEES.length} 位員工上線中 · 蜂巢運轉中
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="font-display text-[2.5rem] font-semibold leading-[1.08] tracking-tight text-text-primary sm:text-7xl sm:leading-[1.05]"
        >
          {EMPLOYEE_COUNT} 位員工，
          <br />
          <span className="text-honey-500">從不下班。</span>
        </motion.h1>

        <motion.div variants={fadeUp} className="mt-6 max-w-2xl sm:mt-7">
          <p className="text-base leading-relaxed text-text-secondary sm:text-xl">
            Apis 是一家 AI-native
            公司。兩位人類架構師，領著一支自主運作的 AI 勞動力（autonomous AI
            workforce），組成一個永不停歇的蜂巢。
          </p>
          <p className="mt-5 font-mono text-sm tracking-[0.28em] text-text-muted sm:text-base">
            2 humans · 13 AI · 0 downtime
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#roster"
            className="group inline-flex items-center gap-2 rounded-full bg-honey-500 px-6 py-3 text-sm font-semibold text-bg-base shadow-lg shadow-honey-500/25 transition-all duration-300 hover:scale-[1.04] hover:bg-honey-400 hover:shadow-xl hover:shadow-honey-500/40 active:scale-[0.98]"
          >
            進入 Hive
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
          <a
            href="#live"
            className="inline-flex items-center gap-2 rounded-full border border-comb-line bg-bg-raised/40 px-6 py-3 text-sm font-medium text-text-primary backdrop-blur-sm transition-all duration-300 hover:scale-[1.03] hover:border-honey-500/40 hover:bg-bg-overlay active:scale-[0.98]"
          >
            看他們正在做什麼
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}
