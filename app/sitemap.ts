import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    {
      url: SITE.url,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE.url}/team`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE.url}/about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]
}
