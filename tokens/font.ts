// tokens/font.ts
// 字型搭配 — 與 app/layout.tsx 載入的 next/font CSS variables 對齊。
//   Fraunces      → 標題（可變字重 + optical size，蜂蜜般圓潤）
//   Inter         → 內文
//   JetBrains Mono → 數據 / 程式碼 / 即時 log（展現「機器在運作」）
export const FONT = {
  display: 'var(--font-fraunces)', // 標題
  sans: 'var(--font-inter)', // 內文
  mono: 'var(--font-jetbrains-mono)', // 數據 / log
} as const

export type Font = typeof FONT
