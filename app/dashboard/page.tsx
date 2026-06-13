'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
} from 'react'
import './dashboard.css'

/* ============================================================
   登入設定 — 密碼寫死 admin，通過後存 sessionStorage
   ============================================================ */
const AUTH_KEY = 'hive-dash-auth'
const PASSWORD = 'admin'

/* ============================================================
   資料（由 dashboard-prototype.html 移植）
   ============================================================ */
const AV_COLORS: Record<string, string> = {
  Meli: 'linear-gradient(135deg,#FFD89B,#F5A623)',
  Steve: 'linear-gradient(135deg,#FFC56B,#D98818)',
  Cora: 'linear-gradient(135deg,#FFD89B,#FFC56B)',
  Apple: 'linear-gradient(135deg,#8A847A,#6B655C)',
  Iris: 'linear-gradient(135deg,#FFC56B,#F5A623)',
  Penny: 'linear-gradient(135deg,#FFD89B,#D98818)',
}

/* ============================================================
   即時治理資料（/api/hive-status）型別 + 輪詢 hook
   ============================================================ */
type HiveStatus = 'working' | 'active' | 'idle' | 'offline'

type HiveEmployee = {
  profile: string
  name: string
  role: string
  model: string
  modelRaw: string
  status: HiveStatus
  currentTask: string | null
  projects: string[]
  lastSeen: string
  rosterStatus: string
}

type HiveProjectMeta = {
  key: 'hive'
  name: string
  kind: 'meta'
  tagline: string
  note: string
  metrics: {
    employees: number
    online: number
    lessonsActive: number
    lessonsTotal: number
    decisions: number
    retros: number
    tasksDispatched: number
    tasksDone: number
  }
}

type HiveProjectRecent = {
  dc: string
  action: 'task_assigned' | 'task_completed'
  note: string
  ts: string
}

type HiveProjectBusiness = {
  key: string
  name: string
  kind: 'business'
  assigned: number
  done: number
  open: number
  recent: HiveProjectRecent[]
}

type HiveProject = HiveProjectMeta | HiveProjectBusiness

type HiveData = {
  generatedAt: string
  employees: HiveEmployee[]
  projects: HiveProject[]
}

const HIVE_STATUS_LABEL: Record<HiveStatus, string> = {
  working: '執行中',
  active: '在線',
  idle: '待命',
  offline: '下線',
}

// 即時資料狀態 → 沿用既有 dot/pill class（working=amber、active=green、idle/offline=灰）
const HIVE_STATUS_DOT: Record<HiveStatus, string> = {
  working: 'dot-working',
  active: 'dot-active',
  idle: 'dot-idle',
  offline: 'dot-offline',
}

const POLL_MS = 15000

function useHiveStatus(active: boolean) {
  const [data, setData] = useState<HiveData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)

  useEffect(() => {
    if (!active) return
    let cancelled = false

    const load = async () => {
      try {
        const res = await fetch('/api/hive-status', { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = (await res.json()) as HiveData
        if (cancelled) return
        setData(json)
        setError(null)
        setUpdatedAt(nowTime())
      } catch (e) {
        if (cancelled) return
        setError(e instanceof Error ? e.message : '讀取失敗')
      }
    }

    load()
    const t = setInterval(load, POLL_MS)
    return () => {
      cancelled = true
      clearInterval(t)
    }
  }, [active])

  return { data, error, updatedAt }
}

/* ============================================================
   即時活動流產生器（右側 LOG）
   ============================================================ */
const ACTORS = [
  { name: 'Meli', abbr: 'COO' },
  { name: 'Steve', abbr: 'FE' },
  { name: 'Cora', abbr: 'PM' },
  { name: 'Apple', abbr: 'SRE' },
  { name: 'Iris', abbr: 'SALES' },
  { name: 'Penny', abbr: 'CS' },
]
const ACTIONS = [
  '完成本週營運摘要審核，已歸檔至 K1 報告',
  '修復產品頁 768px 斷點下的 Hero 跳版',
  '產出 OmniSense PRD v2 第 3 章草稿',
  '回覆客訴 #4821，更新 FAQ 知識庫條目',
  '跟進展會客戶名單，新增 7 筆高意向線索',
  '整理報價單 Q3-0612，等待主管覆核',
  'API 延遲監控通過，p95 < 180ms',
  '實作 Dashboard tab 切換 sliding indicator',
  '拆解 Q3 需求為 14 張可執行卡片',
  '同步官網 /activity 文案至最新版本',
]

type LogEntry = { id: number; time: string; name: string; msg: string }

function pad(n: number) {
  return n < 10 ? '0' + n : '' + n
}
function nowTime() {
  const d = new Date()
  return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds())
}
let logSeq = 0
function makeEntry(): LogEntry {
  const a = ACTORS[Math.floor(Math.random() * ACTORS.length)]
  const msg = ACTIONS[Math.floor(Math.random() * ACTIONS.length)]
  return { id: ++logSeq, time: nowTime(), name: a.name, msg }
}


/* ============================================================
   登入 Modal
   ============================================================ */
function LoginModal({ onSuccess }: { onSuccess: () => void }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 300)
    return () => clearTimeout(t)
  }, [])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (value === PASSWORD) {
      try {
        sessionStorage.setItem(AUTH_KEY, '1')
      } catch {
        /* sessionStorage 不可用時仍允許本次登入 */
      }
      // 同步向 /api/dash-login 種 cookie（dash_auth），讓「帳本」分頁能取 /api/metrics
      try {
        await fetch("/api/dash-login", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: value }),
        }).catch(() => {})
      } catch {
        /* 種 cookie 失敗不阻擋登入；帳本分頁屆時會顯示錯誤狀態 */
      }
      onSuccess()
    } else {
      setError(true)
    }
  }

  return (
    <div className="overlay show" role="dialog" aria-modal="true" aria-labelledby="loginTitle">
      <div className="login-card">
        <div className="login-mark">A</div>
        <h2 id="loginTitle" className="display">
          進入 Hive 控制台
        </h2>
        <p className="sub">這座蜂巢的內部營運面板。輸入存取憑證以查看員工與專案的即時狀態。</p>
        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="tokenInput">存取憑證 Access Token</label>
            <input
              ref={inputRef}
              id="tokenInput"
              type="password"
              className={error ? 'err' : undefined}
              placeholder="••••••••••••••••"
              autoComplete="off"
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                if (error) setError(false)
              }}
            />
          </div>
          <p className="login-error">{error ? '存取憑證錯誤，請再試一次' : ''}</p>
          <button type="submit" className="login-submit">
            登入
          </button>
        </form>
        <p className="login-foot">
          需要存取權限？
          <a href="/about">
            聯繫管理員
          </a>
        </p>
      </div>
    </div>
  )
}

/* ============================================================
   卡片 tilt + 跟隨游標光斑
   ============================================================ */
function handleTiltMove(e: MouseEvent<HTMLDivElement>) {
  const card = e.currentTarget
  const r = card.getBoundingClientRect()
  const px = (e.clientX - r.left) / r.width
  const py = (e.clientY - r.top) / r.height
  const rx = (0.5 - py) * 7
  const ry = (px - 0.5) * 7
  card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`
  card.style.setProperty('--glow', `radial-gradient(circle at ${px * 100}% ${py * 100}%,rgba(245,166,35,0.16),transparent 60%)`)
}
function handleTiltLeave(e: MouseEvent<HTMLDivElement>) {
  e.currentTarget.style.transform = ''
}


/* ============================================================
   帳本（Cost / Token 財務）分頁
   資料來自 /api/metrics（驗 dash_auth cookie，回 metrics-full.json）
   ============================================================ */
type CostRow = { name: string; tokens: number; costUsd: number; costTwd: number }
type CostLedgerRow = CostRow & { tasks?: number }
type CostTaskRow = { project: string; tasks: number }
type CostTotals = { tokens: number; costUsd: number; costTwd: number }
type CostData = {
  totals?: CostTotals
  today?: CostTotals
  byProjectLedger?: CostLedgerRow[]
  byProject?: CostRow[]
  byAgent?: CostRow[]
  byProvider?: CostRow[]
  byModel?: CostRow[]
  tasksByProject?: CostTaskRow[]
  note?: string
}

const fmtInt = (n: number | undefined) =>
  typeof n === 'number' && isFinite(n) ? Math.round(n).toLocaleString('en-US') : '—'
const fmtUsd = (n: number | undefined) =>
  typeof n === 'number' && isFinite(n) ? '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'
const fmtTwd = (n: number | undefined) =>
  typeof n === 'number' && isFinite(n) ? 'NT$' + Math.round(n).toLocaleString('en-US') : '—'

function CostBars({ rows }: { rows: CostRow[] }) {
  const max = rows.reduce((m, r) => Math.max(m, r.tokens || 0), 0) || 1
  return (
    <div className="cost-bars">
      {rows.map((r) => (
        <div key={r.name} className="cost-bar-row">
          <span className="cost-bar-name" title={r.name}>{r.name}</span>
          <span className="cost-bar-track">
            <span className="cost-bar-fill" style={{ width: `${Math.max(2, ((r.tokens || 0) / max) * 100)}%` }} />
          </span>
          <span className="cost-bar-tok num">{fmtInt(r.tokens)}</span>
          <span className="cost-bar-usd num">{fmtUsd(r.costUsd)}</span>
        </div>
      ))}
    </div>
  )
}

function CostPane({ active }: { active: boolean }) {
  const [data, setData] = useState<CostData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const loadedRef = useRef(false)

  useEffect(() => {
    if (!active || loadedRef.current) return
    loadedRef.current = true
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/metrics', { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = (await res.json()) as CostData
        if (!cancelled) setData(json)
      } catch (e) {
        if (!cancelled) {
          loadedRef.current = false // 允許下次進入分頁時重試
          setError(e instanceof Error ? e.message : '讀取失敗')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [active])

  if (loading && !data) {
    return <div className="cost-state">帳本資料載入中…</div>
  }
  if (error && !data) {
    return <div className="cost-state cost-state-err">帳本資料讀取失敗（{error}）— 請重新登入或稍後再試</div>
  }
  if (!data) {
    return <div className="cost-state">尚無帳本資料</div>
  }

  const ledger = data.byProjectLedger ?? []
  const byProject = data.byProject ?? []
  const byAgent = data.byAgent ?? []
  const byProvider = data.byProvider ?? []
  const byModel = data.byModel ?? []
  const tasks = data.tasksByProject ?? []

  return (
    <div className="cost-wrap">
      {/* KPI 卡 */}
      <div className="cost-kpis">
        <div className="cost-kpi">
          <span className="cost-kpi-label">累計 Tokens</span>
          <span className="cost-kpi-val num">{fmtInt(data.totals?.tokens)}</span>
        </div>
        <div className="cost-kpi">
          <span className="cost-kpi-label">累計成本</span>
          <span className="cost-kpi-val num">{fmtUsd(data.totals?.costUsd)}</span>
          <span className="cost-kpi-sub num">{fmtTwd(data.totals?.costTwd)}</span>
        </div>
        <div className="cost-kpi">
          <span className="cost-kpi-label">今日 Tokens</span>
          <span className="cost-kpi-val num">{fmtInt(data.today?.tokens)}</span>
        </div>
        <div className="cost-kpi">
          <span className="cost-kpi-label">今日成本</span>
          <span className="cost-kpi-val num">{fmtUsd(data.today?.costUsd)}</span>
          <span className="cost-kpi-sub num">{fmtTwd(data.today?.costTwd)}</span>
        </div>
      </div>

      <div className="cost-cols">
        {/* 派工帳本（較準） */}
        <div className="cost-card">
          <div className="cost-card-head">
            <span className="cost-card-title">派工帳本</span>
            <span className="cost-card-tag">較準 · 往後累積</span>
          </div>
          {ledger.length === 0 ? (
            <div className="cost-empty">派工帳本累積中，完工後自動歸戶</div>
          ) : (
            <div className="cost-ledger">
              {ledger.map((r) => (
                <div key={r.name} className="cost-ledger-row">
                  <span className="cost-ledger-name" title={r.name}>{r.name}</span>
                  {typeof r.tasks === 'number' && <span className="cost-ledger-tasks num">{r.tasks} 派工</span>}
                  <span className="cost-ledger-tok num">{fmtInt(r.tokens)}</span>
                  <span className="cost-ledger-usd num">{fmtUsd(r.costUsd)}</span>
                  <span className="cost-ledger-twd num">{fmtTwd(r.costTwd)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* byProject（cwd 粗估） */}
        <div className="cost-card">
          <div className="cost-card-head">
            <span className="cost-card-title">專案成本</span>
            <span className="cost-card-tag">cwd 粗估</span>
          </div>
          {byProject.length === 0 ? (
            <div className="cost-empty">尚無資料</div>
          ) : (
            <div className="cost-ledger">
              {byProject.map((r) => (
                <div key={r.name} className="cost-ledger-row">
                  <span className="cost-ledger-name" title={r.name}>{r.name}</span>
                  <span className="cost-ledger-tok num">{fmtInt(r.tokens)}</span>
                  <span className="cost-ledger-usd num">{fmtUsd(r.costUsd)}</span>
                  <span className="cost-ledger-twd num">{fmtTwd(r.costTwd)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="cost-cols">
        <div className="cost-card">
          <div className="cost-card-head"><span className="cost-card-title">依 Agent</span></div>
          {byAgent.length === 0 ? <div className="cost-empty">尚無資料</div> : <CostBars rows={byAgent} />}
        </div>
        <div className="cost-card">
          <div className="cost-card-head"><span className="cost-card-title">依 Provider</span></div>
          {byProvider.length === 0 ? <div className="cost-empty">尚無資料</div> : <CostBars rows={byProvider} />}
        </div>
      </div>

      <div className="cost-cols">
        <div className="cost-card">
          <div className="cost-card-head"><span className="cost-card-title">依 Model</span></div>
          {byModel.length === 0 ? <div className="cost-empty">尚無資料</div> : <CostBars rows={byModel} />}
        </div>
        <div className="cost-card">
          <div className="cost-card-head"><span className="cost-card-title">各專案派工數</span></div>
          {tasks.length === 0 ? (
            <div className="cost-empty">尚無派工</div>
          ) : (
            <div className="cost-tasks">
              {tasks.map((t) => (
                <div key={t.project} className="cost-task-row">
                  <span className="cost-task-name" title={t.project}>{t.project}</span>
                  <span className="cost-task-num num">{t.tasks}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {data.note && <p className="cost-note">{data.note}</p>}
    </div>
  )
}

/* ============================================================
   員工總覽（即時資料 /api/hive-status）
   ============================================================ */
function avBg(name: string): string {
  return AV_COLORS[name] ?? 'linear-gradient(135deg,#8A847A,#6B655C)'
}

function EmployeeOverview({ data, error }: { data: HiveData | null; error: string | null }) {
  if (!data) {
    return (
      <div className="cost-state">
        {error ? `員工資料讀取失敗（${error}）— 稍後自動重試` : '員工即時狀態載入中…'}
      </div>
    )
  }
  return (
    <div className="emp-grid">
      {data.employees.map((e) => {
        const calm = e.status === 'idle' || e.status === 'offline'
        return (
          <div key={e.profile} className="emp-card" onMouseMove={handleTiltMove} onMouseLeave={handleTiltLeave}>
            <div className="emp-head">
              <div className="emp-avatar" style={{ background: avBg(e.name) }}>
                {e.name[0]}
              </div>
              <div>
                <div className="emp-name">
                  <span className={`dot ${HIVE_STATUS_DOT[e.status]}${!calm ? ' breathe' : ''}`} />
                  {e.name}
                </div>
                <div className="emp-role">{e.role}</div>
              </div>
              <span className="emp-status-pill">
                <span className={`dot ${HIVE_STATUS_DOT[e.status]}`} />
                {HIVE_STATUS_LABEL[e.status]}
              </span>
            </div>
            <div className="emp-model-row">
              <span className="model-badge">{e.model}</span>
            </div>
            <div className="task-block">
              <div className="tb-label">當前任務</div>
              <div className={`task-item${e.currentTask ? '' : ' idle'}`}>
                <span className="pri" />
                <span>{e.currentTask ?? '待命中'}</span>
              </div>
            </div>
            <div className="emp-foot">
              <div className="chips">
                {e.projects.length ? (
                  e.projects.map((c) => (
                    <span key={c} className="chip">
                      {c}
                    </span>
                  ))
                ) : (
                  <span className="chip chip-muted">未指派專案</span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ============================================================
   專案視角（即時資料 /api/hive-status）
   HIVE = 公司本體 HERO；business = 事業專案卡
   ============================================================ */
function fmtRecentTime(ts: string): string {
  const d = new Date(ts)
  if (isNaN(d.getTime())) return ts
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function HiveHero({ p }: { p: HiveProjectMeta }) {
  const m = p.metrics
  const stats: { label: string; val: number }[] = [
    { label: '員工數', val: m.employees },
    { label: '在線', val: m.online },
    { label: '活躍經驗', val: m.lessonsActive },
    { label: '累積經驗', val: m.lessonsTotal },
    { label: '決策', val: m.decisions },
    { label: 'Retro', val: m.retros },
    { label: '派工', val: m.tasksDispatched },
    { label: '完成', val: m.tasksDone },
  ]
  return (
    <div className="hive-hero">
      <div className="hive-hero-head">
        <span className="hive-hero-kicker">公司本體 · 自我優化</span>
        <h2 className="hive-hero-title display">{p.name}</h2>
        <p className="hive-hero-tagline">{p.tagline}</p>
        <p className="hive-hero-note">{p.note}</p>
      </div>
      <div className="hive-hero-metrics">
        {stats.map((s) => (
          <div key={s.label} className="hive-metric">
            <span className="hive-metric-val tnum">{s.val}</span>
            <span className="hive-metric-label">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function BusinessProjectCard({ p }: { p: HiveProjectBusiness }) {
  const recent = p.recent.slice(0, 5)
  return (
    <div className="proj-card biz-card">
      <div className="proj-head">
        <span className="proj-title">{p.name}</span>
      </div>
      <div className="biz-stats">
        <div className="biz-stat">
          <span className="biz-stat-val tnum">{p.open}</span>
          <span className="biz-stat-label">進行中</span>
        </div>
        <div className="biz-stat">
          <span className="biz-stat-val tnum">{p.done}</span>
          <span className="biz-stat-label">已完成</span>
        </div>
        <div className="biz-stat">
          <span className="biz-stat-val tnum">{p.assigned}</span>
          <span className="biz-stat-label">總派工</span>
        </div>
      </div>
      <div className="biz-recent">
        <div className="tb-label">最近活動</div>
        {recent.length ? (
          recent.map((r, i) => (
            <div key={i} className={`biz-evt biz-evt-${r.action === 'task_completed' ? 'done' : 'assigned'}`}>
              <span className="biz-evt-dot" />
              <span className="biz-evt-note">{r.note}</span>
              <span className="biz-evt-time tnum">{fmtRecentTime(r.ts)}</span>
            </div>
          ))
        ) : (
          <div className="board-empty">尚無活動</div>
        )}
      </div>
    </div>
  )
}

function ProjectView({ data, error }: { data: HiveData | null; error: string | null }) {
  if (!data) {
    return (
      <div className="cost-state">
        {error ? `專案資料讀取失敗（${error}）— 稍後自動重試` : '專案即時狀態載入中…'}
      </div>
    )
  }
  const hive = data.projects.find((p): p is HiveProjectMeta => p.kind === 'meta')
  const biz = data.projects.filter((p): p is HiveProjectBusiness => p.kind === 'business')
  return (
    <div className="proj-view">
      {hive && <HiveHero p={hive} />}
      {biz.length > 0 && <div className="biz-section-title">事業專案</div>}
      <div className="proj-list">
        {biz.map((p) => (
          <BusinessProjectCard key={p.key} p={p} />
        ))}
      </div>
    </div>
  )
}

/* ============================================================
   Dashboard 主畫面
   ============================================================ */
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<'emp' | 'proj' | 'cost'>('emp')
  const [log, setLog] = useState<LogEntry[]>([])

  // 員工總覽 + 專案視角共用的即時治理資料，每 15 秒輪詢
  const { data: hive, error: hiveError, updatedAt: hiveUpdatedAt } = useHiveStatus(true)

  const empTabRef = useRef<HTMLButtonElement>(null)
  const projTabRef = useRef<HTMLButtonElement>(null)
  const costTabRef = useRef<HTMLButtonElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)

  // sliding indicator 定位
  const positionIndicator = useCallback(() => {
    const el = tab === 'emp' ? empTabRef.current : tab === 'proj' ? projTabRef.current : costTabRef.current
    const ind = indicatorRef.current
    if (!el || !ind) return
    ind.style.width = el.offsetWidth + 'px'
    ind.style.transform = `translateX(${el.offsetLeft - 5}px)`
  }, [tab])

  useEffect(() => {
    positionIndicator()
  }, [positionIndicator])

  useEffect(() => {
    const h = () => positionIndicator()
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [positionIndicator])

  // 右側即時 LOG
  useEffect(() => {
    const seed: LogEntry[] = []
    for (let i = 0; i < 10; i++) seed.push(makeEntry())
    setLog(seed)
    const t = setInterval(() => {
      setLog((prev) => [makeEntry(), ...prev].slice(0, 22))
    }, 2200)
    return () => clearInterval(t)
  }, [])

  const switchTab = (next: 'emp' | 'proj' | 'cost') => {
    setTab(next)
  }

  return (
    <div className="dash">
      <header className="dash-top">
        <div className="brand">
          <span className="brand-mark">A</span>
          <span>
            Apis Hive<span className="full"> · Dashboard</span>
          </span>
        </div>
        <div className="summary-bar">
          <span className="seg">
            <span className="dot dot-working breathe" />
            {hive ? hive.employees.filter((e) => e.status === 'working').length : 0} 執行中
          </span>
          <span className="div" />
          <span className="seg">
            <span className="dot dot-active" />
            {hive ? hive.employees.filter((e) => e.status === 'active').length : 0} 在線
          </span>
          <span className="div" />
          <span className="seg">
            <span className="dot dot-idle" />
            {hive ? hive.employees.filter((e) => e.status === 'idle' || e.status === 'offline').length : 0} 待命
          </span>
        </div>
        <div className="dash-top-right">
          <span className="last-update live-pill">
            <span className="dot dot-active breathe" />
            即時 · 更新於 <span className="tnum">{hiveUpdatedAt ?? '—'}</span>
          </span>
          <button className="btn-logout" onClick={onLogout}>
            登出
          </button>
        </div>
      </header>

      <div className="dash-body">
        <main className="dash-main">
          <div className="tabs">
            <div ref={indicatorRef} className="tab-indicator" />
            <button ref={empTabRef} className={`tab${tab === 'emp' ? ' active' : ''}`} onClick={() => switchTab('emp')}>
              員工總覽
            </button>
            <button ref={projTabRef} className={`tab${tab === 'proj' ? ' active' : ''}`} onClick={() => switchTab('proj')}>
              專案視角
            </button>
            <button ref={costTabRef} className={`tab${tab === 'cost' ? ' active' : ''}`} onClick={() => switchTab('cost')}>
              帳本
            </button>
          </div>

          {/* Tab 1：員工總覽（即時資料） */}
          <section className={`pane${tab === 'emp' ? ' active' : ''}`}>
            <EmployeeOverview data={hive} error={hiveError} />
          </section>

          {/* Tab 2：專案視角（即時資料） */}
          <section className={`pane${tab === 'proj' ? ' active' : ''}`}>
            <ProjectView data={hive} error={hiveError} />
          </section>

          {/* Tab 3：帳本 */}
          <section className={`pane${tab === 'cost' ? ' active' : ''}`}>
            <CostPane active={tab === 'cost'} />
          </section>
        </main>

        {/* 右側即時 log */}
        <aside className="side">
          <div className="side-head">
            <span>即時活動 LOG</span>
            <span className="stream-live">
              <span className="dot dot-active breathe" />
              LIVE
            </span>
          </div>
          <div className="side-log">
            {log.map((e) => (
              <div key={e.id} className="log-row">
                <span className="lt">{e.time}</span>
                <span className="lc">
                  <span className="lwho">{e.name}</span> <span className="lact">{e.msg}</span>
                </span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}

/* ============================================================
   頁面入口 — 登入 gate
   ============================================================ */
export default function DashboardPage() {
  const [authed, setAuthed] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    try {
      if (sessionStorage.getItem(AUTH_KEY) === '1') setAuthed(true)
    } catch {
      /* sessionStorage 不可用：維持未登入 */
    }
    setChecked(true)
  }, [])

  const logout = () => {
    try {
      sessionStorage.removeItem(AUTH_KEY)
    } catch {
      /* 忽略 */
    }
    setAuthed(false)
  }

  return (
    <main className="hive-dash-root">
      <div className="hex-field" aria-hidden="true" />
      {authed && <Dashboard onLogout={logout} />}
      {checked && !authed && <LoginModal onSuccess={() => setAuthed(true)} />}
    </main>
  )
}
