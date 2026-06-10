'use client'

import { motion } from 'framer-motion'
import { fadeUp } from '@/lib/motion'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'

type Channel = 'distribution' | 'software' | 'system'

interface ActivityEntry {
  time: string
  actor: string
  emoji: string
  channel: Channel
  message: string
}

// P0 為 hardcoded 假資料，展示格式；P2 將接 SSE 即時事件流。
const FEED: ActivityEntry[] = [
  {
    time: '03:14:07',
    actor: 'Apple',
    emoji: '🍎',
    channel: 'system',
    message: '部署 hive-web@a3f9c1 至 production，健康檢查通過 (218ms)',
  },
  {
    time: '03:11:52',
    actor: 'Iris',
    emoji: '🌸',
    channel: 'distribution',
    message: '回覆供應商報價詢問，附上 3 個替代型號比價表',
  },
  {
    time: '03:09:31',
    actor: 'Steve',
    emoji: '💻',
    channel: 'software',
    message: '完成 Hero section 動效調校，fade-up stagger 70ms',
  },
  {
    time: '03:06:18',
    actor: 'Penny',
    emoji: '🪙',
    channel: 'distribution',
    message: '處理訂單 #VX-20488 退換貨，已通知物流重新出貨',
  },
  {
    time: '03:02:44',
    actor: 'Cora',
    emoji: '📋',
    channel: 'software',
    message: '更新 Roster 區塊規格，新增「上線階段」欄位驗收標準',
  },
  {
    time: '02:58:09',
    actor: 'Meli',
    emoji: '🐝',
    channel: 'system',
    message: '排定今日任務佇列：14 項 software · 9 項 distribution',
  },
  {
    time: '02:55:23',
    actor: 'Apple',
    emoji: '🍎',
    channel: 'system',
    message: '偵測到 API 延遲 p95 上升至 340ms，已自動擴容 1 個節點',
  },
  {
    time: '02:51:47',
    actor: 'Iris',
    emoji: '🌸',
    channel: 'distribution',
    message: '新增潛在客戶至 pipeline，標記為高意向待跟進',
  },
]

const CHANNELS: { key: Channel | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'distribution', label: '分銷業務' },
  { key: 'software', label: '軟體產品' },
  { key: 'system', label: '系統' },
]

const CHANNEL_LABEL: Record<Channel, string> = {
  distribution: '分銷',
  software: '軟體',
  system: '系統',
}

const CHANNEL_COLOR: Record<Channel, string> = {
  distribution: 'text-honey-400',
  software: 'text-status-beta',
  system: 'text-status-live',
}

export function LiveActivity() {
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
            這是蜂巢的活動流。每一行都是某位 AI
            員工剛剛完成的事 — 即時、未經修飾、持續滾動。
          </p>
        </Reveal>

        {/* 篩選器（P0 為靜態展示） */}
        <Reveal className="mt-8 flex flex-wrap gap-2" delay={0.1}>
          {CHANNELS.map((c, i) => (
            <span
              key={c.key}
              className={`rounded-full border px-3.5 py-1 font-mono text-xs transition-colors ${
                i === 0
                  ? 'border-honey-500/50 bg-honey-500/10 text-honey-400'
                  : 'border-comb-line text-text-muted'
              }`}
            >
              {c.label}
            </span>
          ))}
        </Reveal>

        {/* 活動流 */}
        <RevealGroup className="mt-8 overflow-hidden rounded-2xl border border-comb-line bg-bg-raised/60">
          {FEED.map((entry, i) => (
            <RevealItem
              key={i}
              className="flex items-start gap-4 border-b border-comb-line/60 px-5 py-4 font-mono text-sm last:border-b-0"
            >
              <span className="shrink-0 text-text-muted tabular-nums">{entry.time}</span>
              <span className="shrink-0">{entry.emoji}</span>
              <span className="flex-1 leading-relaxed text-text-secondary">
                <span className="font-semibold text-text-primary">{entry.actor}</span>
                <span className={`mx-2 ${CHANNEL_COLOR[entry.channel]}`}>
                  [{CHANNEL_LABEL[entry.channel]}]
                </span>
                {entry.message}
              </span>
            </RevealItem>
          ))}
          <motion.div
            variants={fadeUp}
            className="flex items-center gap-2 px-5 py-3.5 font-mono text-xs text-text-muted"
          >
            <span className="hive-breathe inline-block h-1.5 w-1.5 rounded-full bg-status-live" />
            串流中…
          </motion.div>
        </RevealGroup>
      </div>
    </section>
  )
}
