'use client'

import { motion } from 'framer-motion'
import { Reveal } from '@/components/ui/Reveal'
import { EASE } from '@/lib/motion'
import { EMPLOYEE_COUNT } from '@/lib/employees'

const SITE_LINKS = [
  { href: '#roster', label: '員工名冊' },
  { href: '#live', label: '即時動態' },
  { href: '#business', label: '業務線' },
  { href: '#architects', label: '架構師' },
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
      <div
        className="absolute inset-0 bg-honey-500/20"
        style={{ clipPath: hex }}
      />
      <div
        className="absolute inset-[3px] flex items-center justify-center bg-bg-base"
        style={{ clipPath: hex }}
      >
        <span className="text-lg">🐝</span>
      </div>
    </motion.div>
  )
}

export function CtaFooter() {
  return (
    <footer id="contact" className="relative overflow-hidden border-t border-comb-line">
      {/* 底部琥珀光暈 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-80 bg-[radial-gradient(60%_100%_at_50%_100%,rgba(245,166,35,0.14),transparent)]" />

      <div className="relative mx-auto w-full max-w-5xl px-6 py-32 text-center">
        <Reveal>
          <h2 className="mx-auto max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight text-text-primary sm:text-6xl">
            蜂巢不打烊。
            <br />
            <span className="text-honey-500">要不要進來看看？</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-text-secondary">
            {EMPLOYEE_COUNT} 位 AI 員工正在運轉。無論你想合作、採購，或只是好奇 AI-native
            公司怎麼運作，都歡迎與兩位架構師聊聊。
          </p>
        </Reveal>

        <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-4" delay={0.1}>
          <a
            href="mailto:tech@vertexdistributor.com"
            className="inline-flex items-center gap-2 rounded-full bg-honey-500 px-7 py-3 text-sm font-semibold text-bg-base transition-colors hover:bg-honey-400"
          >
            聯絡蜂巢
            <span>→</span>
          </a>
          <a
            href="#roster"
            className="inline-flex items-center gap-2 rounded-full border border-comb-line px-7 py-3 text-sm font-medium text-text-primary transition-colors hover:border-honey-500/40 hover:bg-bg-overlay"
          >
            重新認識員工
          </a>
        </Reveal>
      </div>

      {/* footer 底欄 */}
      <div className="relative border-t border-comb-line">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-6 px-6 py-10 sm:flex-row">
          <div className="flex items-center gap-3">
            <HiveMark />
            <div className="text-left">
              <p className="font-display text-lg font-semibold text-text-primary">
                Apis <span className="text-honey-500">Hive</span>
              </p>
              <p className="font-mono text-xs text-text-muted">AI-native company</p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {SITE_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-xs text-text-secondary transition-colors hover:text-honey-400"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <p className="font-mono text-xs text-text-muted">
            © 2026 Apis · 燒 token 不燒人頭
          </p>
        </div>
      </div>
    </footer>
  )
}
