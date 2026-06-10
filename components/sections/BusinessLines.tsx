'use client'

import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { EMPLOYEES, STAGE_META } from '@/lib/employees'

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
  return (
    <section id="business" className="relative border-t border-comb-line py-28">
      <div className="mx-auto w-full max-w-6xl px-6">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-honey-500">
            Two Business Lines
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            同一座蜂巢，兩條業務線。
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-secondary">
            分銷與軟體看似無關，卻共用同一群 AI
            員工與同一套營運系統。蜂巢的能力，可以同時飛向不同的花田。
          </p>
        </Reveal>

        <RevealGroup as="ul" className="mt-14 grid gap-6 lg:grid-cols-2">
          {LINES.map((line) => {
            const crew = EMPLOYEES.filter((e) => e.line === line.key)
            return (
              <RevealItem
                as="li"
                key={line.key}
                className="flex flex-col rounded-2xl border border-comb-line bg-bg-raised p-8 transition-all duration-300 hover:-translate-y-1 hover:border-honey-500/40 hover:shadow-xl hover:shadow-honey-500/10"
              >
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-honey-500">
                  {line.tag}
                </span>
                <h3 className="mt-4 font-display text-2xl font-semibold text-text-primary">
                  {line.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-text-secondary">{line.body}</p>

                <ul className="mt-6 space-y-2.5">
                  {line.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-text-secondary">
                      <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-honey-500" />
                      {p}
                    </li>
                  ))}
                </ul>

                {/* 負責的員工 */}
                <div className="mt-7 flex flex-wrap items-center gap-2 border-t border-comb-line pt-5">
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
              </RevealItem>
            )
          })}
        </RevealGroup>
      </div>
    </section>
  )
}
