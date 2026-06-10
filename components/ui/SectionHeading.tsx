'use client'

import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  fadeOnly,
  fadeUp,
  headingContainer,
  titleReveal,
  viewportOnce,
} from '@/lib/motion'

interface SectionHeadingProps {
  /** 上方的小標（mono、琥珀色） */
  eyebrow?: ReactNode
  /** 主標題 */
  title: ReactNode
  /** 描述段落 */
  description?: ReactNode
  /** 標題標籤層級 */
  titleAs?: 'h1' | 'h2'
  className?: string
  titleClassName?: string
  descriptionClassName?: string
  /** 置中（CTA 區用） */
  align?: 'left' | 'center'
}

/**
 * 全站統一的 section 標題群組。
 * - 標題用 clip-path 由下往上揭幕 + blur-to-sharp。
 * - 描述與標題之間有明顯的 stagger 時間差（150ms），層次更分明。
 * - 完整 honor prefers-reduced-motion：關閉時只剩 opacity 淡入。
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  titleAs = 'h2',
  className,
  titleClassName,
  descriptionClassName,
  align = 'left',
}: SectionHeadingProps) {
  const reduce = useReducedMotion()
  const TitleTag = titleAs === 'h1' ? motion.h1 : motion.h2

  // reduced-motion：所有子項退化為純 opacity。
  const eyebrowV = reduce ? fadeOnly : fadeUp
  const titleV = reduce ? fadeOnly : titleReveal
  const descV = reduce ? fadeOnly : fadeUp

  const baseTitle =
    'font-display font-semibold tracking-tight text-text-primary'
  const titleSize =
    titleAs === 'h1'
      ? 'text-4xl leading-tight sm:text-5xl'
      : 'text-3xl sm:text-4xl'

  return (
    <motion.div
      className={className}
      variants={headingContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {eyebrow ? (
        <motion.p
          variants={eyebrowV}
          className={`font-mono text-xs uppercase tracking-[0.2em] text-honey-500 ${
            align === 'center' ? 'mx-auto w-fit' : ''
          }`}
        >
          {eyebrow}
        </motion.p>
      ) : null}

      <TitleTag
        variants={titleV}
        className={`${eyebrow ? 'mt-4' : ''} ${baseTitle} ${titleSize} ${
          titleClassName ?? ''
        }`}
        // clip-path 揭幕需要這層裁切基準
        style={{ willChange: 'clip-path, filter, transform, opacity' }}
      >
        {title}
      </TitleTag>

      {description ? (
        <motion.div
          variants={descV}
          className={`mt-4 max-w-2xl text-base leading-[1.8] text-text-secondary ${
            align === 'center' ? 'mx-auto' : ''
          } ${descriptionClassName ?? ''}`}
        >
          {description}
        </motion.div>
      ) : null}
    </motion.div>
  )
}
