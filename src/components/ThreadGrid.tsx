import { ThreadCard } from './ThreadCard'
import type { OwnedSet, ThreadColor } from '../types'

interface Props {
  threads: ThreadColor[]
  owned: OwnedSet
  onToggle: (code: string) => void
  accent: string
}

export function ThreadGrid({ threads, owned, onToggle, accent }: Props) {
  if (threads.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-linen-300 bg-linen-50/60 px-6 py-14 text-center">
        <p className="font-serif text-ink text-lg">見つかりませんでした</p>
        <p className="mt-1.5 text-sm text-ink-soft">
          色番号の入力や絞り込み条件を見直してみてください。
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(108px,1fr))] gap-3">
      {threads.map((thread) => (
        <ThreadCard
          key={thread.code}
          thread={thread}
          owned={owned.has(thread.code)}
          onToggle={() => onToggle(thread.code)}
          accent={accent}
        />
      ))}
    </div>
  )
}
