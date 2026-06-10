'use client'

import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'

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
  return (
    <section id="how" className="relative border-t border-comb-line py-28">
      <div className="mx-auto w-full max-w-6xl px-6">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-honey-500">
            How the Hive Works
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            三個信念，撐起一座蜂巢。
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-secondary">
            這座蜂巢的 AI 驅動營運（AI-powered
            operations）建立在三個原則上：人類負責設計、AI
            負責執行，以人機協作（human-AI collaboration）取代傳統的層層人力。
          </p>
        </Reveal>

        <RevealGroup
          as="ul"
          className="mt-14 grid gap-6 md:grid-cols-3"
        >
          {BELIEFS.map((b) => (
            <RevealItem
              as="li"
              key={b.index}
              className="group relative flex flex-col rounded-2xl border border-comb-line bg-bg-raised p-7 transition-all duration-300 hover:-translate-y-1 hover:border-honey-500/40 hover:bg-bg-overlay hover:shadow-xl hover:shadow-honey-500/10"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-3xl font-semibold text-honey-500/40">
                  {b.index}
                </span>
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold text-text-primary">
                {b.title}
              </h3>
              <p className="mt-2 text-sm font-medium text-honey-400">{b.summary}</p>
              <p className="mt-4 text-sm leading-relaxed text-text-secondary">{b.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
