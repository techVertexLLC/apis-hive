'use client'

import type { ReactNode } from 'react'
import { RevealGroup, RevealItem, Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { TiltCard } from '@/components/ui/TiltCard'
import { Magnetic } from '@/components/ui/Magnetic'

// 合作的好處（給夥伴的回報）—— icon 用 stroke line icon，杜絕 emoji。
const BENEFITS: { icon: ReactNode; title: string; body: string }[] = [
  {
    title: '全時營運能力',
    body: '一支不打烊的 AI 營運團隊，持續把你的資源變現。',
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2" />
      </>
    ),
  },
  {
    title: '放大既有資源',
    body: '你的通路與產能被快速放大，邊際成本維持在低水位。',
    icon: (
      <>
        <path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
  },
  {
    title: '低風險快驗證',
    body: '快速試、低風險，每筆數據與成效都可追蹤、可檢驗。',
    icon: (
      <>
        <path d="M12 3l7 3v5c0 4.2-2.9 7.7-7 8.8-4.1-1.1-7-4.6-7-8.8V6l7-3Z" />
        <path d="M9 11.5l2 2 4-4" />
      </>
    ),
  },
]

// 兩種夥伴類型。investor 用主色實心 CTA、supplier 用外框 CTA，建立層次。
const PARTNERS = [
  {
    tag: '策略投資人',
    title: '以資源加乘，重新定義邊界',
    body: '我們深信「資源加乘」大於單純資金。期待與具備產業影響力的策略投資人攜手：由您導入通路、客戶、產業人脈與領域專業等落地資源，由 Apis 透過技術將成效無限放大，共同重新定義商業邊界、共享規模化成果。',
    cta: '投資洽談',
    primary: true,
  },
  {
    tag: '供應夥伴',
    title: '低門檻、快驗證、風險可控',
    body: '你有產品與通路，我們有 AI 營運團隊與數據能力。合作門檻低、驗證快、風險可控，讓既有資源以最小的試錯成本快速變現。',
    cta: '成為供應夥伴',
    primary: false,
  },
] as const

const CHIPS = ['通路', '供應鏈', '品牌代理', '策略投資']

export function Partners() {
  return (
    <section id="partners" className="relative border-t border-comb-line py-28">
      <div className="mx-auto w-full max-w-6xl px-6">
        <SectionHeading
          eyebrow="Partners & Investors"
          title={
            <>
              以資源交織算力，
              <br className="hidden sm:block" />
              <span className="text-honey-500">尋找生態系夥伴。</span>
            </>
          }
          description={
            <>
              我們期待與通路、供應鏈及各領域的領航者深度串接。用你的產業底蘊，結合 Apis 24
              小時不打烊的 AI 營運團隊，低風險、高效率地把既有資源快速變現。
            </>
          }
        />

        {/* Section A：合作的好處 —— icon + 文字 grid，hover 有回饋 */}
        <RevealGroup as="ul" className="mt-14 grid gap-6 md:grid-cols-3">
          {BENEFITS.map((b) => (
            <RevealItem
              as="li"
              key={b.title}
              className="group glow-border relative flex flex-col rounded-2xl border border-comb-line bg-bg-raised p-7 transition-all duration-300 hover:-translate-y-1 hover:border-honey-500/40 hover:bg-bg-overlay hover:shadow-xl hover:shadow-honey-500/10"
            >
              <span className="relative z-[1] flex h-12 w-12 items-center justify-center rounded-xl border border-honey-500/40 bg-honey-500/10 text-honey-400 transition-all duration-300 group-hover:scale-105 group-hover:border-honey-500/70 group-hover:bg-honey-500/20">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                  aria-hidden
                >
                  {b.icon}
                </svg>
              </span>
              <h3 className="relative z-[1] mt-5 font-display text-lg font-semibold text-text-primary">
                {b.title}
              </h3>
              <p className="relative z-[1] mt-3 text-sm leading-[1.8] text-text-secondary">
                {b.body}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Section B：兩種夥伴類型 —— 大卡片 side by side（手機 stack） */}
        <RevealGroup as="ul" className="mt-6 grid gap-6 lg:grid-cols-2">
          {PARTNERS.map((p) => (
            <RevealItem as="li" key={p.tag}>
              <TiltCard
                as="div"
                className="glow-border flex h-full flex-col rounded-2xl border border-comb-line bg-bg-raised p-8 transition-colors duration-300 hover:border-honey-500/40"
              >
                <span className="relative z-[1] font-mono text-xs uppercase tracking-[0.2em] text-honey-500">
                  {p.tag}
                </span>
                <h3 className="relative z-[1] mt-4 font-display text-2xl font-semibold text-text-primary">
                  {p.title}
                </h3>
                <p className="relative z-[1] mt-4 flex-1 text-sm leading-[1.8] text-text-secondary">
                  {p.body}
                </p>

                <div className="relative z-[1] mt-7">
                  <Magnetic strength={p.primary ? 0.4 : 0.3}>
                    {p.primary ? (
                      <a
                        href="#"
                        className="cta-shimmer group inline-flex items-center gap-2 rounded-full bg-honey-500 px-6 py-3 text-sm font-semibold text-bg-base shadow-lg shadow-honey-500/20 transition-all duration-300 hover:bg-honey-400 hover:shadow-honey-500/40 active:scale-[0.98]"
                      >
                        <span className="relative z-[2]">{p.cta}</span>
                        <span className="relative z-[2] transition-transform duration-300 group-hover:translate-x-0.5">
                          →
                        </span>
                      </a>
                    ) : (
                      <a
                        href="#"
                        className="group inline-flex items-center gap-2 rounded-full border border-comb-line px-6 py-3 text-sm font-medium text-text-primary transition-all duration-300 hover:border-honey-500/40 hover:bg-bg-overlay active:scale-[0.98]"
                      >
                        <span>{p.cta}</span>
                        <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                          →
                        </span>
                      </a>
                    )}
                  </Magnetic>
                </div>
              </TiltCard>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* 夥伴類型 chips —— subtle 樣式 */}
        <Reveal
          className="mt-10 flex flex-wrap items-center justify-center gap-2.5"
          delay={0.1}
        >
          {CHIPS.map((c) => (
            <span
              key={c}
              className="inline-flex items-center rounded-full border border-comb-line bg-bg-base px-3.5 py-1.5 text-xs text-text-secondary transition-colors duration-300 hover:border-honey-500/40 hover:text-text-primary"
            >
              {c}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
