'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { EASE } from '@/lib/motion'

/**
 * 回到頂部按鈕 —— 捲動超過一個視窗高度後，帶旋轉 + fade 進場；
 * 點擊平滑捲回頂端。reduced-motion 下省略旋轉，只做 opacity。
 */
export function ScrollToTop() {
  const reduce = useReducedMotion()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.9)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toTop = () =>
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label="回到頂部"
          onClick={toTop}
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, rotate: -90 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, rotate: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, rotate: 90 }}
          transition={{ duration: 0.35, ease: EASE }}
          whileHover={reduce ? undefined : { scale: 1.08, y: -2 }}
          whileTap={reduce ? undefined : { scale: 0.92 }}
          className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-honey-500/40 bg-bg-raised/80 text-honey-400 shadow-lg shadow-black/40 backdrop-blur-md transition-colors hover:border-honey-500/70 hover:bg-bg-overlay hover:text-honey-300"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M8 12.5V3.5M8 3.5L3.5 8M8 3.5L12.5 8"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
