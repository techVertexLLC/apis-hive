'use client'

import { useEffect, useRef } from 'react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { gsap, registerScrollTrigger, prefersReducedMotion } from '@/lib/gsap'

const BELIEFS = [
  {
    index: '01',
    title: '燒 token 不燒人頭',
    summary: '成長的單位不是招募，是運算。',
    body: '需要更多產能時，我們不開職缺，而是調度更多 AI 員工上線。成本可量化、可預測，且邊際成本逼近運算本身。',
  },
  {
    index: '02',
    title: '人是架構師，AI 是員工',
    summary: '兩位人類定義方向，一群 AI 負責執行。',
    body: '人類不再做重複勞動，而是設計系統、劃定權責邊界、決定蜂巢往哪裡飛。AI 員工在這些邊界內自主運作。',
  },
  {
    index: '03',
    title: '先驗證，再硬化',
    summary: '每位員工都從測試開始，被證明了才固化。',
    body: '新角色先以 Beta 上線、坦誠標示成熟度；流程被驗證可靠後，才寫進系統成為穩定能力。我們不假裝一切都已完美。',
  },
]

export function HowItWorks() {
  const listRef = useRef<HTMLUListElement>(null)

  // GSAP ScrollTrigger：三張卡片隨 scroll 逐張「翻入」（rotateX flip + stagger）。
  // reduced-motion 下完全跳過，卡片維持自然可見狀態（只剩 opacity）。
  useEffect(() => {
    if (prefersReducedMotion() || !listRef.current) return
    registerScrollTrigger()
    const ctx = gsap.context(() => {
      gsap.from('.belief-card', {
        opacity: 0,
        y: 64,
        rotateX: -42,
        transformPerspective: 900,
        transformOrigin: '50% 0%',
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.16,
        scrollTrigger: {
          trigger: listRef.current,
          start: 'top 82%',
          once: true,
        },
      })
    }, listRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="how" className="relative border-t border-comb-line py-28">
      <div className="mx-auto w-full max-w-6xl px-6">
        <SectionHeading
          eyebrow="How the Hive Works"
          title="三個信念，撐起一座蜂巢。"
          description={
            <>
              這座蜂巢的 AI 驅動營運（AI-powered
              operations）建立在三個原則上：人類負責設計、AI
              負責執行，以人機協作（human-AI collaboration）取代傳統的層層人力。
            </>
          }
        />

        <ul
          ref={listRef}
          className="mt-14 grid gap-6 md:grid-cols-3"
          style={{ perspective: 1000 }}
        >
          {BELIEFS.map((b) => (
            <li
              key={b.index}
              className="belief-card glow-border group relative flex flex-col rounded-2xl border border-comb-line bg-bg-raised p-7 transition-all duration-300 hover:-translate-y-1 hover:border-honey-500/40 hover:bg-bg-overlay hover:shadow-xl hover:shadow-honey-500/10"
            >
              <div className="relative z-[1] flex items-center justify-between">
                <span className="font-display text-3xl font-semibold text-honey-500/40">
                  {b.index}
                </span>
              </div>
              <h3 className="relative z-[1] mt-6 font-display text-xl font-semibold text-text-primary">
                {b.title}
              </h3>
              <p className="relative z-[1] mt-2 text-sm font-medium text-honey-400">
                {b.summary}
              </p>
              <p className="relative z-[1] mt-4 text-sm leading-[1.8] text-text-secondary">
                {b.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
