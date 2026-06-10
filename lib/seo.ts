// lib/seo.ts
// 集中管理站台 metadata 與結構化資料（JSON-LD）。
import type { Metadata } from 'next'

export const SITE = {
  name: 'Apis',
  brand: 'Hive',
  url: 'https://apis.bot',
  title: 'Apis Hive — 13 位員工，從不下班。',
  description:
    'Apis 是一家 AI-native 公司：兩位人類架構師領著一支自主運作的 AI 勞動力（autonomous AI workforce）。即時的 AI 營運流、AI 驅動分銷與 AI 軟體產品，由 13 位 AI 員工組成的蜂巢全天候運轉。',
  locale: 'zh_TW',
} as const

export function buildMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: SITE.title,
      template: `%s — ${SITE.name} ${SITE.brand}`,
    },
    description: SITE.description,
    applicationName: `${SITE.name} ${SITE.brand}`,
    keywords: [
      'Apis',
      'Hive',
      'AI-native company',
      'autonomous AI workforce',
      'autonomous agents',
      'real-time AI operations',
      'AI employees',
      'AI team members',
      'AI-powered operations',
      'human-AI collaboration',
      'AI-driven distribution',
      'AI software products',
      'AI 員工',
      'AI 公司',
      '自動化營運',
    ],
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      locale: SITE.locale,
      url: SITE.url,
      siteName: `${SITE.name} ${SITE.brand}`,
      title: SITE.title,
      description: SITE.description,
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE.title,
      description: SITE.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

// JSON-LD Organization schema — 給搜尋引擎理解 Apis 是什麼。
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    alternateName: `${SITE.name} ${SITE.brand}`,
    url: SITE.url,
    description: SITE.description,
    slogan: '13 位員工，從不下班。',
    foundingDate: '2025',
    knowsAbout: ['AI-native operations', 'Autonomous AI agents', 'Distribution', 'Software products'],
  } as const
}
