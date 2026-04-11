import type { MetadataRoute } from 'next'
import { client } from '@/sanity/client'

export const revalidate = 3600 // regenerate sitemap every hour

const BASE_URL = 'https://www.allegade10.dk'

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: `${BASE_URL}/`, priority: 1.0, changeFrequency: 'weekly' },
  { url: `${BASE_URL}/restaurant`, priority: 0.9, changeFrequency: 'monthly' },
  { url: `${BASE_URL}/hotel`, priority: 0.9, changeFrequency: 'monthly' },
  { url: `${BASE_URL}/menukort`, priority: 0.8, changeFrequency: 'weekly' },
  { url: `${BASE_URL}/selskaber`, priority: 0.8, changeFrequency: 'monthly' },
  { url: `${BASE_URL}/begivenheder`, priority: 0.8, changeFrequency: 'daily' },
  { url: `${BASE_URL}/karriere`, priority: 0.6, changeFrequency: 'weekly' },
  { url: `${BASE_URL}/om-os`, priority: 0.6, changeFrequency: 'monthly' },
  { url: `${BASE_URL}/kontakt`, priority: 0.6, changeFrequency: 'monthly' },
  { url: `${BASE_URL}/privatlivspolitik`, priority: 0.3, changeFrequency: 'yearly' },
  { url: `${BASE_URL}/cookiepolitik`, priority: 0.3, changeFrequency: 'yearly' },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Active job postings
  const jobs = await client.fetch<{ slug: string }[]>(
    `*[_type == "jobPosting" && isActive == true && defined(slug.current)]{ "slug": slug.current }`
  )

  // Published generic pages not already covered by static routes
  const staticSlugs = new Set(['kontakt', 'om-os', 'privatlivspolitik'])
  const pages = await client.fetch<{ slug: string }[]>(
    `*[_type == "page" && isPublished == true && defined(slug.current)]{ "slug": slug.current }`
  )

  const jobRoutes: MetadataRoute.Sitemap = jobs.map(({ slug }) => ({
    url: `${BASE_URL}/karriere/${slug}`,
    priority: 0.5,
    changeFrequency: 'monthly',
  }))

  const pageRoutes: MetadataRoute.Sitemap = pages
    .filter(({ slug }) => !staticSlugs.has(slug))
    .map(({ slug }) => ({
      url: `${BASE_URL}/${slug}`,
      priority: 0.5,
      changeFrequency: 'monthly',
    }))

  return [...STATIC_ROUTES, ...jobRoutes, ...pageRoutes]
}
