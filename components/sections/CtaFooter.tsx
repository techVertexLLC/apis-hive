'use client'

import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'
import { EMPLOYEE_COUNT } from '@/lib/employees'

export function CtaFooter() {
  return (
    <section id="contact" className="relative overflow-hidden border-t border-comb-line">
      {/* 底部琥珀光暈 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-80 bg-[radial-gradient(60%_100%_at_50%_100%,rgba(245,166,35,0.14),transparent)]" />

      <div className="relative mx-auto w-full max-w-5xl px-6 py-32 text-center">
        <Reveal>
          <h2 className="mx-auto max-w-3xl font-display text-4xl font-semibold leading-[1.15] tracking-tight text-text-primary sm:text-6xl">
            蜂巢不打烊。
            <br />
            <span className="text-honey-500">要不要進來看看？</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-[1.8] text-text-secondary">
            此刻就有 {EMPLOYEE_COUNT} 位 AI 員工在運轉。想談合作、聊採購，或單純好奇一家
            AI-native 公司怎麼跑起來 — 直接寫信給兩位架構師，我們親自回。
          </p>
        </Reveal>

        <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-4" delay={0.1}>
          <a
            href="mailto:tech@vertexdistributor.com"
            className="group inline-flex items-center gap-2 rounded-full bg-honey-500 px-7 py-3 text-sm font-semibold text-bg-base shadow-lg shadow-honey-500/20 transition-all duration-300 hover:scale-[1.03] hover:bg-honey-400 hover:shadow-honey-500/40 active:scale-[0.98]"
          >
            寫信給蜂巢
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </a>
          <Link
            href="/team"
            className="inline-flex items-center gap-2 rounded-full border border-comb-line px-7 py-3 text-sm font-medium text-text-primary transition-all duration-300 hover:scale-[1.03] hover:border-honey-500/40 hover:bg-bg-overlay active:scale-[0.98]"
          >
            先認識每位員工
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
