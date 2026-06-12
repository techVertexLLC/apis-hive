import type { CSSProperties } from 'react'

interface SkeletonProps {
  /** rect：矩形（預設，圓角）；circle：圓形（需自行給等寬高） */
  variant?: 'rect' | 'circle'
  /** 以 Tailwind utility 控制尺寸（如 'h-4 w-32'） */
  className?: string
  style?: CSSProperties
}

/**
 * 通用骨架屏元件 —— 暖黑底上的 shimmer 動畫佔位。
 * shimmer 由 globals.css 的 .skeleton-shimmer 提供，reduced-motion 自動退化為靜態。
 * 純展示用，對輔助技術隱藏。
 */
export function Skeleton({ variant = 'rect', className = '', style }: SkeletonProps) {
  const shape = variant === 'circle' ? 'rounded-full' : 'rounded-md'
  return (
    <span
      aria-hidden
      className={`skeleton-shimmer block ${shape} ${className}`}
      style={style}
    />
  )
}
