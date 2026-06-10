'use client'

import { useRef, type ReactNode, type ElementType } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import { SPRING_SOFT } from '@/lib/motion'

interface TiltCardProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'li'
  /** 最大傾斜角度（度） */
  max?: number
  /** 是否顯示跟隨游標的琥珀光斑（矩形卡片用 true；異形如六邊形用 false） */
  glow?: boolean
  variants?: import('framer-motion').Variants
}

/**
 * 3D 傾斜卡片 —— hover 時依滑鼠位置做 perspective 傾斜，
 * 並讓琥珀色光斑跟隨游標（gradient glow），離開回正。
 * reduced-motion / 觸控裝置：完全靜止，只保留既有 hover 樣式。
 */
export function TiltCard({
  children,
  className,
  as = 'div',
  max = 7,
  glow = true,
  variants,
}: TiltCardProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  // 0–1 的游標相對位置
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)

  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), SPRING_SOFT)
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), SPRING_SOFT)

  // 光斑位置（百分比）跟隨游標 —— 在 body 頂層算好，避免在 JSX 條件分支裡呼叫 hook。
  const glowBg = useTransform(
    [px, py],
    ([gx, gy]: number[]) =>
      `radial-gradient(circle at ${gx * 100}% ${gy * 100}%, rgba(245,166,35,0.16), transparent 60%)`,
  )

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width)
    py.set((e.clientY - rect.top) / rect.height)
  }

  const reset = () => {
    px.set(0.5)
    py.set(0.5)
  }

  const MotionTag = (as === 'li' ? motion.li : motion.div) as ElementType

  return (
    <MotionTag
      ref={ref}
      variants={variants}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={
        reduce
          ? undefined
          : {
              rotateX,
              rotateY,
              transformPerspective: 900,
              transformStyle: 'preserve-3d',
            }
      }
      className={`group/tilt relative ${className ?? ''}`}
    >
      {/* 跟隨游標的琥珀光斑（hover 才顯現） */}
      {!reduce && glow && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
          style={{ background: glowBg }}
        />
      )}
      {children}
    </MotionTag>
  )
}
