'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion'

type Tag = 'div' | 'section' | 'ul' | 'li' | 'span'

interface RevealProps {
  children: ReactNode
  className?: string
  as?: Tag
  /** 額外的進場延遲（秒） */
  delay?: number
}

/** 單一元素 fade-up 進場。進入視窗時觸發一次。 */
export function Reveal({ children, className, as = 'div', delay = 0 }: RevealProps) {
  const Comp = motion[as] as typeof motion.div
  return (
    <Comp
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </Comp>
  )
}

/** 容器 — 讓內部的 RevealItem 依序（stagger）進場。 */
export function RevealGroup({ children, className, as = 'div' }: RevealProps) {
  const Comp = motion[as] as typeof motion.div
  return (
    <Comp
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {children}
    </Comp>
  )
}

/** RevealGroup 內的子項，依 stagger 節奏進場。 */
export function RevealItem({ children, className, as = 'div' }: RevealProps) {
  const Comp = motion[as] as typeof motion.div
  return (
    <Comp className={className} variants={fadeUp}>
      {children}
    </Comp>
  )
}
