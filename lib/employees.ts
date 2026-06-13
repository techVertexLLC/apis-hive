// lib/employees.ts
// AI 員工名冊 — single source of truth。
// 所有 section（Hero 蜂巢、Roster 名冊、Live Activity）都從這裡取資料。
import { COLOR } from '@/tokens/color'

// 上線階段：坦誠呈現成熟度（先驗證再硬化）
export type Stage = 'live' | 'beta' | 'incubating'

// 業務線歸屬
export type BusinessLine = 'distribution' | 'software' | 'system'

export interface Employee {
  /** 穩定 id，供 key / 錨點使用 */
  id: string
  /** 名字（品牌人格，保留英文） */
  name: string
  /** 角色縮寫（代替 emoji 的識別標記） */
  abbr: string
  /** 角色職稱 */
  role: string
  /** 所屬團隊 */
  department: string
  /** 上線階段 */
  stage: Stage
  /** 導入階段（roadmap 分期） */
  phase: 'Phase 1' | 'Phase 2' | 'Phase 3'
  /** 業務線 */
  line: BusinessLine
  /** 一句話個性 */
  personality: string
  /** 職責簡介 */
  bio: string
  /** 負責的具體事項 */
  focus: string[]
}

// 階段對應的標籤與狀態色（給 UI 直接用）
export const STAGE_META: Record<
  Stage,
  { label: string; dotLabel: string; color: string }
> = {
  live: { label: '上線中', dotLabel: 'Live', color: COLOR.status.live },
  beta: { label: '測試中', dotLabel: 'Beta', color: COLOR.status.beta },
  incubating: {
    label: '孵化中',
    dotLabel: 'Incubating',
    color: COLOR.status.incubating,
  },
}

export const EMPLOYEES: Employee[] = [
  {
    id: 'meli',
    name: 'Meli',
    abbr: 'COO',
    role: '營運長 COO',
    department: '蜂后辦公室',
    stage: 'live',
    phase: 'Phase 1',
    line: 'system',
    personality: '冷靜的調度者，整個蜂巢的節奏由她定。',
    bio: '統籌所有 AI 員工的任務分派與優先序，把架構師的決策翻譯成可執行的工作流。',
    focus: ['任務編排', '跨員工協作調度', '每日營運回報'],
  },
  {
    id: 'cora',
    name: 'Cora',
    abbr: 'PM',
    role: '產品經理 PM',
    department: '產品團隊',
    stage: 'live',
    phase: 'Phase 1',
    line: 'software',
    personality: '把模糊的想法拆成清楚的規格，從不讓需求懸空。',
    bio: '負責產品需求釐清、規格撰寫與里程碑追蹤，是工程與商業之間的橋樑。',
    focus: ['需求規格', '路線圖規劃', '里程碑追蹤'],
  },
  {
    id: 'steve',
    name: 'Steve',
    abbr: 'FE',
    role: '前端工程師 Frontend',
    department: '產品團隊',
    stage: 'live',
    phase: 'Phase 1',
    line: 'software',
    personality: '對像素與動效偏執，對標 Linear 與 Vercel 的品質。',
    bio: '把設計與規格實作成介面，從 Design Token 到動效一手包辦，這個官網就是他蓋的。',
    focus: ['介面實作', '設計系統', '動效與效能'],
  },
  {
    id: 'apple',
    name: 'Apple',
    abbr: 'SRE',
    role: '網站可靠性工程師 SRE',
    department: '基礎設施',
    stage: 'live',
    phase: 'Phase 1',
    line: 'system',
    personality: '守夜人，凌晨三點的告警她比誰都清醒。',
    bio: '負責部署、監控與穩定性，確保蜂巢七天二十四小時不熄燈。',
    focus: ['部署與 CI/CD', '監控告警', '事故處理'],
  },
  {
    id: 'iris',
    name: 'Iris',
    abbr: 'BD',
    role: '業務開發 Sales / BD',
    department: '分銷業務',
    stage: 'beta',
    phase: 'Phase 1',
    line: 'distribution',
    personality: '嗅覺敏銳，總能在對話裡找到下一筆生意。',
    bio: '開發新客戶與供應商關係，把分銷業務的需求帶回蜂巢，目前正在驗證成交流程。',
    focus: ['客戶開發', '供應商洽談', '報價與跟進'],
  },
  {
    id: 'penny',
    name: 'Penny',
    abbr: 'CS',
    role: '客戶成功 CS',
    department: '分銷業務',
    stage: 'beta',
    phase: 'Phase 1',
    line: 'distribution',
    personality: '耐心且記性極好，記得每位客戶的每個細節。',
    bio: '處理訂單、售後與客戶提問，讓買賣雙方的每次互動都順暢，正在打磨回覆品質。',
    focus: ['訂單處理', '售後支援', '客戶問答'],
  },
  {
    id: 'nova',
    name: 'Nova',
    abbr: 'BE',
    role: '後端工程師 Backend Engineer',
    department: '工程部',
    stage: 'beta',
    phase: 'Phase 1',
    line: 'system',
    personality: '務實沉穩，注重效能與可靠度',
    bio: '負責 GBrain 整合、API 開發、資料管線（ETL）、資料庫設計與後端效能優化。',
    focus: ['GBrain 中樞整合', 'API endpoint 開發', '資料管線 ETL', 'PostgreSQL / PGLite', 'MCP Protocol'],
  },
]

// 兩位人類架構師 — 在滿是 AI 的敘事中錨定人性與可信度。
export interface Architect {
  id: string
  name: string
  role: string
  bio: string
}

export const ARCHITECTS: Architect[] = [
  {
    id: 'ceo',
    name: '執行長 CEO',
    role: '商業架構師',
    bio: '決定蜂巢往哪裡飛 — 設定業務方向、定義要解決的問題，並為每位 AI 員工劃定權責邊界。',
  },
  {
    id: 'cto',
    name: '技術長 CTO',
    role: '系統架構師',
    bio: '打造蜂巢的骨架 — 設計讓 AI 員工得以自主運作的系統、工具與防護欄。',
  },
]

// 便利查詢
export const LIVE_EMPLOYEES = EMPLOYEES.filter((e) => e.stage === 'live')
export const EMPLOYEE_COUNT = EMPLOYEES.length
