'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Lenis 平滑捲動。尊重 prefers-reduced-motion — 偏好關閉動效時不啟用。
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (prefersReduced) return

    const lenis = new Lenis({
      duration: 1.1,
      // 與全站動效一致的有機減速曲線
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    })

    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
