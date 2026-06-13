'use client'

import { useEffect, useState } from 'react'
import { Reveal } from '@/components/ui/Reveal'

/* ============================================================
   ProjectStats — 真實 token / 成本 dashboard
   資料來源：/stats.json（VM cron 由 ops/scripts/project-stats.py 產生）
   ============================================================ */

type Row = { name: string; tokens: number; costUsd: number; costTwd: number }
type Stats = {
  generatedAt: string
  totals: { tokens: number; costUsd: number; costTwd: number }
  today: { tokens: number; costUsd: number; costTwd: number }
  byProject: Row[]
  byAgent: Row[]
  byProvider: Row[]
  byModel: Row[]
  tasksByProject: { project: string; tasks: number }[]
  note: string
}

function fmtTok(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return `${n}`
}

function Bars({ rows }: { rows: Row[] }) {
  const max = Math.max(1, ...rows.map((r) => r.tokens))
  return (
    <div className="flex flex-col gap-3">
      {rows.map((r) => (
        <div key={r.name}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate text-text-primary">{r.name}</span>
            <span className="shrink-0 font-mono text-xs text-text-secondary">
              {fmtTok(r.tokens)} tok · ${r.costUsd.toFixed(2)} · NT${r.costTwd.toLocaleString()}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-honey-600 to-honey-400"
              style={{ width: `${Math.max(2, (r.tokens / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-honey-500">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold text-text-primary">{value}</p>
      <p className="mt-1 text-sm text-text-secondary">{sub}</p>
    </div>
  )
}

export function ProjectStats() {
  const [s, setS] = useState<Stats | null>(null)
  const [err, setErr] = useState(false)

  useEffect(() => {
    fetch('/stats.json', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setS)
      .catch(() => setErr(true))
  }, [])

  if (err) return null
  if (!s)
    return (
      <div className="mx-auto w-full max-w-5xl px-6">
        <div className="h-40 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
      </div>
    )

  const when = new Date(s.generatedAt).toLocaleString('zh-TW', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <section className="mx-auto w-full max-w-5xl px-6 pb-16">
      <Reveal>
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-text-primary">
            算力帳本
          </h2>
          <span className="font-mono text-xs text-text-secondary">更新 {when}</span>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Stat
            label="累計 Token"
            value={fmtTok(s.totals.tokens)}
            sub={`$${s.totals.costUsd.toFixed(2)} · 約 NT$${s.totals.costTwd.toLocaleString()}`}
          />
          <Stat
            label="今日 Token"
            value={fmtTok(s.today.tokens)}
            sub={`$${s.today.costUsd.toFixed(2)} · 約 NT$${s.today.costTwd.toLocaleString()}`}
          />
          <Stat
            label="估算總成本"
            value={`NT$${s.totals.costTwd.toLocaleString()}`}
            sub={`$${s.totals.costUsd.toFixed(2)} USD 累計`}
          />
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-honey-500">
              依專案 · Token
            </h3>
            <Bars rows={s.byProject} />
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-honey-500">
              依員工 · Token
            </h3>
            <Bars rows={s.byAgent} />
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-honey-500">
              依供應商
            </h3>
            <Bars rows={s.byProvider} />
          </div>
          {s.tasksByProject.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-honey-500">
                派工數 · 依專案
              </h3>
              <div className="flex flex-col gap-2">
                {s.tasksByProject.map((t) => (
                  <div
                    key={t.project}
                    className="flex items-baseline justify-between gap-3 text-sm"
                  >
                    <span className="truncate text-text-primary">{t.project}</span>
                    <span className="shrink-0 font-mono text-honey-400">{t.tasks}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Reveal>

      <Reveal delay={0.25}>
        <p className="mt-5 text-xs leading-relaxed text-text-secondary/70">{s.note}</p>
      </Reveal>
    </section>
  )
}
