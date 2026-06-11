'use client'

import Link from 'next/link'
import { fadeUp } from '@/lib/motion'
import { Reveal, RevealGroup } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { TiltCard } from '@/components/ui/TiltCard'
import { Magnetic } from '@/components/ui/Magnetic'
import { STAGE_META } from '@/lib/employees'
import { ACTIVE } from '@/lib/activity'

// 首頁只露出 6 位正在運作的員工（上線 + 測試），完整名冊在 /team。
const PREVIEW = ACTIVE.slice(0, 6)

/** 首頁員工預覽 —— 6 張小卡，導向 /team 看完整團隊。 */
export function EmployeePreview() {
  return (
    <section id="roster" className="relative border-t border-comb-line py-28">
      <div className="mx-auto w-full max-w-6xl px-6">
        <SectionHeading
          eyebrow="Meet the Hive"
          title="正在運作的員工。"
          description={
            <>
              這是蜂巢裡每天都在跑任務的 AI
              員工。各司其職，從不下班 —— 這裡先露出幾位，完整名冊與每位的檔案在團隊頁。
            </>
          }
        />

        <RevealGroup
          as="ul"
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {PREVIEW.map((emp) => {
            const meta = STAGE_META[emp.stage]
            return (
              <TiltCard
                as="li"
                key={emp.id}
                variants={fadeUp}
                className="flex h-full flex-col rounded-2xl border border-comb-line bg-bg-raised p-6 transition-colors duration-300 hover:border-honey-500/40"
              >
                <div className="relative z-[1] flex items-start gap-3">
                  <span
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold tracking-wider"
                    style={{ color: meta.color, backgroundColor: `${meta.color}1f` }}
                  >
                    {emp.abbr}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-lg font-semibold leading-tight text-text-primary">
                      {emp.name}
                    </h3>
                    <p className="mt-0.5 text-sm text-text-secondary">{emp.role}</p>
                  </div>
                  <span
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px]"
                    style={{ color: meta.color, backgroundColor: `${meta.color}1f` }}
                  >
                    <span
                      className={`inline-block h-1.5 w-1.5 rounded-full ${emp.stage === 'live' ? 'hive-breathe' : ''}`}
                      style={{ backgroundColor: meta.color }}
                    />
                    {meta.dotLabel}
                  </span>
                </div>

                <p className="relative z-[1] mt-4 text-sm italic leading-[1.8] text-text-secondary">
                  「{emp.personality}」
                </p>
              </TiltCard>
            )
          })}
        </RevealGroup>

        <Reveal className="mt-12 flex justify-center" delay={0.1}>
          <Magnetic strength={0.3}>
            <Link
              href="/team"
              className="group inline-flex items-center gap-2 rounded-full border border-comb-line bg-bg-raised/40 px-6 py-3 text-sm font-medium text-text-primary transition-all duration-300 hover:border-honey-500/40 hover:bg-bg-overlay active:scale-[0.98]"
            >
              認識完整團隊
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  )
}
