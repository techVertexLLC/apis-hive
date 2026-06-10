'use client'

import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { EMPLOYEES, STAGE_META } from '@/lib/employees'

const HEX_CLIP = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'

export function HiveRoster() {
  return (
    <section id="roster" className="relative border-t border-comb-line py-28">
      <div className="mx-auto w-full max-w-6xl px-6">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-honey-500">
            Meet the Hive
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            員工名冊
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-secondary">
            每一格是一位 AI
            員工。我們坦誠標示每位的成熟度 — 上線、測試，或還在孵化。將游標移上去看看他們是誰。
          </p>
        </Reveal>

        {/* 狀態圖例 */}
        <Reveal className="mt-6 flex flex-wrap gap-x-5 gap-y-2" delay={0.1}>
          {Object.entries(STAGE_META).map(([key, meta]) => (
            <span key={key} className="inline-flex items-center gap-2 font-mono text-xs text-text-muted">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: meta.color }}
              />
              {meta.dotLabel} · {meta.label}
            </span>
          ))}
        </Reveal>

        <RevealGroup
          as="ul"
          className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-5"
        >
          {EMPLOYEES.map((emp) => {
            const meta = STAGE_META[emp.stage]
            return (
              <RevealItem as="li" key={emp.id} className="group relative">
                {/* 六邊形 cell */}
                <div
                  className="relative mx-auto flex aspect-[1/1.12] w-full max-w-[150px] flex-col items-center justify-center gap-1.5 bg-bg-raised text-center transition-transform duration-300 ease-out group-hover:-translate-y-1"
                  style={{ clipPath: HEX_CLIP }}
                >
                  {/* 內層邊框感 */}
                  <div
                    className="absolute inset-[1.5px] bg-bg-base transition-colors duration-300 group-hover:bg-bg-overlay"
                    style={{ clipPath: HEX_CLIP }}
                  />
                  <span className="relative text-3xl">{emp.emoji}</span>
                  <span className="relative font-display text-base font-semibold text-text-primary">
                    {emp.name}
                  </span>
                  <span className="relative px-2 text-[11px] leading-tight text-text-secondary">
                    {emp.role}
                  </span>
                  <span className="relative mt-0.5 inline-flex items-center gap-1.5 font-mono text-[10px] text-text-muted">
                    <span
                      className={`inline-block h-1.5 w-1.5 rounded-full ${emp.stage === 'live' ? 'hive-breathe' : ''}`}
                      style={{ backgroundColor: meta.color }}
                    />
                    {meta.dotLabel}
                  </span>
                </div>

                {/* hover 詳細卡 */}
                <div className="pointer-events-none absolute left-1/2 top-full z-20 w-64 -translate-x-1/2 translate-y-2 rounded-xl border border-comb-line bg-bg-overlay/95 p-4 text-left opacity-0 shadow-2xl shadow-black/60 backdrop-blur-sm transition-all duration-200 group-hover:translate-y-1 group-hover:opacity-100">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{emp.emoji}</span>
                    <span className="font-display text-sm font-semibold text-text-primary">
                      {emp.name}
                    </span>
                    <span
                      className="ml-auto rounded-full px-2 py-0.5 font-mono text-[10px]"
                      style={{ color: meta.color, backgroundColor: `${meta.color}1f` }}
                    >
                      {meta.dotLabel}
                    </span>
                  </div>
                  <p className="mt-2 font-mono text-[11px] text-honey-400">
                    {emp.department} · {emp.phase}
                  </p>
                  <p className="mt-2 text-xs italic leading-relaxed text-text-secondary">
                    「{emp.personality}」
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-text-secondary">{emp.bio}</p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {emp.focus.map((f) => (
                      <li
                        key={f}
                        className="rounded-md border border-comb-line px-2 py-0.5 font-mono text-[10px] text-text-muted"
                      >
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealItem>
            )
          })}
        </RevealGroup>
      </div>
    </section>
  )
}
