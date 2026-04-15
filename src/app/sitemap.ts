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

type SlugRow = { slug: string; lastUpdated?: string }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch slug lists in parallel. Each collection targets documents that are
  // actually publicly visible today (publishAt/unpublishAt respected).
  const [jobs, pages, rooms, upcomingEvents, pastEvents] = await Promise.all([
    client.fetch<SlugRow[]>(
      `*[_type == "jobPosting" && isActive == true
        && (!defined(publishAt) || publishAt <= now())
        && (!defined(unpublishAt) || unpublishAt > now())
        && defined(slug.current)]{
          "slug": slug.current,
          "lastUpdated": _updatedAt
        }`,
    ),
    client.fetch<SlugRow[]>(
      `*[_type == "page" && isPublished == true
        && (!defined(publishAt) || publishAt <= now())
        && defined(slug.current)]{
          "slug": slug.current,
          "lastUpdated": _updatedAt
        }`,
    ),
    client.fetch<SlugRow[]>(
      `*[_type == "hotelRoom" && defined(slug.current)]{
        "slug": slug.current,
        "lastUpdated": _updatedAt
      }`,
    ),
    client.fetch<SlugRow[]>(
      `*[_type == "event"
        && defined(slug.current)
        && (!defined(publishAt) || publishAt <= now())
        && (!defined(unpublishAt) || unpublishAt > now())
        && (!defined(startDate) || startDate >= now())]{
          "slug": slug.current,
          "lastUpdated": _updatedAt
        }`,
    ),
    client.fetch<SlugRow[]>(
      `*[_type == "event"
        && defined(slug.current)
        && defined(startDate)
        && startDate < now()]{
          "slug": slug.current,
          "lastUpdated": _updatedAt
        }`,
    ),
  ])

  const staticSlugs = new Set(['kontakt', 'om-os', 'privatlivspolitik'])

  const jobRoutes: MetadataRoute.Sitemap = jobs.map(({ slug, lastUpdated }) => ({
    url: `${BASE_URL}/karriere/${slug}`,
    priority: 0.5,
    changeFrequency: 'monthly',
    ...(lastUpdated && { lastModified: new Date(lastUpdated) }),
  }))

  const pageRoutes: MetadataRoute.Sitemap = pages
    .filter(({ slug }) => !staticSlugs.has(slug))
    .map(({ slug, lastUpdated }) => ({
      url: `${BASE_URL}/${slug}`,
      priority: 0.5,
      changeFrequency: 'monthly',
      ...(lastUpdated && { lastModified: new Date(lastUpdated) }),
    }))

  const roomRoutes: MetadataRoute.Sitemap = rooms.map(({ slug, lastUpdated }) => ({
    url: `${BASE_URL}/hotel/vaerelser/${slug}`,
    priority: 0.7,
    changeFrequency: 'monthly',
    ...(lastUpdated && { lastModified: new Date(lastUpdated) }),
  }))

  const upcomingEventRoutes: MetadataRoute.Sitemap = upcomingEvents.map(
    ({ slug, lastUpdated }) => ({
      url: `${BASE_URL}/begivenheder/${slug}`,
      priority: 0.7,
      changeFrequency: 'daily',
      ...(lastUpdated && { lastModified: new Date(lastUpdated) }),
    }),
  )

  const pastEventRoutes: MetadataRoute.Sitemap = pastEvents.map(
    ({ slug, lastUpdated }) => ({
      url: `${BASE_URL}/begivenheder/${slug}`,
      priority: 0.3,
      changeFrequency: 'yearly',
      ...(lastUpdated && { lastModified: new Date(lastUpdated) }),
    }),
  )

  return [
    ...STATIC_ROUTES,
    ...jobRoutes,
    ...pageRoutes,
    ...roomRoutes,
    ...upcomingEventRoutes,
    ...pastEventRoutes,
  ]
}
