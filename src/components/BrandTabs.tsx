import { BRANDS } from '../data/brands'
import type { BrandId } from '../types'

interface Props {
  active: BrandId
  onChange: (brand: BrandId) => void
  ownedCounts: Record<BrandId, number>
  totalCounts: Record<BrandId, number>
}

export function BrandTabs({ active, onChange, ownedCounts, totalCounts }: Props) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
      {BRANDS.map((brand) => {
        const isActive = brand.id === active
        return (
          <button
            key={brand.id}
            onClick={() => onChange(brand.id)}
            aria-pressed={isActive}
            className={[
              'group relative shrink-0 rounded-t-md px-4 pt-3 pb-2.5 text-left transition-all',
              'border-x border-t',
              isActive
                ? 'bg-linen-50 border-linen-300 -mb-px shadow-tag'
                : 'bg-linen-200/70 border-linen-300/70 hover:bg-linen-100 mt-1',
            ].join(' ')}
            style={{ minWidth: 128 }}
          >
            <span
              className="absolute left-4 top-1.5 h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: brand.accent }}
              aria-hidden
            />
            <div className="pl-3.5">
              <div className="font-serif text-[15px] leading-none text-ink">{brand.label}</div>
              <div className="mt-1.5 font-mono text-[11px] text-ink-soft leading-none">
                {ownedCounts[brand.id] ?? 0}
                <span className="opacity-50"> / {totalCounts[brand.id] ?? 0}</span>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
