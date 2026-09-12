import type { BrandId, BrandInfo, ThreadColor } from '../types'
import dmc from './dmc.json'
import cosmo from './cosmo.json'
import olympus from './olympus.json'

export const BRANDS: BrandInfo[] = [
  { id: 'dmc', label: 'DMC', fullName: 'DMC', accent: '#A6352C' },
  { id: 'cosmo', label: 'コスモ', fullName: 'COSMO (Lecien)', accent: '#2E5C7A' },
  { id: 'olympus', label: 'オリンパス', fullName: 'オリンパス製絲', accent: '#3E6B4E' },
]

// メーカーの色番号データ。付属のExcel（RGB対応表）から抽出したJSONをそのまま束ねる。
export const THREAD_DATA: Record<BrandId, ThreadColor[]> = {
  dmc: dmc as ThreadColor[],
  cosmo: cosmo as ThreadColor[],
  olympus: olympus as ThreadColor[],
}

export function getBrandInfo(id: BrandId): BrandInfo {
  const found = BRANDS.find((b) => b.id === id)
  if (!found) throw new Error(`unknown brand: ${id}`)
  return found
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

// 明度から、スワッチの上に置く文字色（濃色 or 薄色）を決める
export function readableTextColor(r: number, g: number, b: number): string {
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6 ? '#2B2420' : '#FAF6EC'
}
