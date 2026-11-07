'use client'

import {
  Crown,
  Flower,
  Flower2,
  Gem,
  Heart,
  Landmark,
  Leaf,
  Moon,
  Sparkles,
  Sprout,
  Sun,
  Waves,
  type LucideIcon,
} from 'lucide-react'
import type { ThemeConfig, ThemeId } from '@/lib/wedding-data'

const THEME_ICONS: Record<ThemeId, LucideIcon> = {
  songhy: Heart,
  thiep: Heart,
  serenity: Leaf,
  lavender: Flower2,
  summer: Sun,
  hoangkim: Crown,
  tapchi: Sparkles,
  vuonhoa: Sprout,
  demsao: Moon,
  sen: Flower2,
  maidao: Flower,
  bienxanh: Waves,
  hue: Landmark,
  tinhkhoi: Gem,
}

export function ThemeEmblem({
  theme,
  className = 'w-6 h-6',
}: {
  theme: ThemeConfig
  className?: string
}) {
  const Icon = THEME_ICONS[theme.id]
  const { accent, accent2, gold } = theme.colors
  const fill =
    theme.id === 'songhy' || theme.id === 'thiep'
      ? accent
      : theme.id === 'lavender' || theme.id === 'sen' || theme.id === 'bienxanh'
        ? `${accent2}66`
        : theme.id === 'summer' || theme.id === 'hoangkim' || theme.id === 'demsao' || theme.id === 'tapchi'
          ? `${gold}55`
          : theme.id === 'vuonhoa' || theme.id === 'maidao' || theme.id === 'hue' || theme.id === 'tinhkhoi'
            ? `${accent2}55`
            : 'none'

  return (
    <Icon
      className={className}
      color={theme.id === 'songhy' ? gold : accent}
      fill={fill}
      strokeWidth={theme.id === 'tapchi' ? 1.35 : 1.8}
      aria-hidden="true"
    />
  )
}
