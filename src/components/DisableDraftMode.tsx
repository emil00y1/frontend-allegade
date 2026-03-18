'use client'

import { useDraftModeEnvironment } from 'next-sanity/hooks'

export function DisableDraftMode() {
  const environment = useDraftModeEnvironment()
  // Only show the button when outside the Presentation Tool iframe
  if (environment !== 'live' && environment !== 'unknown') return null

  return (
    <a
      href="/api/draft-mode/disable"
      className="fixed bottom-4 right-4 z-50 bg-white border border-stone-200 shadow-lg px-4 py-2 text-sm font-medium text-stone-900 hover:bg-stone-50 transition-colors rounded"
    >
      Afslut forhåndsvisning
    </a>
  )
}
