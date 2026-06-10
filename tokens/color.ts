// tokens/color.ts
// Hive 配色系統 — single source of truth for color.
// 基調：「深夜裡發著暖光的蜂巢」— 冷靜的深色基礎設施 + 蜂蜜琥珀的生命溫度。
export const COLOR = {
  // 基底 — 深色但不純黑，帶極微暖調避免冰冷
  bg: {
    base: '#0B0A09', // 主背景（暖黑，非 #000）
    raised: '#13110E', // 卡片/區塊
    overlay: '#1C1813', // hover / 浮層
  },
  // 蜂蜜琥珀 — 品牌主色，用於 CTA、活動指示、高光
  honey: {
    300: '#FFD89B',
    400: '#FFC56B',
    500: '#F5A623', // ← Primary accent
    600: '#D98818',
  },
  // 蜂巢金屬光 — 邊框、幾何線條
  comb: {
    line: 'rgba(245,166,35,0.14)', // 蜂巢格線
    glow: 'rgba(245,166,35,0.35)', // 活動發光
  },
  // 文字
  text: {
    primary: '#F5F1EA', // 暖白（非純白）
    secondary: '#A8A29A',
    muted: '#6B655C',
  },
  // 狀態色（AI 員工狀態）
  status: {
    live: '#4ADE80', // 運作中（呼吸綠）
    working: '#F5A623', // 處理任務中（琥珀脈動）
    beta: '#60A5FA', // 測試階段
    incubating: '#6B655C', // 孵化中（灰）
  },
} as const

export type Color = typeof COLOR
