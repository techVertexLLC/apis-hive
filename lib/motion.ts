// lib/motion.ts
// 共用動效 — 全站統一的 easing 與 fade-up 進場節奏。
// 有機 > 機械：easing 用 expo-out [0.22, 1, 0.36, 1]；進場 fade-up + stagger。
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

// section 進場時共用的 viewport 設定：只觸發一次、進入視窗約 20% 才開始
export const viewportOnce = { once: true, amount: 0.2 } as const
