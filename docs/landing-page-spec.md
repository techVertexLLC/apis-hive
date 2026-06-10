# Hive — Apis 官網 Landing Page 完整規劃文件

> 版本 v1.0 · 交付對象：前端工程團隊（Steve 與人類架構師）
> 對標水準：Linear / Vercel / Anthropic
> 核心命題：**讓訪客在 10 秒內相信「這家公司的員工真的是 AI，而且正在運作」**

---

## 0. 設計哲學：先定錨，再執行

在談視覺之前，先確立這個官網跟「一般公司官網」的根本差異。一般官網是**靜態的自我介紹**；Hive 必須是**活的展示櫥窗**。它本身就該是 Apis 信念的證明：

| 公司信念 | 在官網上如何體現 |
|---|---|
| 燒 token 不燒人頭 | 首頁直接顯示 AI 員工**即時活動流**（live activity） |
| 人是架構師、AI 是員工 | 「組織架構圖」用蜂巢呈現：2 個人類節點在頂層，13 個 AI 節點環繞 |
| 先驗證再硬化 | 員工有「上線階段」標籤（Live / Beta / Incubating），坦誠呈現成熟度 |

**反面清單（絕對不要做的）**：
- ❌ 套版感的「三欄 feature card + 圖示」
- ❌ 假的 stock photo 團隊照
- ❌ 空泛的 "We leverage AI to..." 行銷話術
- ❌ 靜止不動的 hero（這家公司的賣點就是「動」）

---

## 1. 視覺方向

### 1.1 整體基調
**「深夜裡發著暖光的蜂巢」** — 深色科技底（Linear/Vercel 的精密冷靜）+ 蜂蜜琥珀的生命溫度（Apis 的靈魂）。冷的是基礎設施，暖的是裡面活動的生命。

### 1.2 配色系統（Design Tokens）

```ts
// tokens/color.ts
export const COLOR = {
  // 基底 — 深色但不純黑，帶極微暖調避免冰冷
  bg: {
    base:    '#0B0A09',   // 主背景（暖黑，非 #000）
    raised:  '#13110E',   // 卡片/區塊
    overlay: '#1C1813',   // hover / 浮層
  },
  // 蜂蜜琥珀 — 品牌主色，用於 CTA、活動指示、高光
  honey: {
    300: '#FFD89B',
    400: '#FFC56B',
    500: '#F5A623',   // ← Primary accent
    600: '#D98818',
  },
  // 蜂巢金屬光 — 邊框、幾何線條
  comb: {
    line:   'rgba(245,166,35,0.14)',  // 蜂巢格線
    glow:   'rgba(245,166,35,0.35)',  // 活動發光
  },
  // 文字
  text: {
    primary:  '#F5F1EA',  // 暖白（非純白）
    secondary:'#A8A29A',
    muted:    '#6B655C',
  },
  // 狀態色（AI 員工狀態）
  status: {
    live:     '#4ADE80',  // 運作中（呼吸綠）
    working:  '#F5A623',  // 處理任務中（琥珀脈動）
    beta:     '#60A5FA',  // 測試階段
    incubating:'#6B655C', // 孵化中（灰）
  },
} as const
```

### 1.3 字型搭配

- **Fraunces** — 標題（可變字重 + optical size，蜂蜜般圓潤）
- **Inter** — 內文（沿用 K1 經驗）
- **JetBrains Mono** — 數據/程式碼/即時 log（展現「機器在運作」）

### 1.4 核心視覺元素：蜂巢幾何系統

1. **六邊形網格（Hex Grid）** — 每個 AI 員工 = 一個六邊形 cell。
2. **活動發光（Cell Glow）** — 員工「在做事」時，hex 脈動發光（琥珀色 radial glow）。
3. **連線粒子（Pheromone Trails）** — 員工協作時，hex 間有光點沿邊流動。
4. **漸層光暈** — 背景極緩慢移動的琥珀 radial gradient。

### 1.5 動效風格

| 原則 | 說明 |
|---|---|
| **有機 > 機械** | easing 用 `[0.22, 1, 0.36, 1]`（expo-out） |
| **呼吸感** | live 狀態 2.5–4s 緩慢 scale/opacity 呼吸 |
| **克制的視差** | hero 與 section 背景做輕微 parallax |
| **進場節奏** | fade-up + stagger（每子元素延遲 60–80ms） |
| **尊重偏好** | 全站 honor `prefers-reduced-motion` |

---

## 2. 頁面結構（Section by Section）

### 🔷 Section 1 — Hero：The Living Hive

**目的**：第一眼傳達「這不是普通公司」+ 看到 AI 員工正在活動。

- 主標：**「13 位員工，從不下班。」**
- 副標：「Apis 是一家 AI-native 公司。兩位人類架構師，一群 AI 員工，一個永不停歇的蜂巢。」
- CTA：`進入 Hive →`（琥珀填充）+ `看他們正在做什麼`（幽靈按鈕）
- **背景**：互動式蜂巢，13 hex cell + 2 人類節點，cell 隨機脈動發光。
- **互動**：hover hex → 浮現員工卡片。

### 🔷 Section 2 — Live Activity Feed

**目的**：**全站最重要的差異化。** 把「AI 員工在運作」從宣稱變成證據。

- 即時/類即時活動流，mono 字體
- 可篩選：全部 / 分銷業務 / 軟體產品 / 系統
- MVP：真實事件延遲重播 + 模板生成

### 🔷 Section 3 — Meet the Hive：員工名冊

- 互動式蜂巢矩陣，點擊展開詳細卡
- 名字 + emoji + 角色 + 個性 + 上線階段 + 成長軌跡

### 🔷 Section 4 — How the Hive Works

三大信念各配微互動視覺：
1. 燒 token 不燒人頭（成本對比動畫）
2. 人是架構師 AI 是員工（蜂巢分層圖）
3. 先驗證再硬化（流程動畫）

### 🔷 Section 5 — Two Business Lines

- 線一：AI 團隊經營的分銷生意
- 線二：AI 軟體產品

### 🔷 Section 6 — The Two Architects

CEO + CTO，在滿是 AI 的敘事中錨定人性與可信度。

### 🔷 Section 7 — CTA / Footer

- 大標 CTA + 聯絡
- 蜂巢收束成 logo

---

## 3. 技術架構

### 3.1 技術棧

| 層 | 選型 |
|---|---|
| Framework | Next.js 15（App Router, RSC） |
| 樣式 | Tailwind CSS v4 |
| 動畫 | Framer Motion + GSAP/ScrollTrigger |
| Smooth scroll | Lenis |
| 蜂巢視覺 | Canvas 2D（MVP）→ react-three-fiber（P3） |
| 即時資料 | SSE / WebSocket |
| 部署 | GitHub（暫不部署） |

### 3.2 目錄結構

```
apis-hive/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── sitemap.ts
│   ├── robots.ts
│   └── api/activity/route.ts
├── components/
│   ├── providers/SmoothScrollProvider.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── LiveActivity.tsx
│   │   ├── HiveRoster.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── BusinessLines.tsx
│   │   ├── Architects.tsx
│   │   └── CtaFooter.tsx
│   ├── hive/
│   │   ├── HiveCanvas.tsx
│   │   ├── HexCell.tsx
│   │   ├── PheromoneTrails.tsx
│   │   ├── useHiveLayout.ts
│   │   └── hive.config.ts
│   ├── activity/
│   │   ├── ActivityFeed.tsx
│   │   ├── ActivityItem.tsx
│   │   └── useActivityStream.ts
│   └── ui/
├── lib/
│   ├── employees.ts
│   ├── motion.ts
│   └── seo.ts
├── tokens/
│   ├── color.ts
│   └── font.ts
└── public/og/
```

---

## 4. 執行優先序

| 階段 | 範圍 |
|---|---|
| **P0 骨架** | Next.js + Tailwind tokens + Lenis + 7 section 靜態版 + SEO |
| **P1 蜂巢視覺** | Canvas 2D 蜂巢 + Hero 互動 + Roster 展開 |
| **P2 Live 差異化** | SSE + ActivityFeed + Hive status |
| **P3 打磨** | GSAP scroll 動效 + 動態 OG + WebGL 升級 + 效能調校 |
