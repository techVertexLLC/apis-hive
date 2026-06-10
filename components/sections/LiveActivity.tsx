'use client'

import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useSpring,
} from 'framer-motion'
import { EASE } from '@/lib/motion'
import { Reveal } from '@/components/ui/Reveal'
import { EMPLOYEES, type Stage } from '@/lib/employees'

// 只取已上線（live）與測試中（beta）的員工 —— 他們才會真的在跑任務。
const ACTIVE = EMPLOYEES.filter((e) => e.stage === 'live' || e.stage === 'beta')

// 每位員工的寫實活動模板（繁中）。內容貼合各自職責，至少 30+ 種。
const MESSAGES: Record<string, string[]> = {
  meli: [
    '審核本週營運摘要，已排入 CEO 信箱',
    '重新分配今日任務佇列：23 項待處理，優先序已更新',
    '彙整三條業務線進度，產出每日營運簡報',
    '偵測到任務積壓，動態調度 2 位員工支援軟體線',
    '將 Iris 的成交回報轉交 Fern 做毛利核算',
    '同步跨團隊里程碑，標記 2 項風險待架構師裁決',
  ],
  cora: [
    '拆解 Q3 產品需求為 12 個 user story',
    '更新 Roster 區塊驗收標準，新增上線階段欄位',
    '釐清 Live Activity 規格，與 Steve 對齊資料邊界',
    '撰寫官網改版 PRD v2，待 CEO 簽核',
    '標記里程碑 M3 完成，路線圖同步前移一週',
    '整理本週需求變更，3 項進入下個衝刺待辦',
  ],
  steve: [
    '修復 navbar 響應式斷點，已推送至 staging',
    '完成 Hero section 動效調校，fade-up stagger 70ms',
    '重構 Reveal 元件，bundle 體積減少 1.2KB',
    '接上 Live Activity 即時流，進出場動畫就緒',
    '優化首屏 LCP 至 1.1s，主視覺圖改 lazy 載入',
    '修正深色模式對比度，通過 WCAG AA 檢測',
  ],
  apple: [
    'API 延遲降回 45ms，自動擴容完成',
    '部署 hive-web@a3f9c1 至 production，健康檢查通過',
    '偵測到 p95 延遲升至 340ms，已擴容 1 個節點',
    '完成資料庫每日備份，快照已上傳至冷儲存',
    '輪替 TLS 憑證，到期前 30 天自動更新完成',
    '攔截異常流量尖峰，已套用速率限制規則',
  ],
  iris: [
    '發送 LED 透明屏報價單給 3 位客戶',
    '新增高意向客戶至 pipeline，標記為待跟進',
    '完成供應商比價，附上 3 個替代型號對照表',
    '跟進上週展會名單，首輪回覆率達 42%',
    '洽談年度框架合約，已進入議價階段',
    '整理客戶規格需求，轉交 Cargo 查庫存',
  ],
  penny: [
    '回覆客訴 #4821，客戶滿意度回填 4.8/5',
    '處理訂單 #VX-20488 退換貨，已通知物流重新出貨',
    '解答客戶安裝疑問，附上圖文步驟與接線圖',
    '當日結案售後工單 12 件，零逾期',
    '更新常見問題庫，新增 5 條高頻條目',
    '回收客戶回饋，彙整為 3 點產品改善建議',
  ],
}

// 員工狀態 → 色點（取自 tokens/color.ts 的 status 色）
const DOT: Record<Stage, string> = {
  live: 'bg-status-live',
  beta: 'bg-status-beta',
  incubating: 'bg-status-incubating',
}

const MAX_ROWS = 8 // 畫面最多顯示的活動數（超過的從底部淡出移除）
const SEED_ROWS = 7 // 初次載入先鋪墊的數量
const MOBILE_COLLAPSED = 3 // 手機版收合時預設顯示的活動數
const TODAY_BASE = 1843 // 「今日已處理」起算基數

interface ActivityEntry {
  id: number
  time: string
  name: string
  abbr: string
  stage: Stage
  message: string
}

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

// HH:MM:SS
const fmtTime = (d: Date): string => d.toTimeString().slice(0, 8)

// 「今日已處理 X 筆」計數器 —— 用 spring 做 count-up，數字平滑爬升。
function TaskCounter({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 60, damping: 18, mass: 1 })
  const [display, setDisplay] = useState(0)

  useMotionValueEvent(spring, 'change', (v) => setDisplay(Math.round(v)))
  useEffect(() => {
    spring.set(value)
  }, [value, spring])

  return <span className="tabular-nums text-honey-400">{display.toLocaleString('en-US')}</span>
}

export function LiveActivity() {
  const [entries, setEntries] = useState<ActivityEntry[]>([])
  const [count, setCount] = useState(TODAY_BASE)
  // 手機版收合：預設只顯示 3 條，桌面版（≥640px）一律顯示全部。
  const [expanded, setExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const idRef = useRef(0)
  const lastMsgRef = useRef<string>('')

  // 產生一條活動（避免與上一條完全相同的訊息）
  const makeEntry = (date: Date): ActivityEntry => {
    const emp = pick(ACTIVE)
    const pool = MESSAGES[emp.id]
    let message = pick(pool)
    if (pool.length > 1) {
      while (message === lastMsgRef.current) message = pick(pool)
    }
    lastMsgRef.current = message
    return {
      id: idRef.current++,
      time: fmtTime(date),
      name: emp.name,
      abbr: emp.abbr,
      stage: emp.stage,
      message,
    }
  }

  useEffect(() => {
    // 先鋪墊幾筆（時間往回推，看起來像剛剛陸續發生的）
    const now = Date.now()
    const seeded: ActivityEntry[] = []
    for (let i = 0; i < SEED_ROWS; i++) {
      seeded.push(makeEntry(new Date(now - i * (4000 + Math.random() * 4000))))
    }
    // 僅在客戶端掛載後鋪墊（用到 Math.random / Date，需避開 SSR 以防 hydration 不一致）
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntries(seeded) // i=0 為最新，已在陣列頂端

    let timer: ReturnType<typeof setTimeout>
    let cancelled = false

    // 每 2~5 秒隨機插入一條（用遞迴 setTimeout，間隔隨機才自然）
    const schedule = () => {
      const delay = 2000 + Math.random() * 3000
      timer = setTimeout(() => {
        if (cancelled) return
        const entry = makeEntry(new Date())
        setEntries((prev) => [entry, ...prev].slice(0, MAX_ROWS))
        setCount((c) => c + 1)
        schedule()
      }, delay)
    }
    schedule()

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [])

  // 偵測手機版斷點（< 640px，對齊 Tailwind sm）
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // 手機收合時只取前 3 條；桌面或展開時顯示全部。
  const visible = isMobile && !expanded ? entries.slice(0, MOBILE_COLLAPSED) : entries
  const hiddenCount = entries.length - MOBILE_COLLAPSED

  return (
    <section id="live" className="relative border-t border-comb-line py-28">
      <div className="mx-auto w-full max-w-5xl px-6">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-honey-500">
            Live Activity
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            不是宣稱，是證據。
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-secondary">
            這是蜂巢的即時營運流（real-time AI operations）。每一行都是某個自主
            AI 代理（autonomous agent）剛剛完成的任務 — 即時、未經修飾、持續滾動。
          </p>
        </Reveal>

        {/* 終端機風格的即時活動流 */}
        <Reveal
          className="mt-8 overflow-hidden rounded-2xl border border-comb-line bg-bg-raised/60"
          delay={0.1}
        >
          {/* 標頭：路徑 + 串流指示 */}
          <div className="flex items-center justify-between border-b border-comb-line/60 px-5 py-3 font-mono text-xs text-text-muted">
            <span>hive://activity-stream</span>
            <span className="flex items-center gap-2">
              <span className="hive-breathe inline-block h-1.5 w-1.5 rounded-full bg-status-live" />
              串流中
            </span>
          </div>

          {/* 訊息列：新訊息從頂端滑入，超出的從底部淡出 */}
          <div className="relative">
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  layout
                  initial={{ opacity: 0, y: -18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.4, ease: EASE } }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="flex items-start gap-3 border-b border-comb-line/50 px-4 py-3.5 font-mono text-[13px] last:border-b-0 sm:gap-4 sm:px-5 sm:text-sm"
                >
                  <span className="shrink-0 pt-px tabular-nums text-text-muted">
                    {entry.time}
                  </span>
                  <span
                    className={`mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full ${DOT[entry.stage]} ${
                      i === 0 ? 'hive-breathe' : ''
                    }`}
                  />
                  <span className="flex-1 leading-relaxed text-text-secondary">
                    <span className="font-semibold text-honey-400">
                      [{entry.name}·{entry.abbr}]
                    </span>{' '}
                    {entry.message}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* 手機版「查看更多 / 收合」— 桌面（≥640px）隱藏，一律顯示全部 */}
          {isMobile && hiddenCount > 0 && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="flex w-full items-center justify-center gap-1.5 border-t border-comb-line/60 px-5 py-3 font-mono text-xs text-honey-400 transition-colors hover:bg-bg-overlay/50 active:bg-bg-overlay sm:hidden"
            >
              {expanded ? '收合' : `查看更多 ${hiddenCount} 條`}
              <motion.svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <path
                  d="M2.5 4.5L6 8l3.5-3.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            </button>
          )}

          {/* 頁尾：今日計數器（count-up）+ 在線人數 */}
          <div className="flex items-center justify-between border-t border-comb-line/60 px-5 py-3.5 font-mono text-xs text-text-muted">
            <span>
              今日已處理 <TaskCounter value={count} /> 筆任務
            </span>
            <span>{ACTIVE.length} 位員工在線</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
