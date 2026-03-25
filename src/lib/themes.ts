export const COLOR_THEMES = {
  'warm-brown': {
    '--brand': '#903f00',
    '--brand-light': '#ffdbcb',
    '--brand-dark': '#331200',
    '--brand-mid': '#b45309',
    '--warm-white': '#fcf9f8',
    '--warm-gray': '#f6f3f2',
    '--warm-brown': '#564338',
    '--dark-stone': '#1c1b1b',
    '--border-warm': '#ddc1b3',
  },
  forest: {
    '--brand': '#2d5a1b',
    '--brand-light': '#d1f0c8',
    '--brand-dark': '#0f2008',
    '--brand-mid': '#4a8a34',
    '--warm-white': '#f7fbf5',
    '--warm-gray': '#edf4ea',
    '--warm-brown': '#374b31',
    '--dark-stone': '#1a1c19',
    '--border-warm': '#b8d9af',
  },
  navy: {
    '--brand': '#1a3a5c',
    '--brand-light': '#c8ddf0',
    '--brand-dark': '#071525',
    '--brand-mid': '#2e5f8a',
    '--warm-white': '#f5f8fc',
    '--warm-gray': '#eaf0f7',
    '--warm-brown': '#2e4560',
    '--dark-stone': '#0f1c2e',
    '--border-warm': '#a8c4df',
  },
  slate: {
    '--brand': '#374151',
    '--brand-light': '#d1d5db',
    '--brand-dark': '#111827',
    '--brand-mid': '#6b7280',
    '--warm-white': '#f9fafb',
    '--warm-gray': '#f3f4f6',
    '--warm-brown': '#4b5563',
    '--dark-stone': '#111827',
    '--border-warm': '#d1d5db',
  },
  champagne: {
    '--brand': '#8a6a2e',
    '--brand-light': '#f5e6c0',
    '--brand-dark': '#3d2d0a',
    '--brand-mid': '#b8922e',
    '--warm-white': '#fdfaf4',
    '--warm-gray': '#f7f2e5',
    '--warm-brown': '#5c4a2a',
    '--dark-stone': '#1e1a10',
    '--border-warm': '#e8d5a0',
  },
  sage: {
    '--brand': '#4a6741',
    '--brand-light': '#d4e8d0',
    '--brand-dark': '#1e3019',
    '--brand-mid': '#6b8f62',
    '--warm-white': '#f6f9f5',
    '--warm-gray': '#eaf0e8',
    '--warm-brown': '#3d5035',
    '--dark-stone': '#1a2118',
    '--border-warm': '#c0d8b8',
  },
  terracotta: {
    '--brand': '#9c4a2f',
    '--brand-light': '#f8d5c8',
    '--brand-dark': '#3d1a0f',
    '--brand-mid': '#c4673d',
    '--warm-white': '#fdf8f6',
    '--warm-gray': '#f5eeea',
    '--warm-brown': '#5a3528',
    '--dark-stone': '#1e1210',
    '--border-warm': '#e8c4b8',
  },
  onyx: {
    '--brand': '#c9a96e',
    '--brand-light': '#f0e0c0',
    '--brand-dark': '#7a5c28',
    '--brand-mid': '#dfc48a',
    '--warm-white': '#f9f7f4',
    '--warm-gray': '#f2ede5',
    '--warm-brown': '#4a3d2d',
    '--dark-stone': '#0a0a0a',
    '--border-warm': '#e0d0b8',
  },
} as const

export type ThemeKey = keyof typeof COLOR_THEMES

// ─── Custom theme generation ──────────────────────────────────────────────────

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l * 100]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  switch (max) {
    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
    case g: h = ((b - r) / d + 2) / 6; break
    default: h = ((r - g) / d + 4) / 6
  }
  return [h * 360, s * 100, l * 100]
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360
  s = Math.max(0, Math.min(100, s)) / 100
  l = Math.max(0, Math.min(100, l)) / 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)))
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function clamp(v: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v))
}

function generateThemeFromHex(hex: string): Record<string, string> {
  const [h, s, l] = hexToHsl(hex)
  return {
    '--brand': hex,
    '--brand-mid': hslToHex(h, clamp(s * 0.85), clamp(l + 14)),
    '--brand-light': hslToHex(h, clamp(s * 0.35), clamp(l + 50)),
    '--brand-dark': hslToHex(h, clamp(s * 1.1), clamp(l - 22)),
    '--warm-white': hslToHex(h, clamp(s * 0.07), 98),
    '--warm-gray': hslToHex(h, clamp(s * 0.13), 95),
    '--warm-brown': hslToHex(h, clamp(s * 0.48), 34),
    '--dark-stone': hslToHex(h, clamp(s * 0.16), 10),
    '--border-warm': hslToHex(h, clamp(s * 0.28), 80),
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getThemeVars(theme: string | undefined | null): Record<string, string> {
  if (theme?.startsWith('custom:')) {
    const payload = theme.slice(7)
    // New format: custom:{"name":"...","colors":{...}}
    if (payload.startsWith('{')) {
      try {
        const parsed = JSON.parse(payload) as {name: string; colors: {brand: string; brandLight: string; warmWhite: string; warmBrown: string; darkStone: string}}
        const c = parsed.colors
        const [h, s, l] = hexToHsl(c.brand)
        const [wh, ws, wl] = hexToHsl(c.warmWhite)
        const [blh, bls, bll] = hexToHsl(c.brandLight)
        return {
          '--brand': c.brand,
          '--brand-mid': hslToHex(h, clamp(s * 0.85), clamp(l + 14)),
          '--brand-light': c.brandLight,
          '--brand-dark': hslToHex(h, clamp(s * 1.05), clamp(l - 22)),
          '--warm-white': c.warmWhite,
          '--warm-gray': hslToHex(wh, clamp(ws + 2), clamp(wl - 4)),
          '--warm-brown': c.warmBrown,
          '--dark-stone': c.darkStone,
          '--border-warm': hslToHex(blh, clamp(bls * 1.1), clamp(bll - 16)),
        }
      } catch { /* fall through */ }
    }
    // Legacy format: custom:#rrggbb
    if (/^#[0-9a-fA-F]{6}$/.test(payload)) return generateThemeFromHex(payload)
  }
  const key = (theme as ThemeKey) || 'warm-brown'
  return COLOR_THEMES[key] ?? COLOR_THEMES['warm-brown']
}
