import type { FilterMode } from '../types'

interface Props {
  query: string
  onQueryChange: (v: string) => void
  filter: FilterMode
  onFilterChange: (v: FilterMode) => void
  accent: string
}

const FILTERS: { value: FilterMode; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'owned', label: '持ってる' },
  { value: 'missing', label: '未所持' },
]

export function Toolbar({ query, onQueryChange, filter, onFilterChange, accent }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="色番号で検索（例: 3713）"
          className="w-full rounded-md border border-linen-300 bg-linen-50 px-3 py-2 text-sm text-ink placeholder:text-ink-soft/60 outline-none focus:border-ink/30"
        />
      </div>
      <div className="flex gap-1.5">
        {FILTERS.map((f) => {
          const isActive = f.value === filter
          return (
            <button
              key={f.value}
              onClick={() => onFilterChange(f.value)}
              className={[
                'rounded-full border px-3 py-1.5 text-[13px] transition-colors',
                isActive ? 'text-linen-50 border-transparent' : 'text-ink-soft border-linen-300 hover:bg-linen-100',
              ].join(' ')}
              style={isActive ? { backgroundColor: accent } : undefined}
            >
              {f.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
