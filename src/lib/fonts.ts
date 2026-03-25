export const FONT_PAIRINGS = {
  classic: {
    // Default — uses next/font class-based variables as-is, no overrides needed
    vars: {} as Record<string, string>,
  },
  elegant: {
    vars: {
      '--font-sans': 'var(--font-dm-sans)',
      '--font-newsreader': 'var(--font-playfair)',
      '--font-cormorant': 'var(--font-eb-garamond)',
    },
  },
  nordic: {
    vars: {
      '--font-sans': 'var(--font-work-sans)',
      '--font-newsreader': 'var(--font-libre-baskerville)',
      // --font-cormorant stays as Cormorant Garamond (loaded for classic)
    },
  },
  dramatic: {
    vars: {
      '--font-sans': 'var(--font-jost)',
      '--font-newsreader': 'var(--font-fraunces)',
      '--font-cormorant': 'var(--font-fraunces)',
    },
  },
} as const

export function getFontVars(pairing: string | undefined | null): Record<string, string> {
  const key = (pairing as keyof typeof FONT_PAIRINGS) || 'classic'
  return {...(FONT_PAIRINGS[key] ?? FONT_PAIRINGS.classic).vars}
}
