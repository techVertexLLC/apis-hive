// lib/activity.ts
// Live Activity 的共用資料與工具 —— 首頁精簡版（LiveActivityPreview）與
// /activity 完整頁（ActivityStream）共用同一套訊息模板與產生邏輯。
import { EMPLOYEES, type Stage } from '@/lib/employees'

// 只取已上線（live）與測試中（beta）的員工 —— 他們才會真的在跑任務。
export const ACTIVE = EMPLOYEES.filter(
  (e) => e.stage === 'live' || e.stage === 'beta',
)

// 活動分類（給 /activity 篩選用）—— 依職責歸入四大類。
export type ActivityCategory = 'all' | 'ops' | 'dev' | 'sales' | 'support'

export const CATEGORY_META: Record<
  Exclude<ActivityCategory, 'all'>,
  { label: string }
> = {
  ops: { label: '營運' },
  dev: { label: '開發' },
  sales: { label: '業務' },
  support: { label: '客服' },
}

// 篩選器顯示順序（含「全部」）
export const FILTERS: { key: ActivityCategory; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'ops', label: '營運' },
  { key: 'dev', label: '開發' },
  { key: 'sales', label: '業務' },
  { key: 'support', label: '客服' },
]

// 員工 → 分類（只需涵蓋 ACTIVE 成員）
export const EMPLOYEE_CATEGORY: Record<string, Exclude<ActivityCategory, 'all'>> = {
  meli: 'ops',
  apple: 'dev',
  cora: 'dev',
  steve: 'dev',
  iris: 'sales',
  penny: 'support',
}

// 員工狀態 → 色點（取自 tokens/color.ts 的 status 色）
export const DOT: Record<Stage, string> = {
  live: 'bg-status-live',
  beta: 'bg-status-beta',
  incubating: 'bg-status-incubating',
}

// 每位員工的寫實活動模板（繁中）。內容貼合各自職責。
export const MESSAGES: Record<string, string[]> = {
  meli: [
    '審核本週營運摘要，已排入 CEO 信箱',
    '重新分配今日任務佇列：23 項待處理，優先序已更新',
    '彙整三條業務線進度，產出每日營運簡報',
    '偵測到任務積壓，動態調度 2 位員工支援軟體線',
    '將 Iris 的成交回報轉交 Fern 做毛利核算',
    '同步跨團隊里程碑，標記 2 項風險待架構師裁決',
    '收斂晨會結論，把 5 個決策拆成可指派的任務',
    '平衡今日工作負載，Steve 的佇列勻 3 項給 Quinn',
    '盤點本週交付，準時率 96%，2 項提前完成',
  ],
  cora: [
    '拆解 Q3 產品需求為 12 個 user story',
    '更新 Roster 區塊驗收標準，新增上線階段欄位',
    '釐清 Live Activity 規格，與 Steve 對齊資料邊界',
    '撰寫官網改版 PRD v2，待 CEO 簽核',
    '標記里程碑 M3 完成，路線圖同步前移一週',
    '整理本週需求變更，3 項進入下個衝刺待辦',
    '替模糊的需求補上驗收條件，退回 1 張規格重寫',
    '和分銷線對齊報價流程，畫出第一版狀態圖',
  ],
  steve: [
    '修復 navbar 響應式斷點，已推送至 staging',
    '完成 Hero section 動效調校，fade-up stagger 70ms',
    '重構 Reveal 元件，bundle 體積減少 1.2KB',
    '接上 Live Activity 即時流，進出場動畫就緒',
    '優化首屏 LCP 至 1.1s，主視覺圖改 lazy 載入',
    '修正深色模式對比度，通過 WCAG AA 檢測',
    '統一全站行高與字距，正文閱讀體驗再升一級',
    '補齊鍵盤焦點環，所有可點擊元素都能 tab 到',
    '把 footer 抽成共用元件，三個頁面收尾一致',
  ],
  apple: [
    'API 延遲降回 45ms，自動擴容完成',
    '部署 hive-web@a3f9c1 至 production，健康檢查通過',
    '偵測到 p95 延遲升至 340ms，已擴容 1 個節點',
    '完成資料庫每日備份，快照已上傳至冷儲存',
    '輪替 TLS 憑證，到期前 30 天自動更新完成',
    '攔截異常流量尖峰，已套用速率限制規則',
    '凌晨例行巡檢完成，全服務綠燈、無待處理告警',
    '把建置時間從 18s 壓到 11s，快取命中率拉高',
  ],
  iris: [
    '整理 3 份產品報價單並寄出給潛在客戶',
    '新增高意向客戶至 pipeline，標記為待跟進',
    '完成供應商比價，附上 3 個替代型號對照表',
    '跟進上週展會名單，首輪回覆率達 42%',
    '洽談年度框架合約，已進入議價階段',
    '整理客戶規格需求，轉交 Cargo 查庫存',
    '回收一筆沉睡三個月的詢價，客戶重啟評估',
    '彙整本週商機，新增 7 筆進入漏斗、2 筆待報價',
  ],
  penny: [
    '回覆客訴 #4821，客戶滿意度回填 4.8/5',
    '處理訂單 #VX-20488 退換貨，已通知物流重新出貨',
    '解答客戶安裝疑問，附上圖文步驟與接線圖',
    '當日結案售後工單 12 件，零逾期',
    '更新常見問題庫，新增 5 條高頻條目',
    '回收客戶回饋，彙整為 3 點產品改善建議',
    '主動回訪上月成交客戶，確認到貨與使用狀況',
    '把一通急件客訴在 8 分鐘內安撫並排程到府檢修',
  ],
}

export interface ActivityEntry {
  id: number
  time: string
  name: string
  abbr: string
  stage: Stage
  category: Exclude<ActivityCategory, 'all'>
  message: string
}

export const pick = <T,>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)]

// HH:MM:SS
export const fmtTime = (d: Date): string => d.toTimeString().slice(0, 8)

/**
 * 產生一個活動工廠 —— 自帶遞增 id 與「避免連續重複訊息」的狀態。
 * 每個 component 實例各持一份，互不干擾。
 */
export function createActivityFactory(pool = ACTIVE) {
  let id = 0
  let lastMsg = ''
  return function makeEntry(date: Date): ActivityEntry {
    const emp = pick(pool)
    const msgs = MESSAGES[emp.id]
    let message = pick(msgs)
    if (msgs.length > 1) {
      while (message === lastMsg) message = pick(msgs)
    }
    lastMsg = message
    return {
      id: id++,
      time: fmtTime(date),
      name: emp.name,
      abbr: emp.abbr,
      stage: emp.stage,
      category: EMPLOYEE_CATEGORY[emp.id],
      message,
    }
  }
}
