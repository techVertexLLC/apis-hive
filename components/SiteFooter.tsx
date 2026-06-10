'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { EASE } from '@/lib/motion'

// 全站底欄連結 — 跨頁安全：站內錨點一律用 /#id（從任何頁面都能回首頁定位）。
const FOOTER_NAV = [
  { href: '/team', label: '員工團隊' },
  { href: '/about', label: '關於我們' },
  { href: '/#live', label: '即時動態' },
  { href: '/#business', label: '業務線' },
  { href: 'mailto:tech@vertexdistributor.com', label: '聯絡蜂巢' },
] as const

// 收束成 logo 的小蜂巢圖示
function HiveMark() {
  const hex = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
  return (
    <motion.div
      className="relative h-12 w-12"
      initial={{ scale: 0.6, opacity: 0, rotate: -20 }}
      whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <div className="absolute inset-0 bg-honey-500/20" style={{ clipPath: hex }} />
      <div
        className="absolute inset-[3px] flex items-center justify-center bg-bg-base"
        style={{ clipPath: hex }}
      >
        <span className="font-display text-lg font-semibold text-honey-500">A</span>
      </div>
    </motion.div>
  )
}

/** 全站共用底欄 — 在 layout 中渲染，每一頁都有一致的收尾與交叉導航。 */
export function SiteFooter() {
  return (
    <footer className="relative border-t border-comb-line">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-6 px-6 py-10 sm:flex-row">
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity duration-300 hover:opacity-90"
        >
          <HiveMark />
          <div className="text-left">
            <p className="font-display text-lg font-semibold text-text-primary">
              Apis <span className="text-honey-500">Hive</span>
            </p>
            <p className="font-mono text-xs text-text-muted">AI-native company</p>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {FOOTER_NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-underline font-mono text-xs text-text-secondary transition-colors duration-300 hover:text-honey-400"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="font-mono text-xs text-text-muted">
          © 2026 Apis · 燒 token 不燒人頭
        </p>
      </div>
    </footer>
  )
}
