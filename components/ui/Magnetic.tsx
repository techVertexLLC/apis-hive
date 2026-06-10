'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { SPRING_SNAPPY } from '@/lib/motion'

interface MagneticProps {
  children: ReactNode
  className?: string
  /** 吸引強度（0–1），值越大位移越明顯 */
  strength?: number
}

/**
 * 磁吸效果 —— 滑鼠靠近時元素被輕輕吸引偏移，離開回彈。
 * 用 spring 讓回彈帶有機感。觸控裝置與 reduced-motion 不作動。
 * 包一層 inline-block 的 motion.span，不影響內部按鈕的既有樣式。
 */
export function Magnetic({ children, className, strength = 0.35 }: MagneticProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, SPRING_SNAPPY)
  const sy = useSpring(y, SPRING_SNAPPY)

  const handleMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (reduce) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const relX = e.clientX - (rect.left + rect.width / 2)
    const relY = e.clientY - (rect.top + rect.height / 2)
    x.set(relX * strength)
    y.set(relY * strength)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={reduce ? undefined : { x: sx, y: sy }}
      className={`inline-flex ${className ?? ''}`}
    >
      {children}
    </motion.span>
  )
}
