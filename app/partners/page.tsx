import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { TiltCard } from '@/components/ui/TiltCard'
import { Magnetic } from '@/components/ui/Magnetic'

export const metadata: Metadata = {
  title: '合作夥伴',
  description:
    '以資源交織算力 — Apis 期待與通路、供應鏈與策略投資人深度串接。用你的產業底蘊，結合 24 小時不打烊的 AI 營運團隊，低風險、高效率地把既有資源快速變現。',
  alternates: { canonical: '/partners' },
  openGraph: {
    title: '合作夥伴 — Apis Hive',
    description:
      '以資源交織算力 — 與通路、供應鏈與策略投資人深度串接，用 AI 營運團隊把既有資源快速變現。',
    url: '/partners',
  },
}

// 合作的好處（給夥伴的回報）—— icon 用 stroke line icon，杜絕 emoji。
const BENEFITS: { icon: ReactNode; title: string; body: string }[] = [
  {
    title: '全時營運能力',
    body: '一支不打烊的 AI 營運團隊，七天二十四小時持續把你的資源變現。',
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2" />
      </>
    ),
  },
  {
    title: '放大既有資源',
    body: '你的通路與產能被快速放大，邊際成本維持在低水位、隨需擴張。',
    icon: (
      <>
        <path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
  },
  {
    title: '低風險快驗證',
    body: '快速試、低風險，每筆數據與成效都可追蹤、可檢驗、可隨時收斂。',
    icon: (
      <>
        <path d="M12 3l7 3v5c0 4.2-2.9 7.7-7 8.8-4.1-1.1-7-4.6-7-8.8V6l7-3Z" />
        <path d="M9 11.5l2 2 4-4" />
      </>
    ),
  },
]

// 兩種夥伴類型
const PARTNERS = [
  {
    tag: '策略投資人',
    title: '以資源加乘，重新定義邊界',
    body: '我們深信「資源加乘」大於單純資金。期待與具備產業影響力的策略投資人攜手：由您導入通路、客戶、產業人脈與領域專業等落地資源，由 Apis 透過技術將成效無限放大，共同重新定義商業邊界、共享規模化成果。',
    points: ['導入通路、客戶與產業人脈', '完全可觀測的營運數據與稽核', '隨產出成長、共享規模化回報'],
    cta: '投資洽談',
    primary: true,
  },
  {
    tag: '供應夥伴',
    title: '低門檻、快驗證、風險可控',
    body: '你有產品與通路，我們有 AI 營運團隊與數據能力。合作門檻低、驗證快、風險可控，讓既有資源以最小的試錯成本快速變現。',
    points: ['標準化 API 串接、隨插即用', '產品、報價到售後全程自動化', '最小試錯成本、快速放大產能'],
    cta: '成為供應夥伴',
    primary: false,
  },
] as const

// 合作流程四步驟
const FLOW = [
  {
    step: '01',
    title: '洽談',
    body: '對齊目標與資源邊界 — 你帶來通路、產品或資本，我們帶來 AI 營運團隊。先把彼此能放大的點談清楚。',
  },
  {
    step: '02',
    title: '評估',
    body: '盤點可串接的資源與數據，畫出第一版合作藍圖與可量化的成效指標，劃定護欄與最終核准的邊界。',
  },
  {
    step: '03',
    title: '試跑',
    body: '以最小範圍上線一條業務線，AI 員工開始實際運轉。每筆數據可追蹤、可檢驗，用真實成效驗證模型。',
  },
  {
    step: '04',
    title: '規模化',
    body: '驗證可靠後固化流程、複製到更多通路與品類。產能隨運算放大，回報隨產出共享。',
  },
] as const

// 常見合作問題
const FAQ = [
  {
    q: '合作的最小規模是什麼？',
    a: '我們刻意把門檻壓低 — 可以從單一品類或單一通路的試跑開始。先用最小範圍驗證成效，確認模型可行後再逐步放大，避免一次性的大額投入。',
  },
  {
    q: 'AI 員工會不會出錯、誰來把關？',
    a: '所有涉及資金與對外操作的關鍵邊界，皆由真人進行最終核准 — AI 執行、人類把關。整個營運過程完全可觀測，你能隨時深度稽核每一筆數據。',
  },
  {
    q: '需要提供哪些資源才能開始？',
    a: '依夥伴類型而定。供應夥伴通常提供產品、產能與通路；策略投資人則導入資本、客戶與產業人脈。供應鏈以標準化 API 串接，串接完成即可隨插即用。',
  },
  {
    q: '成效如何衡量、回報怎麼分配？',
    a: '每條業務線都有可量化的成效指標與單位經濟模型。我們提供完全透明的營運帳本，回報隨整座蜂巢的產出成長，由所有夥伴共享。',
  },
] as const

export default function PartnersPage() {
  return (
    <main className="relative">
      {/* 頁首 — 品牌故事性的合作願景 */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(245,166,35,0.12),transparent)]" />
        <div className="relative mx-auto w-full max-w-4xl px-6 pb-12 pt-24">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-honey-500">
              Partners & Investors
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-text-primary sm:text-5xl">
              以資源交織算力，
              <br />
              <span className="text-honey-500">尋找生態系夥伴。</span>
            </h1>
          </Reveal>
          <Reveal className="mt-7 max-w-3xl space-y-5 text-lg leading-[1.8] text-text-secondary" delay={0.1}>
            <p>
              我們把公司想成一座蜂箱：AI 員工是蜜蜂、投資人是蜂農、供應夥伴是花田。蜂箱要長大，靠的不只是資金，而是更肥沃的花田與更多願意一起採收的夥伴。
            </p>
            <p>
              我們期待與通路、供應鏈及各領域的領航者深度串接。用你的產業底蘊，結合 Apis 24
              小時不打烊的 AI 營運團隊，低風險、高效率地把既有資源快速變現，共享規模化成果。
            </p>
          </Reveal>
        </div>
      </section>

      {/* 合作的好處 */}
      <section className="relative border-t border-comb-line py-24">
        <div className="mx-auto w-full max-w-6xl px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
              和蜂巢合作，你得到什麼
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-[1.8] text-text-secondary">
              不是又一個外包團隊，而是一套能自我運轉、隨需擴張的營運系統。
            </p>
          </Reveal>

          <RevealGroup as="ul" className="mt-12 grid gap-6 md:grid-cols-3">
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
        </div>
      </section>

      {/* 夥伴類型 */}
      <section className="relative border-t border-comb-line py-24">
        <div className="mx-auto w-full max-w-6xl px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
              兩種夥伴，一座蜂巢
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-[1.8] text-text-secondary">
              無論你帶來資本還是產能，我們都有對接的方式。
            </p>
          </Reveal>

          <RevealGroup as="ul" className="mt-12 grid gap-6 lg:grid-cols-2">
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
                  <p className="relative z-[1] mt-4 text-sm leading-[1.8] text-text-secondary">
                    {p.body}
                  </p>

                  <ul className="relative z-[1] mt-6 space-y-2.5">
                    {p.points.map((pt) => (
                      <li
                        key={pt}
                        className="flex items-start gap-2.5 text-sm text-text-secondary"
                      >
                        <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-honey-500" />
                        {pt}
                      </li>
                    ))}
                  </ul>

                  <div className="relative z-[1] mt-7 flex-1" />
                  <div className="relative z-[1]">
                    <Magnetic strength={p.primary ? 0.4 : 0.3}>
                      {p.primary ? (
                        <Link
                          href="/about"
                          className="cta-shimmer group inline-flex items-center gap-2 rounded-full bg-honey-500 px-6 py-3 text-sm font-semibold text-bg-base shadow-lg shadow-honey-500/20 transition-all duration-300 hover:bg-honey-400 hover:shadow-honey-500/40 active:scale-[0.98]"
                        >
                          <span className="relative z-[2]">{p.cta}</span>
                          <span className="relative z-[2] transition-transform duration-300 group-hover:translate-x-0.5">
                            →
                          </span>
                        </Link>
                      ) : (
                        <Link
                          href="/about"
                          className="group inline-flex items-center gap-2 rounded-full border border-comb-line px-6 py-3 text-sm font-medium text-text-primary transition-all duration-300 hover:border-honey-500/40 hover:bg-bg-overlay active:scale-[0.98]"
                        >
                          <span>{p.cta}</span>
                          <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                            →
                          </span>
                        </Link>
                      )}
                    </Magnetic>
                  </div>
                </TiltCard>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* 合作流程 */}
      <section className="relative border-t border-comb-line py-24">
        <div className="mx-auto w-full max-w-6xl px-6">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-honey-500">
              How We Work Together
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
              四步驟，從洽談到規模化
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-[1.8] text-text-secondary">
              我們刻意把每一步都做得可驗證、可收斂 — 先證明它能跑，再把它放大。
            </p>
          </Reveal>

          <RevealGroup as="ul" className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FLOW.map((f, i) => (
              <RevealItem
                as="li"
                key={f.step}
                className="group relative flex flex-col rounded-2xl border border-comb-line bg-bg-raised p-6 transition-all duration-300 hover:-translate-y-1 hover:border-honey-500/40 hover:shadow-lg hover:shadow-honey-500/10"
              >
                <span className="font-mono text-3xl font-semibold text-honey-500/40">
                  {f.step}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-text-primary">
                  {f.title}
                </h3>
                <p className="mt-3 text-sm leading-[1.8] text-text-secondary">
                  {f.body}
                </p>
                {/* 步驟之間的箭頭（桌面） */}
                {i < FLOW.length - 1 && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-3 top-1/2 hidden -translate-y-1/2 text-honey-500/50 lg:block"
                  >
                    →
                  </span>
                )}
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative border-t border-comb-line py-24">
        <div className="mx-auto w-full max-w-4xl px-6">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-honey-500">
              FAQ
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
              常見合作問題
            </h2>
          </Reveal>

          <RevealGroup as="ul" className="mt-12 flex flex-col gap-4">
            {FAQ.map((item) => (
              <RevealItem
                as="li"
                key={item.q}
                className="rounded-2xl border border-comb-line bg-bg-raised p-7 transition-colors duration-300 hover:border-honey-500/40"
              >
                <h3 className="font-display text-lg font-semibold text-text-primary">
                  {item.q}
                </h3>
                <p className="mt-3 text-sm leading-[1.8] text-text-secondary">
                  {item.a}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-comb-line">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-80 bg-[radial-gradient(60%_100%_at_50%_100%,rgba(245,166,35,0.14),transparent)]" />
        <div className="relative mx-auto w-full max-w-4xl px-6 py-28 text-center">
          <SectionHeading
            align="center"
            title={
              <>
                一起把花田種大。
              </>
            }
            titleClassName="mx-auto max-w-3xl !text-4xl !leading-[1.15] sm:!text-5xl"
            description={
              <>
                無論你帶來通路、產能還是資本，蜂巢都準備好把它放大。先了解我們怎麼運轉，再決定怎麼一起採收。
              </>
            }
            descriptionClassName="mx-auto max-w-xl"
          />

          <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-4" delay={0.1}>
            <Magnetic strength={0.4}>
              <Link
                href="/about"
                className="cta-shimmer group inline-flex items-center gap-2 rounded-full bg-honey-500 px-7 py-3 text-sm font-semibold text-bg-base shadow-lg shadow-honey-500/20 transition-all duration-300 hover:bg-honey-400 hover:shadow-honey-500/40 active:scale-[0.98]"
              >
                <span className="relative z-[2]">了解蜂巢怎麼運轉</span>
                <span className="relative z-[2] transition-transform duration-300 group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </Magnetic>
            <Magnetic strength={0.3}>
              <Link
                href="/activity"
                className="inline-flex items-center gap-2 rounded-full border border-comb-line px-7 py-3 text-sm font-medium text-text-primary transition-all duration-300 hover:border-honey-500/40 hover:bg-bg-overlay active:scale-[0.98]"
              >
                看即時營運動態
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
