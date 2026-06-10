'use client'

import { useEffect, useRef } from 'react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EMPLOYEES, STAGE_META } from '@/lib/employees'
import { gsap, registerScrollTrigger, prefersReducedMotion } from '@/lib/gsap'

const LINES = [
  {
    key: 'distribution' as const,
    tag: '業務線 01',
    title: 'AI 團隊經營的分銷生意',
    body: '一支 AI 員工組成的團隊，端到端經營實體商品的 AI 驅動分銷（AI-driven distribution）— 從開發客戶、洽談供應商、報價跟進，到訂單處理與售後支援，全程由蜂巢自主運轉。',
    points: ['客戶與供應商開發', '報價、議價與成交', '訂單、物流與售後'],
  },
  {
    key: 'software' as const,
    tag: '業務線 02',
    title: 'AI 打造的軟體產品',
    body: '同一群 AI 員工也是產品團隊 — 從需求規格、前端實作、品質把關到內容與 SEO，打造可對外銷售的 AI 軟體產品（AI software products）。這個官網就是他們的作品之一。',
    points: ['產品規劃與規格', '工程實作與品質', '內容、SEO 與成長'],
  },
]

export function BusinessLines() {
  const gridRef = useRef<HTMLUListElement>(null)

  // GSAP ScrollTrigger：雙欄從兩側滑入（左欄 ←、右欄 →）。
  // reduced-motion 下跳過，維持自然可見狀態。
  useEffect(() => {
    if (prefersReducedMotion() || !gridRef.current) return
    registerScrollTrigger()
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.line-card')
      cards.forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          x: i === 0 ? -72 : 72,
          duration: 0.95,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
            once: true,
          },
        })
      })
    }, gridRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="business" className="relative border-t border-comb-line py-28">
      <div className="mx-auto w-full max-w-6xl px-6">
        <SectionHeading
          eyebrow="Two Business Lines"
          title="同一座蜂巢，兩條業務線。"
          description={
            <>
              分銷與軟體看似無關，卻共用同一群 AI
              員工與同一套營運系統。蜂巢的能力，可以同時飛向不同的花田。
            </>
          }
        />

        <ul ref={gridRef} className="mt-14 grid gap-6 lg:grid-cols-2">
          {LINES.map((line) => {
            const crew = EMPLOYEES.filter((e) => e.line === line.key)
            return (
              <li
                key={line.key}
                className="line-card glow-border relative flex flex-col rounded-2xl border border-comb-line bg-bg-raised p-8 transition-all duration-300 hover:-translate-y-1 hover:border-honey-500/40 hover:shadow-xl hover:shadow-honey-500/10"
              >
                <span className="relative z-[1] font-mono text-xs uppercase tracking-[0.2em] text-honey-500">
                  {line.tag}
                </span>
                <h3 className="relative z-[1] mt-4 font-display text-2xl font-semibold text-text-primary">
                  {line.title}
                </h3>
                <p className="relative z-[1] mt-4 text-sm leading-[1.8] text-text-secondary">
                  {line.body}
                </p>

                <ul className="relative z-[1] mt-6 space-y-2.5">
                  {line.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-text-secondary">
                      <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-honey-500" />
                      {p}
                    </li>
                  ))}
                </ul>

                {/* 負責的員工 */}
                <div className="relative z-[1] mt-7 flex flex-wrap items-center gap-2 border-t border-comb-line pt-5">
                  <span className="font-mono text-[11px] text-text-muted">負責員工</span>
                  {crew.map((e) => (
                    <span
                      key={e.id}
                      title={`${e.name} · ${e.role}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-comb-line bg-bg-base px-2.5 py-1 text-xs text-text-secondary"
                    >
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: STAGE_META[e.stage].color }}
                      />
                      {e.name}
                    </span>
                  ))}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
