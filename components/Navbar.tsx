'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { EASE, SPRING_SOFT } from '@/lib/motion'

// 全站導航連結。品牌名保留英文，分頁標籤用簡潔字樣。
const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/activity', label: 'Activity' },
  { href: '/team', label: 'Team' },
  { href: '/partners', label: 'Partners' },
  { href: '/about', label: 'About' },
  { href: '/dashboard', label: 'Dashboard' },
] as const

export function Navbar() {
  const pathname = usePathname()
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)

  // 當前頁面判定：精準比對 pathname（首頁僅在根路徑高亮）
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-50 border-b border-comb-line bg-bg-base/70 backdrop-blur-md">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        {/* 左側：Apis 文字 logo（Fraunces / 琥珀色） */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="font-display text-xl font-semibold tracking-tight text-honey-500 transition-all duration-300 hover:scale-[1.04] hover:text-honey-400 active:scale-95"
        >
          Apis
        </Link>

        {/* 右側：桌面版連結 */}
        <ul className="hidden items-center gap-6 sm:flex md:gap-8">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href)
            return (
              <li key={link.href} className="relative">
                <Link
                  href={link.href}
                  className={`nav-underline font-mono text-sm transition-colors duration-300 ${
                    active
                      ? 'text-honey-500'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {link.label}
                </Link>
                {/* 滑動式 active 指示線 —— 換頁時用 layoutId 在連結間平滑滑移 */}
                {active && (
                  <motion.span
                    layoutId="nav-active-indicator"
                    aria-hidden
                    className="absolute -bottom-[0.35rem] left-0 right-0 h-px bg-honey-500"
                    transition={reduce ? { duration: 0 } : SPRING_SOFT}
                  />
                )}
              </li>
            )
          })}
        </ul>

        {/* 手機版漢堡按鈕 */}
        <button
          type="button"
          aria-label="切換選單"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center text-text-secondary transition-colors hover:text-text-primary sm:hidden"
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 block h-px w-5 bg-current transition-all duration-300 ${
                open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 block h-px w-5 -translate-y-1/2 bg-current transition-opacity duration-300 ${
                open ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute left-0 block h-px w-5 bg-current transition-all duration-300 ${
                open ? 'bottom-1/2 translate-y-1/2 -rotate-45' : 'bottom-0'
              }`}
            />
          </span>
        </button>
      </nav>

      {/* 手機版下拉選單 */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden border-t border-comb-line bg-bg-base/95 backdrop-blur-md sm:hidden"
          >
            <ul className="flex flex-col px-6 py-3">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href)
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`block py-3 font-mono text-sm transition-colors ${
                        active
                          ? 'text-honey-500'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
