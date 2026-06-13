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
type Status = 'active' | 'working' | 'idle' | 'blocked'

const AV_COLORS: Record<string, string> = {
  Meli: 'linear-gradient(135deg,#FFD89B,#F5A623)',
  Steve: 'linear-gradient(135deg,#FFC56B,#D98818)',
  Cora: 'linear-gradient(135deg,#FFD89B,#FFC56B)',
  Apple: 'linear-gradient(135deg,#8A847A,#6B655C)',
  Iris: 'linear-gradient(135deg,#FFC56B,#F5A623)',
  Penny: 'linear-gradient(135deg,#FFD89B,#D98818)',
}

const STATUS_LABEL: Record<Status, string> = {
  active: 'ACTIVE',
  working: 'WORKING',
  idle: 'IDLE',
  blocked: 'BLOCKED',
}

type Employee = {
  name: string
  role: string
  status: Status
  tasks: string[]
  chips: string[]
  time: string
}

const EMPLOYEES: Employee[] = [
  { name: 'Meli', role: 'COO', status: 'active', tasks: ['審核本週營運摘要', '追蹤 K1 交付進度'], chips: ['LED-Startup', 'Hive'], time: '2 分鐘前' },
  { name: 'Steve', role: 'Frontend', status: 'working', tasks: ['修復產品頁響應式斷點', '實作 Hero 動畫'], chips: ['LED-Startup', 'Hive'], time: '剛剛' },
  { name: 'Cora', role: 'PM', status: 'active', tasks: ['撰寫 OmniSense PRD v2', '拆解 Q3 需求'], chips: ['OmniSense'], time: '5 分鐘前' },
  { name: 'Apple', role: 'SRE', status: 'idle', tasks: ['上次：API 延遲監控已完成'], chips: ['Platform'], time: '15 分鐘前' },
  { name: 'Iris', role: 'Sales', status: 'working', tasks: ['跟進展會客戶名單', '整理報價單'], chips: ['LED-Startup'], time: '3 分鐘前' },
  { name: 'Penny', role: 'CS', status: 'active', tasks: ['回覆客訴 #4821', '更新 FAQ 知識庫'], chips: ['LED-Startup'], time: '8 分鐘前' },
]

type ProjTask = { who: string; state: Status; msg: string }
type Project = {
  name: string
  people: string[]
  sub?: string
  tasks: ProjTask[]
  today: number
  week: number
  last: string
}

const PROJECTS: Project[] = [
  {
    name: 'LED-Startup',
    people: ['Meli', 'Iris', 'Penny', 'Steve'],
    tasks: [
      { who: 'Iris', state: 'working', msg: '跟進展會客戶名單' },
      { who: 'Penny', state: 'active', msg: '回覆客訴 #4821' },
      { who: 'Meli', state: 'active', msg: '審核本週營運摘要' },
    ],
    today: 12,
    week: 89,
    last: '1 分鐘前',
  },
  {
    name: 'OmniSense',
    people: ['Cora', 'Steve'],
    tasks: [
      { who: 'Cora', state: 'active', msg: '撰寫 PRD v2' },
      { who: 'Steve', state: 'blocked', msg: '等待設計稿' },
    ],
    today: 5,
    week: 34,
    last: '5 分鐘前',
  },
  {
    name: 'Hive',
    people: ['Steve', 'Meli'],
    sub: '官網專案',
    tasks: [
      { who: 'Steve', state: 'working', msg: '實作 Hero 動畫' },
      { who: 'Meli', state: 'active', msg: '規劃 Dashboard' },
    ],
    today: 8,
    week: 52,
    last: '剛剛',
  },
]

type BoardCard = { who: string; msg: string; pri?: string; time?: string }
type ProjectDetail = {
  state: string
  stateType: 'ok' | 'risk'
  desc: string
  pct: number
  done: number
  total: number
  weekDeliver: number
  overdue: number
  tokens: string
  cost: string
  trend: number
  people: string[]
  board: { progress: BoardCard[]; review: BoardCard[]; done: BoardCard[] }
  timeline: { date: string; items: { who: string; msg: string }[] }[]
  breakdown: { who: string; val: number; label: string; cost: string }[]
}

const PROJECT_DETAILS: Record<string, ProjectDetail> = {
  'LED-Startup': {
    state: 'On Track',
    stateType: 'ok',
    desc: 'K1 Visual Solutions LED 經銷官網建置與營運',
    pct: 72,
    done: 18,
    total: 25,
    weekDeliver: 6,
    overdue: 0,
    tokens: '2.1M',
    cost: '$8.40',
    trend: -12,
    people: ['Meli', 'Steve', 'Iris', 'Penny'],
    board: {
      progress: [
        { who: 'Steve', msg: '修復產品頁 RWD 斷點', pri: 'high' },
        { who: 'Iris', msg: '跟進展會客戶名單', pri: 'med' },
        { who: 'Penny', msg: '更新 FAQ 知識庫', pri: 'low' },
      ],
      review: [{ who: 'Meli', msg: '審核本週營運週報' }],
      done: [
        { who: 'Steve', msg: '完成 SEO 結構優化', time: '今天 14:20' },
        { who: 'Iris', msg: '發送 12 封客戶報價', time: '今天 11:05' },
      ],
    },
    timeline: [
      { date: '06/12 · 今天', items: [{ who: 'Steve', msg: '修復產品頁 RWD 斷點' }, { who: 'Iris', msg: '發送 12 封客戶報價' }] },
      { date: '06/11', items: [{ who: 'Penny', msg: '更新 FAQ 知識庫 8 條' }] },
      { date: '06/10', items: [{ who: 'Steve', msg: '完成 SEO 結構化資料標記' }] },
      { date: '06/09', items: [{ who: 'Meli', msg: '審核並歸檔本週週報' }] },
      { date: '06/08', items: [{ who: 'Iris', msg: '整理展會名單 24 筆' }] },
      { date: '06/07', items: [{ who: 'Penny', msg: '處理客訴 #4821' }] },
      { date: '06/06', items: [{ who: 'Steve', msg: '上線產品比較頁' }] },
    ],
    breakdown: [
      { who: 'Steve', val: 820, label: '820K', cost: '$3.28' },
      { who: 'Meli', val: 540, label: '540K', cost: '$2.16' },
      { who: 'Iris', val: 480, label: '480K', cost: '$1.92' },
      { who: 'Penny', val: 260, label: '260K', cost: '$1.04' },
    ],
  },
  OmniSense: {
    state: 'At Risk',
    stateType: 'risk',
    desc: '智慧感測器產品線規劃與前期開發',
    pct: 38,
    done: 8,
    total: 21,
    weekDeliver: 2,
    overdue: 1,
    tokens: '980K',
    cost: '$3.92',
    trend: 0,
    people: ['Cora', 'Steve'],
    board: {
      progress: [
        { who: 'Cora', msg: '撰寫 PRD v2 第 3 章', pri: 'high' },
        { who: 'Steve', msg: '等待設計稿，開發暫停', pri: 'blocked' },
      ],
      review: [],
      done: [
        { who: 'Cora', msg: '完成競品分析報告', time: '06/10' },
        { who: 'Steve', msg: '完成 wireframe v1', time: '06/09' },
      ],
    },
    timeline: [
      { date: '06/12 · 今天', items: [{ who: 'Cora', msg: '撰寫 PRD v2 第 3 章' }] },
      { date: '06/11', items: [{ who: 'Steve', msg: '標記設計稿阻塞，通知設計團隊' }] },
      { date: '06/10', items: [{ who: 'Cora', msg: '完成競品分析報告' }] },
      { date: '06/09', items: [{ who: 'Steve', msg: '完成 wireframe v1' }] },
      { date: '06/08', items: [{ who: 'Cora', msg: '拆解 Q3 需求為 14 張卡片' }] },
      { date: '06/07', items: [{ who: 'Cora', msg: '整理使用者訪談摘要' }] },
      { date: '06/06', items: [{ who: 'Steve', msg: '建立原型專案骨架' }] },
    ],
    breakdown: [
      { who: 'Cora', val: 620, label: '620K', cost: '$2.48' },
      { who: 'Steve', val: 360, label: '360K', cost: '$1.44' },
    ],
  },
  Hive: {
    state: 'On Track',
    stateType: 'ok',
    desc: 'Apis 公司官網 Landing Page 建置',
    pct: 85,
    done: 17,
    total: 20,
    weekDeliver: 8,
    overdue: 0,
    tokens: '3.4M',
    cost: '$13.60',
    trend: 8,
    people: ['Steve', 'Meli', 'Cora'],
    board: {
      progress: [
        { who: 'Steve', msg: '實作 Dashboard 互動原型', pri: 'high' },
        { who: 'Meli', msg: '規劃下階段路線圖', pri: 'med' },
      ],
      review: [{ who: 'Cora', msg: '產出 Dashboard spec' }],
      done: [
        { who: 'Steve', msg: '動畫大升級上線', time: '06/07' },
        { who: 'Steve', msg: '首頁瘦身重構', time: '06/09' },
        { who: 'Steve', msg: '完成 Partners 分頁', time: '06/10' },
        { who: 'Cora', msg: '完成 SEO 優化', time: '06/08' },
        { who: 'Meli', msg: 'Coffee Time #1 內容', time: '06/05' },
        { who: 'Meli', msg: 'Coffee Time #2 內容', time: '06/06' },
      ],
    },
    timeline: [
      { date: '06/12 · 今天', items: [{ who: 'Steve', msg: '實作 Dashboard 互動原型' }, { who: 'Cora', msg: '產出 Dashboard spec' }] },
      { date: '06/11', items: [{ who: 'Meli', msg: '規劃下階段產品路線圖' }] },
      { date: '06/10', items: [{ who: 'Steve', msg: '完成 Partners 分頁獨立' }] },
      { date: '06/09', items: [{ who: 'Steve', msg: '首頁瘦身重構' }] },
      { date: '06/08', items: [{ who: 'Cora', msg: '動畫互動評審 + SEO 優化' }] },
      { date: '06/07', items: [{ who: 'Steve', msg: '動畫大升級上線' }] },
      { date: '06/06', items: [{ who: 'Meli', msg: 'Coffee Time 內容企劃' }] },
    ],
    breakdown: [
      { who: 'Steve', val: 1800, label: '1.8M', cost: '$7.20' },
      { who: 'Meli', val: 1100, label: '1.1M', cost: '$4.40' },
      { who: 'Cora', val: 500, label: '500K', cost: '$2.00' },
    ],
  },
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
   小型 icon（內聯 SVG）
   ============================================================ */
function IconArrow() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}
function IconBack() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  )
}
function IconCheck() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}
function IconTrendDown() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M19 12l-7 7-7-7" />
    </svg>
  )
}
function IconTrendUp() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  )
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

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (value === PASSWORD) {
      try {
        sessionStorage.setItem(AUTH_KEY, '1')
      } catch {
        /* sessionStorage 不可用時仍允許本次登入 */
      }
      // 同步向 /api/dash-login 種 cookie（dash_auth），讓「帳本」分頁能取 /api/metrics
      try {
        void fetch('/api/dash-login', {
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
   專案詳情視圖
   ============================================================ */
const PRI_COLOR: Record<string, string> = {
  high: 'var(--honey-500)',
  med: 'var(--status-beta)',
  low: 'var(--status-idle)',
  blocked: 'var(--status-blocked)',
}

function DetailTaskCard({ card, kind }: { card: BoardCard; kind: 'progress' | 'review' | 'done' }) {
  if (kind === 'done') {
    return (
      <div className="tcard" style={{ ['--pc' as string]: 'var(--status-live)' }}>
        <div className="tcard-who">
          <span className="av-mini" style={{ background: AV_COLORS[card.who] }}>
            {card.who[0]}
          </span>
          {card.who}
        </div>
        <div className="tcard-msg">{card.msg}</div>
        <span className="tcard-time">
          <span className="tcard-check">
            <IconCheck />
          </span>
          {card.time}
        </span>
      </div>
    )
  }
  const blk = card.pri === 'blocked'
  return (
    <div className="tcard" style={{ ['--pc' as string]: PRI_COLOR[card.pri ?? ''] ?? 'var(--honey-500)' }}>
      <div className="tcard-who">
        <span className="av-mini" style={{ background: AV_COLORS[card.who] }}>
          {card.who[0]}
        </span>
        {card.who}
        {blk && <span className="blk-tag">阻塞</span>}
      </div>
      <div className="tcard-msg">{card.msg}</div>
    </div>
  )
}

function ProjectDetailView({ name, leaving, onBack }: { name: string; leaving: boolean; onBack: () => void }) {
  const d = PROJECT_DETAILS[name]
  const ref = useRef<HTMLDivElement>(null)
  const maxTk = Math.max(...d.breakdown.map((b) => b.val))

  useEffect(() => {
    window.scrollTo(0, 0)
    const node = ref.current
    if (!node) return
    const bars = node.querySelectorAll<HTMLElement>('.tk-bar')
    const id = requestAnimationFrame(() => {
      bars.forEach((b) => {
        b.style.width = b.dataset.w || '0'
      })
    })
    return () => cancelAnimationFrame(id)
  }, [name])

  const colDef = [
    { key: 'progress', label: '進行中', kind: 'progress' as const },
    { key: 'review', label: '待審核', kind: 'review' as const },
    { key: 'done', label: '已完成', kind: 'done' as const },
  ]

  return (
    <div ref={ref} className={`proj-detail active${leaving ? ' leaving' : ''}`}>
      <button className="detail-back" onClick={onBack}>
        <IconBack />
        返回專案列表
      </button>

      <div className="detail-head">
        <div>
          <div className="detail-title">{name}</div>
          <div className="detail-badges">
            <span className="detail-badge ok">
              <span className="dot dot-active breathe" />
              Active
            </span>
            <span className={`detail-badge ${d.stateType}`}>{d.state}</span>
          </div>
        </div>
        <p className="detail-desc">{d.desc}</p>
      </div>

      <div className="detail-stats">
        <div className="dstat">
          <div className="dstat-label">完成度</div>
          <div className="dstat-row">
            <div className="ring" style={{ ['--pct' as string]: d.pct }}>
              <span className="ring-num">{d.pct}%</span>
            </div>
            <div className="dstat-sub">
              已完成 <b style={{ color: 'var(--text-primary)' }}>{d.done}</b> / {d.total} 項任務
            </div>
          </div>
        </div>
        <div className="dstat">
          <div className="dstat-label">本週交付</div>
          <div className="dstat-row">
            <span className="dstat-big">{d.weekDeliver}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>項</span>
          </div>
          <div className="dstat-sub">
            {d.overdue > 0 ? (
              <>
                逾期 <span className="bad">{d.overdue} 項</span>
              </>
            ) : (
              <>
                逾期 <b style={{ color: 'var(--text-primary)' }}>0 項</b>
              </>
            )}
          </div>
        </div>
        <div className="dstat">
          <div className="dstat-label">累積花費</div>
          <div className="dstat-row">
            <span className="dstat-big">{d.tokens}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>tokens</span>
          </div>
          <div className="dstat-sub">
            約 <b style={{ color: 'var(--honey-400)' }}>{d.cost}</b>
          </div>
          {d.trend < 0 ? (
            <span className="dstat-trend down">
              <IconTrendDown />本週 {Math.abs(d.trend)}%
            </span>
          ) : d.trend > 0 ? (
            <span className="dstat-trend up">
              <IconTrendUp />本週 {d.trend}%
            </span>
          ) : (
            <span className="dstat-trend" style={{ color: 'var(--text-muted)' }}>
              本週持平
            </span>
          )}
        </div>
        <div className="dstat">
          <div className="dstat-label">活躍員工</div>
          <div className="dstat-row">
            <span className="dstat-big">{d.people.length}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>人</span>
          </div>
          <div className="av-stack" style={{ marginTop: 12 }}>
            {d.people.map((n) => (
              <span key={n} className="av-mini" style={{ background: AV_COLORS[n] }}>
                {n[0]}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="detail-section">
        <div className="detail-sec-title">任務看板</div>
        <div className="board">
          {colDef.map((c) => {
            const arr = d.board[c.key as keyof ProjectDetail['board']]
            return (
              <div key={c.key} className="board-col">
                <div className="board-col-head">
                  <span>{c.label}</span>
                  <span className="cnt">{arr.length}</span>
                </div>
                <div className="board-cards">
                  {arr.length ? (
                    arr.map((t, i) => <DetailTaskCard key={i} card={t} kind={c.kind} />)
                  ) : (
                    <div className="board-empty">目前沒有項目</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="detail-section">
        <div className="detail-sec-title">近 7 天時間軸</div>
        <div className="timeline">
          {d.timeline.map((day, i) => (
            <div key={i} className="tl-day">
              <span className="tl-node" />
              <div className="tl-date">{day.date}</div>
              {day.items.map((it, j) => (
                <div key={j} className="tl-line">
                  <span className="tl-who">{it.who}</span> · {it.msg}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="detail-section">
        <div className="detail-sec-title">花費明細 · Token 用量</div>
        <div className="tk-chart">
          {d.breakdown.map((b) => (
            <div key={b.who} className="tk-row">
              <span className="tk-name">
                <span className="av-mini" style={{ background: AV_COLORS[b.who] }}>
                  {b.who[0]}
                </span>
                {b.who}
              </span>
              <span className="tk-bar-track">
                <span className="tk-bar" data-w={`${Math.round((b.val / maxTk) * 100)}%`} />
              </span>
              <span className="tk-val">
                {b.label}
                <span className="tk-cost">{b.cost}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
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
   Dashboard 主畫面
   ============================================================ */
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<'emp' | 'proj' | 'cost'>('emp')
  const [detail, setDetail] = useState<string | null>(null)
  const [leaving, setLeaving] = useState(false)
  const [log, setLog] = useState<LogEntry[]>([])

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
    if (next !== 'proj') {
      // 離開專案視角時直接收起詳情（無動畫）
      setDetail(null)
      setLeaving(false)
    }
  }

  const openDetail = (name: string) => {
    if (!PROJECT_DETAILS[name]) return
    setLeaving(false)
    setDetail(name)
  }

  const closeDetail = () => {
    setLeaving(true)
    setTimeout(() => {
      setDetail(null)
      setLeaving(false)
    }, 300)
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
            <span className="dot dot-active breathe" />6 Active
          </span>
          <span className="div" />
          <span className="seg">
            <span className="dot dot-idle" />2 Idle
          </span>
          <span className="div" />
          <span className="seg">
            <span className="dot dot-incubating" />5 Incubating
          </span>
        </div>
        <div className="dash-top-right">
          <span className="last-update">
            最後更新 <span className="tnum">剛剛</span>
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

          {/* Tab 1：員工總覽 */}
          <section className={`pane${tab === 'emp' ? ' active' : ''}`}>
            <div className="emp-grid">
              {EMPLOYEES.map((e) => {
                const isIdle = e.status === 'idle'
                return (
                  <div key={e.name} className="emp-card" onMouseMove={handleTiltMove} onMouseLeave={handleTiltLeave}>
                    <div className="emp-head">
                      <div className="emp-avatar" style={{ background: AV_COLORS[e.name] }}>
                        {e.name[0]}
                      </div>
                      <div>
                        <div className="emp-name">
                          <span className={`dot dot-${e.status}${e.status !== 'idle' ? ' breathe' : ''}`} />
                          {e.name}
                        </div>
                        <div className="emp-role">{e.role}</div>
                      </div>
                      <span className="emp-status-pill">
                        <span className={`dot dot-${e.status}`} />
                        {STATUS_LABEL[e.status]}
                      </span>
                    </div>
                    <div className="task-block">
                      <div className="tb-label">{isIdle ? '最近活動' : '當前任務'}</div>
                      {e.tasks.map((t, i) => (
                        <div key={i} className={`task-item${isIdle ? ' idle' : ''}`}>
                          <span className="pri" />
                          <span>{t}</span>
                        </div>
                      ))}
                    </div>
                    <div className="emp-foot">
                      <div className="chips">
                        {e.chips.map((c) => (
                          <span key={c} className="chip">
                            {c}
                          </span>
                        ))}
                      </div>
                      <span className="emp-time">{e.time}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Tab 2：專案視角 */}
          <section className={`pane${tab === 'proj' ? ' active' : ''}`}>
            <div className={`proj-list${detail ? ' hidden' : ''}`}>
              {PROJECTS.map((p) => (
                <div
                  key={p.name}
                  className="proj-card"
                  role="button"
                  tabIndex={0}
                  aria-label={`查看 ${p.name} 專案詳情`}
                  onClick={() => openDetail(p.name)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      openDetail(p.name)
                    }
                  }}
                >
                  <div className="proj-head">
                    <span className="proj-title">{p.name}</span>
                    {p.sub && <span className="proj-sub">{p.sub}</span>}
                    <span className="proj-enter">
                      查看詳情
                      <IconArrow />
                    </span>
                  </div>
                  <div className="proj-avatars">
                    {p.people.map((n) => (
                      <span key={n} className="av-person">
                        <span className="av-circle" style={{ background: AV_COLORS[n] }}>
                          {n[0]}
                        </span>
                        <span>{n}</span>
                      </span>
                    ))}
                  </div>
                  <div className="proj-tasks">
                    {p.tasks.map((t, i) => (
                      <div key={i} className="ptask">
                        <span className="pwho">{t.who}</span>
                        <span className="pstate">
                          <span className={`dot dot-${t.state}`} />
                          {STATUS_LABEL[t.state]}
                        </span>
                        <span className="pmsg">{t.msg}</span>
                      </div>
                    ))}
                  </div>
                  <div className="proj-foot">
                    <span>
                      今日 <span className="stat-num">{p.today}</span> 筆 · 本週 <span className="stat-num">{p.week}</span> 筆
                    </span>
                    <span>最後活動 {p.last}</span>
                  </div>
                </div>
              ))}
            </div>
            {detail && <ProjectDetailView name={detail} leaving={leaving} onBack={closeDetail} />}
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
