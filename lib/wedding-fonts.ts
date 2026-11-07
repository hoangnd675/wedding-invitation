import type { FontPresetId, ThemeConfig } from './wedding-data'

export interface WeddingFontPreset {
  id: FontPresetId
  label: string
  description: string
  fonts: ThemeConfig['fonts'] | null
}

export const FONT_PRESETS: WeddingFontPreset[] = [
  { id: 'theme', label: 'Theo chủ đề', description: 'Giữ nguyên bộ phông riêng của từng chủ đề', fonts: null },
  {
    id: 'calligraphy', label: 'Thư pháp bay bổng',
    description: 'Tên cô dâu chú rể mềm mại như nét bút ký',
    fonts: { head: '"Cormorant Garamond", serif', name: '"Great Vibes", cursive', body: '"Cormorant Garamond", serif', ui: '"Quicksand", sans-serif', nameStyle: 'normal' },
  },
  {
    id: 'handwritten', label: 'Viết tay lãng mạn',
    description: 'Nét chữ tự nhiên, trẻ trung và ngọt ngào',
    fonts: { head: '"Dancing Script", cursive', name: '"Allura", cursive', body: '"Lora", serif', ui: '"Quicksand", sans-serif', nameStyle: 'normal' },
  },
  {
    id: 'classic', label: 'Serif cổ điển',
    description: 'Thanh lịch, trang trọng và dễ đọc',
    fonts: { head: '"Playfair Display", serif', name: '"Great Vibes", cursive', body: '"Lora", serif', ui: '"Quicksand", sans-serif', nameStyle: 'normal' },
  },
  {
    id: 'editorial', label: 'Tạp chí cao cấp',
    description: 'Chữ hoa trang nhã, cảm giác sang trọng hiện đại',
    fonts: { head: '"Cinzel", serif', name: '"Cormorant Garamond", serif', body: '"Playfair Display", serif', ui: '"Quicksand", sans-serif', nameStyle: 'italic' },
  },
  {
    id: 'modern', label: 'Hiện đại tinh gọn',
    description: 'Bố cục sáng rõ, nội dung gọn gàng và dễ xem',
    fonts: { head: '"Marcellus", serif', name: '"Playfair Display", serif', body: '"Lora", serif', ui: '"Quicksand", sans-serif', nameStyle: 'normal' },
  },
]

export function getFontPreset(id: FontPresetId | undefined, themeFonts: ThemeConfig['fonts']): ThemeConfig['fonts'] {
  if (!id || id === 'theme') return themeFonts
  return FONT_PRESETS.find((preset) => preset.id === id)?.fonts || themeFonts
}
