/**
 * 終端機風格的閃爍游標 —— 接在「Live」等狀態字樣後，強化「正在運轉」的即時感。
 * 純 CSS 動畫（.cursor-blink），自動 honor prefers-reduced-motion。
 */
export function BlinkCursor({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`cursor-blink ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-[0.06em] bg-current ${className ?? ''}`}
    />
  )
}
