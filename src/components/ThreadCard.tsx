import { readableTextColor, rgbToHex } from '../data/brands'
import type { ThreadColor } from '../types'

interface Props {
  thread: ThreadColor
  owned: boolean
  onToggle: () => void
  accent: string
}

export function ThreadCard({ thread, owned, onToggle, accent }: Props) {
  const hex = rgbToHex(thread.r, thread.g, thread.b)
  const textColor = readableTextColor(thread.r, thread.g, thread.b)

  return (
    <button
      onClick={onToggle}
      aria-pressed={owned}
      className={[
        'relative w-full rounded-b-md rounded-t-2xl border text-left transition-all',
        'bg-linen-50 shadow-tag hover:shadow-tagHover hover:-translate-y-0.5',
        owned ? 'border-ink/15' : 'border-linen-300',
      ].join(' ')}
    >
      {/* 綴じ穴（フロスリングに通す穴を模したくぼみ） */}
      <span
        className="absolute left-1/2 top-2 h-3 w-3 -translate-x-1/2 rounded-full border"
        style={{
          backgroundColor: '#F4EEDF',
          borderColor: owned ? accent : 'rgba(43,36,32,0.18)',
          borderWidth: owned ? 2 : 1,
        }}
        aria-hidden
      />

      {/* 色のスワッチ */}
      <div
        className="mt-6 flex h-16 items-end justify-end rounded-sm mx-2 px-2 pb-1"
        style={{ backgroundColor: hex }}
      >
        <span className="font-mono text-[10px] opacity-70" style={{ color: textColor }}>
          #{thread.no}
        </span>
      </div>

      {/* 色番号と所持チェック */}
      <div className="flex items-center justify-between gap-2 px-2.5 py-2">
        <span className="font-mono text-[13px] font-medium text-ink">{thread.code}</span>
        <span
          className={[
            'flex h-5 w-5 items-center justify-center rounded-full border transition-colors',
            owned ? 'text-linen-50' : 'text-transparent',
          ].join(' ')}
          style={{
            backgroundColor: owned ? accent : 'transparent',
            borderColor: owned ? accent : 'rgba(43,36,32,0.25)',
          }}
          aria-hidden
        >
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
            <path
              d="M1 4.2L4 7.2L10 1.2"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </button>
  )
}
