'use client'

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type Variants,
} from 'framer-motion'
import { fadeUp, staggerContainer, EASE } from '@/lib/motion'
import { Magnetic } from '@/components/ui/Magnetic'
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

// 靜態蜂巢佔位 — flat-top honeycomb backdrop
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

// 主標逐行揭幕 —— 每行在 overflow-hidden 的遮罩內由下方滑入。
const lineContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}
const lineChild: Variants = {
  hidden: { y: '115%' },
  visible: { y: '0%', transition: { duration: 0.9, ease: EASE } },
}

export function Hero() {
  const reduce = useReducedMotion()

  // 滑鼠跟隨 parallax —— 游標相對畫面中心的 -0.5~0.5，乘上位移幅度。
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 1.1 })
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 1.1 })

  // 兩層背景以不同幅度位移，製造景深。
  const hexX = useTransform(sx, (v) => v * 18)
  const hexY = useTransform(sy, (v) => v * 18)
  const combX = useTransform(sx, (v) => v * 34)
  const combY = useTransform(sy, (v) => v * 34)

  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduce) return
    const { innerWidth, innerHeight } = window
    mx.set(e.clientX / innerWidth - 0.5)
    my.set(e.clientY / innerHeight - 0.5)
  }

  return (
    <section
      onMouseMove={handleMove}
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      {/* 蜂格紋動態背景 — 最底層細密蜂巢紋理，緩慢呼吸 + 滑鼠 parallax */}
      <motion.div
        aria-hidden
        className="hex-field pointer-events-none absolute inset-[-4%]"
        style={reduce ? undefined : { x: combX, y: combY }}
      />
      {/* 蜂巢背景（位移幅度較小，形成景深） */}
      <motion.div
        className="pointer-events-none absolute inset-[-3%] opacity-70"
        style={reduce ? undefined : { x: hexX, y: hexY }}
      >
        <HiveBackdrop />
      </motion.div>
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

        {/* 主標 —— 逐行遮罩揭幕（reduced-motion 退化為整段 fade-up） */}
        <motion.h1
          variants={reduce ? fadeUp : lineContainer}
          className="font-display text-[2.5rem] font-semibold leading-[1.08] tracking-tight text-text-primary sm:text-7xl sm:leading-[1.05]"
        >
          <span className="block overflow-hidden pb-[0.05em]">
            <motion.span variants={reduce ? undefined : lineChild} className="block">
              {EMPLOYEE_COUNT} 位員工，
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.05em]">
            <motion.span variants={reduce ? undefined : lineChild} className="block text-honey-500">
              從不下班。
            </motion.span>
          </span>
        </motion.h1>

        <motion.div variants={fadeUp} className="mt-6 max-w-2xl sm:mt-7">
          <p className="text-base leading-[1.8] text-text-secondary sm:text-xl">
            Apis 是一家 AI-native 公司。兩位人類定方向，一群 AI
            員工把事情做完 — 沒有打卡、沒有交接、沒有熄燈的時刻，只有一座持續運轉的蜂巢。
          </p>
          <p className="mt-5 font-mono text-sm tracking-[0.28em] text-text-muted sm:text-base">
            2 humans · 13 AI · 0 downtime
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-4">
          <Magnetic strength={0.4}>
            <a
              href="#roster"
              className="cta-shimmer group inline-flex items-center gap-2 rounded-full bg-honey-500 px-6 py-3 text-sm font-semibold text-bg-base shadow-lg shadow-honey-500/25 transition-all duration-300 hover:bg-honey-400 hover:shadow-xl hover:shadow-honey-500/40 active:scale-[0.98]"
            >
              <span className="relative z-[2]">進入 Hive</span>
              <span className="relative z-[2] transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </Magnetic>
          <Magnetic strength={0.3}>
            <a
              href="#live"
              className="inline-flex items-center gap-2 rounded-full border border-comb-line bg-bg-raised/40 px-6 py-3 text-sm font-medium text-text-primary backdrop-blur-sm transition-all duration-300 hover:border-honey-500/40 hover:bg-bg-overlay active:scale-[0.98]"
            >
              看他們正在做什麼
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>
    </section>
  )
}
