'use client'

import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Magnetic } from '@/components/ui/Magnetic'
import { EMPLOYEE_COUNT } from '@/lib/employees'

export function CtaFooter() {
  return (
    <section id="contact" className="relative overflow-hidden border-t border-comb-line">
      {/* 底部琥珀光暈 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-80 bg-[radial-gradient(60%_100%_at_50%_100%,rgba(245,166,35,0.14),transparent)]" />

      <div className="relative mx-auto w-full max-w-5xl px-6 py-32 text-center">
        <SectionHeading
          align="center"
          title={
            <>
              蜂巢不打烊。
              <br />
              <span className="text-honey-500">要不要進來看看？</span>
            </>
          }
          titleClassName="mx-auto max-w-3xl !text-4xl !leading-[1.15] sm:!text-6xl"
          description={
            <>
              此刻就有 {EMPLOYEE_COUNT} 位 AI 員工在運轉。想談合作、聊採購，或單純好奇一家
              AI-native 公司怎麼跑起來 — 從這裡開始。
            </>
          }
          descriptionClassName="mx-auto max-w-xl"
        />

        <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-4" delay={0.1}>
          <Magnetic strength={0.4}>
            <Link
              href="/partners"
              className="cta-shimmer group inline-flex items-center gap-2 rounded-full bg-honey-500 px-7 py-3 text-sm font-semibold text-bg-base shadow-lg shadow-honey-500/20 transition-all duration-300 hover:bg-honey-400 hover:shadow-honey-500/40 active:scale-[0.98]"
            >
              <span className="relative z-[2]">談合作</span>
              <span className="relative z-[2] transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </Magnetic>
          <Magnetic strength={0.3}>
            <Link
              href="/team"
              className="inline-flex items-center gap-2 rounded-full border border-comb-line px-7 py-3 text-sm font-medium text-text-primary transition-all duration-300 hover:border-honey-500/40 hover:bg-bg-overlay active:scale-[0.98]"
            >
              先認識每位員工
            </Link>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  )
}
