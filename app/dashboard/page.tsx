'use client'

import { useEffect, useState, FormEvent } from 'react'
import './dashboard.css'

/* ============================================================
   Apis Hive — 內部私密財務 Dashboard
   存取由頁內密碼閘門保護（cookie 式登入）。
   資料來源：/api/metrics（檢查 dash_auth cookie 後回傳完整金額）
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

function LoginGate({
  onSuccess,
}: {
  onSuccess: (m: Metrics) => void
}) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError(false)
    try {
      const r = await fetch('/api/dash-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!r.ok) {
        setError(true)
        setBusy(false)
        return
      }
      const mr = await fetch('/api/metrics', { cache: 'no-store' })
      if (!mr.ok) {
        setError(true)
        setBusy(false)
        return
      }
      const data = (await mr.json()) as Metrics
      onSuccess(data)
    } catch {
      setError(true)
      setBusy(false)
    }
  }

  return (
    <div className="fin-login-wrap">
      <form className="fin-login-card" onSubmit={submit}>
        <div className="fin-login-mark">A</div>
        <div className="fin-login-title">內部 · 請輸入密碼</div>
        <input
          type="password"
          className="fin-login-input mono"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="密碼"
          autoFocus
          autoComplete="current-password"
        />
        <button type="submit" className="fin-login-btn" disabled={busy}>
          {busy ? '驗證中…' : '登入'}
        </button>
        {error && <div className="fin-login-err">密碼錯誤</div>}
      </form>
    </div>
  )
}

export default function DashboardPage() {
  const [m, setM] = useState<Metrics | null>(null)
  const [state, setState] = useState<'loading' | 'ok' | 'locked'>('loading')

  useEffect(() => {
    fetch('/api/metrics', { cache: 'no-store' })
      .then((r) => {
        if (r.ok) return r.json()
        return Promise.reject()
      })
      .then((d) => {
        setM(d)
        setState('ok')
      })
      .catch(() => setState('locked'))
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

      {state === 'loading' && (
        <div className="fin-wrap">
          <div className="fin-note-block">載入財務資料中…</div>
        </div>
      )}

      {state === 'locked' && (
        <LoginGate
          onSuccess={(data) => {
            setM(data)
            setState('ok')
          }}
        />
      )}

      {state === 'ok' && m && (
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
              <span className="last-update">
                最後更新 <span className="tnum">{when}</span>
              </span>
            </div>
          </header>

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
        </div>
      )}
    </main>
  )
}
