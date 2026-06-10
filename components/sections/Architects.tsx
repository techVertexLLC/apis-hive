'use client'

import { RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ARCHITECTS } from '@/lib/employees'

export function Architects() {
  return (
    <section id="architects" className="relative border-t border-comb-line py-28">
      <div className="mx-auto w-full max-w-5xl px-6">
        <SectionHeading
          eyebrow="The Two Architects"
          title="蜂巢之上，是兩個人。"
          description={
            <>
              AI 員工負責執行，但方向與邊界由人類決定。在這個由 AI
              運轉的公司裡，這兩位是它的良知與意志。
            </>
          }
        />

        <RevealGroup as="ul" className="mt-14 grid gap-6 sm:grid-cols-2">
          {ARCHITECTS.map((person) => (
            <RevealItem
              as="li"
              key={person.id}
              className="group glow-border relative flex flex-col rounded-2xl border border-comb-line bg-bg-raised p-8 transition-all duration-300 hover:-translate-y-1 hover:border-honey-500/40 hover:shadow-xl hover:shadow-honey-500/10"
            >
              <div className="relative z-[1] flex h-14 w-14 items-center justify-center rounded-full border border-honey-500/40 bg-honey-500/10 font-display text-xl font-semibold text-honey-400 transition-all duration-300 group-hover:scale-105 group-hover:border-honey-500/70 group-hover:bg-honey-500/20">
                {person.id === 'ceo' ? 'C' : 'T'}
              </div>
              <h3 className="relative z-[1] mt-5 font-display text-xl font-semibold text-text-primary">
                {person.name}
              </h3>
              <p className="relative z-[1] mt-1 font-mono text-sm text-honey-400">{person.role}</p>
              <p className="relative z-[1] mt-4 text-sm leading-[1.8] text-text-secondary">{person.bio}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
