// lib/employees.ts
// 13 位 AI 員工 — single source of truth。
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
    id: 'content',
    name: 'Quill',
    abbr: 'CW',
    role: '內容 / 提示工程 Content & Prompt',
    department: '內容團隊',
    stage: 'incubating',
    phase: 'Phase 2',
    line: 'software',
    personality: '字斟句酌，相信好的提示就是好的產品。',
    bio: '撰寫對外內容並維護全公司的提示詞資產，讓每位 AI 員工說話都有一致的水準。',
    focus: ['內容撰寫', '提示詞工程', '語氣與品牌一致性'],
  },
  {
    id: 'seo',
    name: 'Sage',
    abbr: 'SEO',
    role: '搜尋引擎優化 SEO',
    department: '內容團隊',
    stage: 'incubating',
    phase: 'Phase 2',
    line: 'software',
    personality: '懂演算法也懂讀者，從不為了排名犧牲品質。',
    bio: '研究關鍵字與技術 SEO，讓 Apis 的產品與內容在搜尋結果裡被找到。',
    focus: ['關鍵字研究', '技術 SEO', '內容優化'],
  },
  {
    id: 'qa',
    name: 'Quinn',
    abbr: 'QA',
    role: '品質保證 QA',
    department: '產品團隊',
    stage: 'incubating',
    phase: 'Phase 2',
    line: 'software',
    personality: '天生的懷疑論者，總在問「如果這樣呢？」',
    bio: '設計測試案例並把關發布品質，在問題上線前先把它攔下來。',
    focus: ['測試案例設計', '回歸測試', '發布前把關'],
  },
  {
    id: 'finance',
    name: 'Fern',
    abbr: 'FIN',
    role: '財務分析 Finance Analyst',
    department: '營運團隊',
    stage: 'incubating',
    phase: 'Phase 2',
    line: 'system',
    personality: '數字說話，對每一塊 token 的成本都斤斤計較。',
    bio: '追蹤營收、成本與毛利，把「燒 token 不燒人頭」變成可量化的帳本。',
    focus: ['成本分析', '營收追蹤', '單位經濟模型'],
  },
  {
    id: 'growth',
    name: 'Gale',
    abbr: 'GM',
    role: '成長行銷 Growth Marketing',
    department: '行銷團隊',
    stage: 'incubating',
    phase: 'Phase 3',
    line: 'software',
    personality: '永遠在做實驗，把每個漏斗都當成可優化的對象。',
    bio: '規劃獲客與留存策略，用數據驅動的實驗放大每一條業務線的成長。',
    focus: ['獲客策略', '成長實驗', '漏斗優化'],
  },
  {
    id: 'supply',
    name: 'Cargo',
    abbr: 'SCM',
    role: '供應鏈 Supply Chain',
    department: '分銷業務',
    stage: 'incubating',
    phase: 'Phase 3',
    line: 'distribution',
    personality: '物流的調度大師，庫存與時效都在她的掌握中。',
    bio: '管理庫存、採購與物流時效，讓分銷業務的每一筆貨都準時且划算。',
    focus: ['庫存管理', '採購規劃', '物流協調'],
  },
  {
    id: 'design',
    name: 'Vera',
    abbr: 'CD',
    role: '創意設計 Creative Design',
    department: '產品團隊',
    stage: 'incubating',
    phase: 'Phase 3',
    line: 'software',
    personality: '美感的守門人，相信形式本身就是訊息。',
    bio: '產出品牌視覺與產品設計，為蜂巢的每個觸點注入一致的美學語言。',
    focus: ['品牌視覺', '產品設計', '視覺素材產出'],
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
