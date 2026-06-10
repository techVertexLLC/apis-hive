import type { Metadata } from 'next'
import Link from 'next/link'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { EMPLOYEE_COUNT } from '@/lib/employees'

export const metadata: Metadata = {
  title: '關於 Apis',
  description:
    '兩個人、一支 AI 團隊、一家公司。Apis 把公司想成一座蜂箱 — 公司是結構，AI 員工是蜜蜂，投資人是蜂農，供應夥伴是花田，產出是蜂蜜。這是我們對組織與系統設計的核心信念。',
  alternates: { canonical: '/about' },
  openGraph: {
    title: '關於 Apis — Apis Hive',
    description:
      '兩個人、一支 AI 團隊、一家公司。Apis 把公司想成一座蜂箱：護欄、可視、標準對接，是我們的核心信念。',
    url: '/about',
  },
}

// 蜂箱模型 — 整合自舊站 concept.html
const HIVE_MODEL = [
  {
    en: 'The Hive',
    zh: '蜂箱',
    term: '公司本身',
    def: '制度、流程與系統 — 讓一群蜜蜂能穩定協作、24 小時運轉的結構。',
  },
  {
    en: 'The Bees',
    zh: '蜜蜂',
    term: 'AI 員工',
    def: '客服、文案、選品、供應鏈、財務… 每一隻 agent 各司其職，把工作做完。',
  },
  {
    en: 'The Beekeeper',
    zh: '蜂農',
    term: '投資人',
    def: '提供長期資本、與我們一起把蜂箱養大；隨產出成長，分享回報。',
  },
  {
    en: 'The Flowers',
    zh: '花田',
    term: '供應夥伴',
    def: '能以 API 串接的供應鏈工廠與供應商 — 提供產能與貨源，給蜜蜂採集、加工、賣出。',
  },
  {
    en: 'The Honey',
    zh: '蜂蜜',
    term: '產出與營收',
    def: '整座蜂箱運轉後留下的成果，由所有夥伴共享。',
  },
] as const

// 商業本質的三大堅持
const PRINCIPLES = [
  {
    title: '設有護欄',
    body: '涉及資金與對外操作的關鍵邊界，皆須由真人進行最終核准。AI 執行，人類把關。',
  },
  {
    title: '全面可視',
    body: '為投資人提供完全可觀測、可隨時深度稽核的營運數據。透明是信任的基礎。',
  },
  {
    title: '標準對接',
    body: '供應鏈全面採標準化 API 串接，產能與貨源隨插即用、無限擴充。',
  },
] as const

// 三大信念展開版
const BELIEFS = [
  {
    label: '01',
    title: '燒 token 不燒人頭',
    body: '我們用運算取代擴編。要放大產能，不是再招一個人，而是讓 AI 員工多跑一輪任務。成本是可計量的 token，而不是無法回收的人事費 — 規模可以一夜翻倍，也能在淡季瞬間收斂。',
  },
  {
    label: '02',
    title: '人是架構師，AI 是員工',
    body: '方向、邊界與最終裁決權留在人手上；執行、重複與規模化交給 AI。兩位架構師決定蜂巢往哪裡飛、劃定每位 AI 員工的權責，AI 則在護欄內自主把事情做完。',
  },
  {
    label: '03',
    title: '先驗證再硬化',
    body: '每位 AI 員工都從孵化、測試，再到上線，逐步交付真實成果後才固化流程。我們坦誠標示每位的成熟度，不假裝一切都已完美 — 先證明它能跑，再把它變成基礎設施。',
  },
] as const

export default function AboutPage() {
  return (
    <main className="relative">
      {/* Section 1 — 公司介紹 */}
      <section className="relative overflow-hidden">
        {/* 頂部琥珀光暈 */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(245,166,35,0.12),transparent)]" />
        <div className="relative mx-auto w-full max-w-4xl px-6 py-24">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-honey-500">
              About Apis
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-text-primary sm:text-5xl">
              兩個人、一支 AI 團隊、
              <br />
              <span className="text-honey-500">一家公司。</span>
            </h1>
          </Reveal>
          <Reveal className="mt-7 max-w-3xl space-y-5 text-lg leading-[1.8] text-text-secondary" delay={0.1}>
            <p>
              「Apis」在拉丁文意指蜜蜂。Apis 是一家 AI-native
              公司：沒有龐大的人力編制，只有兩位人類架構師，與一群從不下班的 AI 員工。
            </p>
            <p>
              人類負責決定方向、定義問題、劃定權責邊界；{EMPLOYEE_COUNT} 位 AI
              員工負責執行 — 從營運調度、產品開發、前端工程，到分銷業務與客戶成功。整家公司像一座蜂巢，冷靜的是基礎設施，溫熱的是裡面持續活動的生命。
            </p>
          </Reveal>
        </div>
      </section>

      {/* Section 2 — 蜂箱模型 + 商業本質 */}
      <section className="relative border-t border-comb-line py-24">
        <div className="mx-auto w-full max-w-5xl px-6">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-honey-500">
              The Hive Model
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
              蜂箱模型
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-[1.8] text-text-secondary">
              這不是行銷包裝，而是一張去中心化組織的運作架構圖。它用最直白的方式，定錨了出力者、出資者、供料者與利潤共享的邊界。
            </p>
          </Reveal>

          <RevealGroup as="ul" className="mt-12 flex flex-col gap-3">
            {HIVE_MODEL.map((row) => (
              <RevealItem
                as="li"
                key={row.en}
                className="grid grid-cols-1 gap-2 rounded-2xl border border-comb-line bg-bg-raised p-6 transition-all duration-300 hover:border-honey-500/40 hover:bg-bg-overlay hover:shadow-lg hover:shadow-honey-500/10 sm:grid-cols-[220px_1fr] sm:gap-6"
              >
                <div>
                  <p className="font-display text-xl font-semibold leading-tight text-text-primary">
                    {row.en}
                  </p>
                  <p className="mt-1 font-mono text-sm text-honey-400">{row.zh}</p>
                </div>
                <p className="text-base leading-[1.8] text-text-secondary">
                  <span className="font-semibold text-text-primary">{row.term}。</span>
                  {row.def}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>

          {/* 商業本質：三大堅持 */}
          <Reveal className="mt-16">
            <h3 className="font-display text-2xl font-semibold tracking-tight text-text-primary">
              商業本質
            </h3>
            <p className="mt-3 max-w-2xl text-base leading-[1.8] text-text-secondary">
              這座蜂箱模型代表了我們對系統設計的三大核心堅持：
            </p>
          </Reveal>

          <RevealGroup as="ul" className="mt-8 grid gap-5 sm:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <RevealItem
                as="li"
                key={p.title}
                className="rounded-2xl border border-comb-line border-t-2 border-t-honey-500 bg-bg-raised p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-honey-500/10"
              >
                <h4 className="font-display text-lg font-semibold text-text-primary">
                  {p.title}
                </h4>
                <p className="mt-3 text-sm leading-[1.8] text-text-secondary">{p.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Section 3 — 三大信念展開版 */}
      <section className="relative border-t border-comb-line py-24">
        <div className="mx-auto w-full max-w-5xl px-6">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-honey-500">
              How the Hive Works
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
              三大信念
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-[1.8] text-text-secondary">
              這些不是口號，而是我們每天做決策的依據。
            </p>
          </Reveal>

          <RevealGroup as="ul" className="mt-12 flex flex-col gap-5">
            {BELIEFS.map((b) => (
              <RevealItem
                as="li"
                key={b.label}
                className="grid grid-cols-1 gap-4 rounded-2xl border border-comb-line bg-bg-raised p-8 sm:grid-cols-[auto_1fr] sm:gap-8"
              >
                <span className="font-mono text-3xl font-semibold text-honey-500/60">
                  {b.label}
                </span>
                <div>
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-text-primary">
                    {b.title}
                  </h3>
                  <p className="mt-3 max-w-2xl text-base leading-[1.8] text-text-secondary">
                    {b.body}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Section 4 — Build the Hive, Fertile the Field */}
      <section className="relative overflow-hidden border-t border-comb-line">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-80 bg-[radial-gradient(60%_100%_at_50%_100%,rgba(245,166,35,0.14),transparent)]" />
        <div className="relative mx-auto w-full max-w-4xl px-6 py-28 text-center">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-honey-500">
              The Vision
            </p>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-text-primary sm:text-5xl">
              Build the Hive
              <br />
              <span className="text-honey-500">Fertile the Field</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-[1.8] text-text-secondary">
              建造蜂箱，肥沃花田。我們把公司做成一套能自我運轉的系統，也讓每一個供應夥伴、每一位投資人，都能在這片花田裡共同採收。
            </p>
          </Reveal>

          <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-4" delay={0.1}>
            <a
              href="#"
              className="group inline-flex items-center gap-2 rounded-full bg-honey-500 px-7 py-3 text-sm font-semibold text-bg-base shadow-lg shadow-honey-500/20 transition-all duration-300 hover:scale-[1.03] hover:bg-honey-400 hover:shadow-honey-500/40 active:scale-[0.98]"
            >
              一起建造蜂箱
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </a>
            <Link
              href="/team"
              className="inline-flex items-center gap-2 rounded-full border border-comb-line px-7 py-3 text-sm font-medium text-text-primary transition-all duration-300 hover:scale-[1.03] hover:border-honey-500/40 hover:bg-bg-overlay active:scale-[0.98]"
            >
              認識 AI 員工
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
