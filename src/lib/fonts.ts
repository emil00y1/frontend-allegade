export interface CustomFontPairing {
  _key: string
  label?: string
  headingFontUrl?: string
  headingFontFamily?: string
  bodyFontUrl?: string
  bodyFontFamily?: string
  accentFontUrl?: string
  accentFontFamily?: string
}

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

export function getFontVars(
  pairing: string | undefined | null,
  customPairings?: CustomFontPairing[],
): Record<string, string> {
  if (pairing?.startsWith('custom-') && customPairings) {
    const key = pairing.slice('custom-'.length)
    const custom = customPairings.find((p) => p._key === key)
    if (custom) {
      const vars: Record<string, string> = {}
      if (custom.headingFontFamily) {
        vars['--font-newsreader'] = `'${custom.headingFontFamily}', serif`
      }
      if (custom.bodyFontFamily) {
        vars['--font-sans'] = `'${custom.bodyFontFamily}', sans-serif`
      }
      vars['--font-cormorant'] = custom.accentFontFamily
        ? `'${custom.accentFontFamily}', serif`
        : custom.headingFontFamily
          ? `'${custom.headingFontFamily}', serif`
          : 'var(--font-cormorant-base)'
      return vars
    }
  }

  const key = (pairing as keyof typeof FONT_PAIRINGS) || 'classic'
  return { ...(FONT_PAIRINGS[key] ?? FONT_PAIRINGS.classic).vars }
}

export function generateFontFaceCSS(
  pairing: string | undefined | null,
  customPairings?: CustomFontPairing[],
): string {
  if (!pairing?.startsWith('custom-') || !customPairings) return ''

  const key = pairing.slice('custom-'.length)
  const custom = customPairings.find((p) => p._key === key)
  if (!custom) return ''

  const faces: string[] = []

  const addFace = (url: string | undefined, family: string | undefined) => {
    if (!url || !family) return
    const ext = url.split('?')[0].split('.').pop()?.toLowerCase() ?? 'woff2'
    const formatMap: Record<string, string> = {
      woff2: 'woff2',
      woff: 'woff',
      ttf: 'truetype',
      otf: 'opentype',
    }
    const format = formatMap[ext] ?? 'woff2'
    faces.push(
      `@font-face { font-family: '${family}'; src: url('${url}') format('${format}'); font-display: swap; }`,
    )
  }

  addFace(custom.headingFontUrl, custom.headingFontFamily)
  if (custom.bodyFontUrl !== custom.headingFontUrl) {
    addFace(custom.bodyFontUrl, custom.bodyFontFamily)
  }
  if (custom.accentFontUrl && custom.accentFontUrl !== custom.headingFontUrl) {
    addFace(custom.accentFontUrl, custom.accentFontFamily)
  }

  return faces.join('\n')
}
