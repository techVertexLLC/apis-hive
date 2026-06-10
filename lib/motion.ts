// lib/motion.ts
// 共用動效 — 全站統一的 easing 與進場節奏。
// 有機 > 機械：easing 用 expo-out [0.22, 1, 0.36, 1]；進場 fade-up + stagger。
// 高級感的關鍵是節奏與曲線：clip-path / blur 揭幕、stagger 時間差、spring 微互動。
import type { Variants, Transition } from 'framer-motion'

// expo-out — 有機減速曲線
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export const DURATION = {
  fast: 0.4,
  base: 0.6,
  slow: 0.9,
} as const

// 子元素之間的延遲（60–80ms）
export const STAGGER = 0.07

// spring 預設 —— 微互動（magnetic / pop / 滑動指示）統一手感。
// 帶極輕微的 overshoot，有彈性但不浮誇。
export const SPRING_SNAPPY: Transition = {
  type: 'spring',
  stiffness: 320,
  damping: 24,
  mass: 0.7,
}

export const SPRING_SOFT: Transition = {
  type: 'spring',
  stiffness: 150,
  damping: 18,
  mass: 0.9,
}

const baseTransition: Transition = {
  duration: DURATION.base,
  ease: EASE,
}

// 單一元素 fade-up
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: baseTransition,
  },
}

// 標題揭幕 —— clip-path 由下往上揭開 + blur-to-sharp，比單純 fade 更有重量感。
export const titleReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
    filter: 'blur(10px)',
    clipPath: 'inset(0% 0% 100% 0%)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: DURATION.slow, ease: EASE },
  },
}

// 從左 / 右滑入（BusinessLines 雙欄用）
export const fromLeft: Variants = {
  hidden: { opacity: 0, x: -48 },
  visible: { opacity: 1, x: 0, transition: { duration: DURATION.slow, ease: EASE } },
}

export const fromRight: Variants = {
  hidden: { opacity: 0, x: 48 },
  visible: { opacity: 1, x: 0, transition: { duration: DURATION.slow, ease: EASE } },
}

// reduced-motion 安全版本：只保留 opacity，不位移、不模糊、不裁切。
export const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.base, ease: EASE } },
}

// 容器 — 讓子元素依序進場
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER,
      delayChildren: 0.05,
    },
  },
}

// 標題群組容器 —— 標題與描述之間拉開明顯時間差（150ms）。
export const headingContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.04,
    },
  },
}

// section 進場時共用的 viewport 設定：只觸發一次、進入視窗約 20% 才開始
export const viewportOnce = { once: true, amount: 0.2 } as const
