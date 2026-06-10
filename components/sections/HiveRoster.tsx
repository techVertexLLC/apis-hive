'use client'

import Link from 'next/link'
import { fadeUp } from '@/lib/motion'
import { Reveal, RevealGroup } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { TiltCard } from '@/components/ui/TiltCard'
import { Magnetic } from '@/components/ui/Magnetic'
import { BlinkCursor } from '@/components/ui/BlinkCursor'
import { EMPLOYEES, STAGE_META } from '@/lib/employees'

const HEX_CLIP = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'

export function HiveRoster() {
  return (
    <section id="roster" className="relative border-t border-comb-line py-28">
      <div className="mx-auto w-full max-w-6xl px-6">
        <SectionHeading
          eyebrow="Meet the Hive"
          title="員工名冊"
          description={
            <>
              每一格都是一位 AI 員工（AI employee）。這支 AI
              團隊成員（AI team members）各司其職，我們也坦誠標示每位的成熟度 —
              上線、測試，或還在孵化。將游標移上去看看他們是誰。
            </>
          }
        />

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
              <TiltCard
                as="li"
                key={emp.id}
                variants={fadeUp}
                glow={false}
                max={10}
                className="group relative"
              >
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
                  <span
                    className="relative inline-flex h-9 w-9 items-center justify-center rounded-full font-mono text-[11px] font-semibold tracking-wider"
                    style={{ color: meta.color, backgroundColor: `${meta.color}1f` }}
                  >
                    {emp.abbr}
                  </span>
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

                {/* hover 詳細卡（桌面才顯示；觸控裝置無 hover，改由 /team 提供完整資訊） */}
                <div className="pointer-events-none absolute left-1/2 top-full z-20 hidden w-64 -translate-x-1/2 translate-y-2 rounded-xl border border-comb-line bg-bg-overlay/95 p-4 text-left opacity-0 shadow-2xl shadow-black/60 backdrop-blur-sm transition-all duration-200 group-hover:translate-y-1 group-hover:opacity-100 sm:block">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex h-6 items-center rounded-md px-1.5 font-mono text-[10px] font-semibold tracking-wider"
                      style={{ color: meta.color, backgroundColor: `${meta.color}1f` }}
                    >
                      {emp.abbr}
                    </span>
                    <span className="font-display text-sm font-semibold text-text-primary">
                      {emp.name}
                    </span>
                    <span
                      className="ml-auto inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px]"
                      style={{ color: meta.color, backgroundColor: `${meta.color}1f` }}
                    >
                      {meta.dotLabel}
                      {emp.stage === 'live' && <BlinkCursor />}
                    </span>
                  </div>
                  <p className="mt-2 font-mono text-[11px] text-honey-400">
                    {emp.department} · {emp.phase}
                  </p>
                  <p className="mt-2 text-xs italic leading-[1.8] text-text-secondary">
                    「{emp.personality}」
                  </p>
                  <p className="mt-2 text-xs leading-[1.8] text-text-secondary">{emp.bio}</p>
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
              </TiltCard>
            )
          })}
        </RevealGroup>

        {/* 名冊收尾：手機無 hover 卡，導向 /team 看完整檔案；桌面也提供深入入口 */}
        <Reveal className="mt-12 flex flex-col items-center gap-3 text-center sm:mt-14" delay={0.1}>
          <p className="text-sm text-text-muted sm:hidden">
            在手機上看不到懸停細節？到團隊頁讀每位員工的完整檔案。
          </p>
          <Magnetic strength={0.3}>
            <Link
              href="/team"
              className="group inline-flex items-center gap-2 rounded-full border border-comb-line bg-bg-raised/40 px-6 py-3 text-sm font-medium text-text-primary transition-all duration-300 hover:border-honey-500/40 hover:bg-bg-overlay active:scale-[0.98]"
            >
              查看完整團隊檔案
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  )
}
