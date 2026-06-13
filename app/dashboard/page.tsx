'use client'

import { useEffect, useState } from 'react'
import './dashboard.css'

/* ============================================================
   Apis Hive — 內部私密財務 Dashboard
   存取由 Caddy basicauth 於 server 端保護（無 client-side 密碼）。
   資料來源：/metrics-full.json（含完整金額，Caddy 保護）
   ============================================================ */

type Row = {
  name: string
  tokens: number
  costUsd: number
  costTwd: number
}
type LedgerRow = {
  name: string
  tokens: number
  costUsd: number
  costTwd: number
  tasks: number
}
type TaskRow = { project: string; tasks: number }
type Money = { tokens: number; costUsd: number; costTwd: number }
type Metrics = {
  generatedAt: string
  totals: Money
  today: Money
  byProject: Row[]
  byProjectLedger: LedgerRow[]
  byAgent: Row[]
  byProvider: Row[]
  byModel: Row[]
  tasksByProject: TaskRow[]
  note: string
}

function fmtTok(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return `${n}`
}
function fmtUsd(n: number): string {
  return `$${(n ?? 0).toFixed(2)}`
}
function fmtTwd(n: number): string {
  return `NT$${Math.round(n ?? 0).toLocaleString()}`
}

function KpiCard({
  label,
  tokens,
  usd,
  twd,
}: {
  label: string
  tokens: number
  usd: number
  twd: number
}) {
  return (
    <div className="fin-kpi">
      <div className="fin-kpi-label mono">{label}</div>
      <div className="fin-kpi-tok display">{fmtTok(tokens)}</div>
      <div className="fin-kpi-tok-unit">tokens</div>
      <div className="fin-kpi-money">
        <span className="fin-usd mono">{fmtUsd(usd)}</span>
        <span className="fin-twd mono">{fmtTwd(twd)}</span>
      </div>
    </div>
  )
}

function MoneyBars({ rows }: { rows: Row[] }) {
  const max = Math.max(1, ...rows.map((r) => r.tokens))
  if (!rows.length) return <div className="fin-empty">尚無資料</div>
  return (
    <div className="fin-bars">
      {rows.map((r) => (
        <div key={r.name} className="fin-bar-row">
          <div className="fin-bar-head">
            <span className="fin-bar-name">{r.name}</span>
            <span className="fin-bar-val mono">
              {fmtTok(r.tokens)} tok · {fmtUsd(r.costUsd)} · {fmtTwd(r.costTwd)}
            </span>
          </div>
          <div className="fin-bar-track">
            <span
              className="fin-bar-fill"
              style={{ width: `${Math.max(2, (r.tokens / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const [m, setM] = useState<Metrics | null>(null)
  const [state, setState] = useState<'loading' | 'ok' | 'err'>('loading')

  useEffect(() => {
    fetch('/metrics-full.json', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        setM(d)
        setState('ok')
      })
      .catch(() => setState('err'))
  }, [])

  const when = m
    ? new Date(m.generatedAt).toLocaleString('zh-TW', {
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : ''

  const ledger = m?.byProjectLedger ?? []

  return (
    <main className="hive-dash-root">
      <div className="hex-field" aria-hidden="true" />

      <div className="fin-wrap">
        <header className="fin-top">
          <div className="brand">
            <span className="brand-mark">A</span>
            <span>
              Apis Hive<span className="full"> · 財務控制台</span>
            </span>
          </div>
          <div className="fin-top-right">
            <span className="fin-private mono">內部私密 · INTERNAL</span>
            {state === 'ok' && (
              <span className="last-update">
                最後更新 <span className="tnum">{when}</span>
              </span>
            )}
          </div>
        </header>

        {state === 'loading' && (
          <div className="fin-note-block">載入財務資料中…</div>
        )}

        {state === 'err' && (
          <div className="fin-note-block">
            無法載入 <span className="mono">/metrics-full.json</span>。
            此資料由 Caddy basicauth 保護，請透過 <span className="mono">https://apis.bot/dashboard</span>{' '}
            並通過驗證後存取（直接打 :3000 因繞過 Caddy，無法取得此檔案）。
          </div>
        )}

        {state === 'ok' && m && (
          <>
            <section className="fin-section">
              <div className="fin-kpis">
                <KpiCard
                  label="累計"
                  tokens={m.totals.tokens}
                  usd={m.totals.costUsd}
                  twd={m.totals.costTwd}
                />
                <KpiCard
                  label="今日"
                  tokens={m.today.tokens}
                  usd={m.today.costUsd}
                  twd={m.today.costTwd}
                />
              </div>
            </section>

            <section className="fin-section">
              <div className="fin-sec-title">
                派工帳本 · 依專案
                <span className="fin-tag">較準 · 往後累積</span>
              </div>
              {ledger.length > 0 ? (
                <div className="fin-card">
                  <table className="fin-table">
                    <thead>
                      <tr>
                        <th>專案</th>
                        <th className="num">任務</th>
                        <th className="num">Token</th>
                        <th className="num">USD</th>
                        <th className="num">TWD</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ledger.map((r) => (
                        <tr key={r.name}>
                          <td>{r.name}</td>
                          <td className="num mono">{r.tasks}</td>
                          <td className="num mono">{fmtTok(r.tokens)}</td>
                          <td className="num mono fin-usd">{fmtUsd(r.costUsd)}</td>
                          <td className="num mono fin-twd">{fmtTwd(r.costTwd)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="fin-card fin-empty">
                  派工帳本累積中 — 隨著任務派工歸戶，這裡會逐漸補上更精準的專案成本。
                </div>
              )}
            </section>

            <section className="fin-section">
              <div className="fin-sec-title">
                依專案 · cwd 粗估
                <span className="fin-tag muted">粗估</span>
              </div>
              <div className="fin-card">
                <MoneyBars rows={m.byProject} />
              </div>
            </section>

            <section className="fin-section fin-grid2">
              <div>
                <div className="fin-sec-title">依員工</div>
                <div className="fin-card">
                  <MoneyBars rows={m.byAgent} />
                </div>
              </div>
              <div>
                <div className="fin-sec-title">依供應商</div>
                <div className="fin-card">
                  <MoneyBars rows={m.byProvider} />
                </div>
              </div>
            </section>

            <section className="fin-section fin-grid2">
              <div>
                <div className="fin-sec-title">依模型</div>
                <div className="fin-card">
                  <MoneyBars rows={m.byModel} />
                </div>
              </div>
              <div>
                <div className="fin-sec-title">派工數 · 依專案</div>
                <div className="fin-card">
                  {m.tasksByProject.length > 0 ? (
                    <div className="fin-bars">
                      {m.tasksByProject.map((t) => (
                        <div key={t.project} className="fin-task-row">
                          <span className="fin-bar-name">{t.project}</span>
                          <span className="fin-task-num mono">{t.tasks} 筆</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="fin-empty">尚無派工</div>
                  )}
                </div>
              </div>
            </section>

            {m.note && <p className="fin-foot-note">{m.note}</p>}
          </>
        )}
      </div>
    </main>
  )
}
