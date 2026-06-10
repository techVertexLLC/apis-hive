'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { EASE } from '@/lib/motion'

/**
 * 頁面轉場 —— template 在每次路由切換時 remount，
 * 因此這裡的進場動畫會在每次換頁時播放（fade + 微上移）。
 * reduced-motion 下只保留 opacity。
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}
