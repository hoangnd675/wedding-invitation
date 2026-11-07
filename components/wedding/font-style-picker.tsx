'use client'

import React from 'react'
import type { FontPresetId, ThemeConfig } from '@/lib/wedding-data'
import { FONT_PRESETS, getFontPreset } from '@/lib/wedding-fonts'

interface FontStylePickerProps {
  selected: FontPresetId
  fallbackFonts: ThemeConfig['fonts']
  onChange: (value: FontPresetId) => void
  variant?: 'light' | 'dark'
}

export function FontStylePicker({ selected, fallbackFonts, onChange, variant = 'light' }: FontStylePickerProps) {
  const dark = variant === 'dark'
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {FONT_PRESETS.map((preset) => {
        const active = selected === preset.id
        const fonts = getFontPreset(preset.id, fallbackFonts)
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onChange(preset.id)}
            aria-pressed={active}
            className={`rounded-xl border p-3.5 text-left transition-all ${dark
              ? active ? 'border-amber-300 bg-amber-300/15 ring-2 ring-amber-300/30' : 'border-white/15 bg-white/5 hover:bg-white/10'
              : active ? 'border-red-700 bg-red-50 ring-2 ring-red-700/15' : 'border-stone-200 bg-stone-50 hover:border-stone-300 hover:bg-white'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className={`text-xs font-bold ${dark ? 'text-white' : 'text-stone-900'}`}>{preset.label}</span>
              {active && <span className={`shrink-0 text-[10px] font-bold ${dark ? 'text-amber-300' : 'text-red-700'}`}>✓ Đang chọn</span>}
            </div>
            <p className={`mt-2 text-[26px] leading-tight ${dark ? 'text-amber-100' : 'text-stone-800'}`} style={{ fontFamily: fonts.name, fontStyle: fonts.nameStyle || 'normal' }}>
              Hải Hưng &amp; Mi Mi
            </p>
            <p className={`mt-1 text-sm ${dark ? 'text-white/85' : 'text-stone-700'}`} style={{ fontFamily: fonts.head }}>
              Trân trọng kính mời
            </p>
            <p className={`mt-1 text-[11px] ${dark ? 'text-white/55' : 'text-stone-500'}`} style={{ fontFamily: fonts.body }}>
              {preset.description}
            </p>
          </button>
        )
      })}
    </div>
  )
}
