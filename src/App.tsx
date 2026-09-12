import { useEffect, useMemo, useState } from 'react'
import { BRANDS, THREAD_DATA, getBrandInfo } from './data/brands'
import { getRepository } from './lib/storage'
import type { BrandId, FilterMode, OwnedSet } from './types'
import { BrandTabs } from './components/BrandTabs'
import { Toolbar } from './components/Toolbar'
import { ThreadGrid } from './components/ThreadGrid'
import { BackupPanel } from './components/BackupPanel'

export default function App() {
  const [activeBrand, setActiveBrand] = useState<BrandId>('dmc')
  const [ownedByBrand, setOwnedByBrand] = useState<Record<BrandId, OwnedSet>>({
    dmc: new Set(),
    cosmo: new Set(),
    olympus: new Set(),
  })
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FilterMode>('all')
  const [backupOpen, setBackupOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // 起動時に全ブランドの所持データを読み込む
  useEffect(() => {
    const repo = getRepository()
    Promise.all(BRANDS.map((b) => repo.getOwned(b.id))).then((results) => {
      const next: Record<BrandId, OwnedSet> = { dmc: new Set(), cosmo: new Set(), olympus: new Set() }
      BRANDS.forEach((b, i) => {
        next[b.id] = results[i]
      })
      setOwnedByBrand(next)
      setLoaded(true)
    })
  }, [])

  const reloadAll = () => {
    const repo = getRepository()
    Promise.all(BRANDS.map((b) => repo.getOwned(b.id))).then((results) => {
      const next: Record<BrandId, OwnedSet> = { dmc: new Set(), cosmo: new Set(), olympus: new Set() }
      BRANDS.forEach((b, i) => {
        next[b.id] = results[i]
      })
      setOwnedByBrand(next)
    })
  }

  const handleToggle = (code: string) => {
    const repo = getRepository()
    const current = ownedByBrand[activeBrand]
    const willOwn = !current.has(code)
    // 楽観的にUIを更新
    setOwnedByBrand((prev) => {
      const nextSet = new Set(prev[activeBrand])
      if (willOwn) nextSet.add(code)
      else nextSet.delete(code)
      return { ...prev, [activeBrand]: nextSet }
    })
    repo.setOwned(activeBrand, code, willOwn)
  }

  const brandInfo = getBrandInfo(activeBrand)
  const allThreads = THREAD_DATA[activeBrand]
  const owned = ownedByBrand[activeBrand]

  const filteredThreads = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allThreads.filter((t) => {
      if (q && !t.code.toLowerCase().includes(q)) return false
      if (filter === 'owned' && !owned.has(t.code)) return false
      if (filter === 'missing' && owned.has(t.code)) return false
      return true
    })
  }, [allThreads, owned, query, filter])

  const ownedCounts = useMemo(() => {
    const counts: Record<BrandId, number> = { dmc: 0, cosmo: 0, olympus: 0 }
    BRANDS.forEach((b) => {
      counts[b.id] = ownedByBrand[b.id]?.size ?? 0
    })
    return counts
  }, [ownedByBrand])

  const totalCounts = useMemo(() => {
    const counts: Record<BrandId, number> = { dmc: 0, cosmo: 0, olympus: 0 }
    BRANDS.forEach((b) => {
      counts[b.id] = THREAD_DATA[b.id].length
    })
    return counts
  }, [])

  return (
    <div className="min-h-screen pb-16">
      <header className="border-b border-linen-300/80 bg-linen-50/60">
        <div className="mx-auto max-w-5xl px-4 pt-6 sm:pt-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl text-ink">糸手帖</h1>
              <p className="mt-1 text-[13px] text-ink-soft">
                刺繍糸の色番号を、持っているかどうかでチェックしていくノートです。
              </p>
            </div>
            <button
              onClick={() => setBackupOpen(true)}
              className="mt-1 shrink-0 rounded-full border border-linen-300 px-3 py-1.5 text-[12px] text-ink-soft hover:bg-linen-100"
            >
              データの引っ越し
            </button>
          </div>

          <div className="mt-6">
            <BrandTabs
              active={activeBrand}
              onChange={(b) => {
                setActiveBrand(b)
                setQuery('')
              }}
              ownedCounts={ownedCounts}
              totalCounts={totalCounts}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-6">
        <div className="rounded-b-md rounded-tr-md border border-linen-300 bg-linen-50 p-4 sm:p-5">
          <Toolbar
            query={query}
            onQueryChange={setQuery}
            filter={filter}
            onFilterChange={setFilter}
            accent={brandInfo.accent}
          />

          <div className="mt-4 flex items-baseline justify-between text-[12px] text-ink-soft">
            <span>
              {brandInfo.fullName} 全{totalCounts[activeBrand]}色のうち {filteredThreads.length}色を表示
            </span>
            <span>
              持ってる: {ownedCounts[activeBrand]} / {totalCounts[activeBrand]}
            </span>
          </div>

          <div className="mt-4">
            {loaded ? (
              <ThreadGrid
                threads={filteredThreads}
                owned={owned}
                onToggle={handleToggle}
                accent={brandInfo.accent}
              />
            ) : (
              <p className="py-10 text-center text-sm text-ink-soft">読み込み中…</p>
            )}
          </div>
        </div>
      </main>

      <BackupPanel open={backupOpen} onClose={() => setBackupOpen(false)} onImported={reloadAll} />
    </div>
  )
}
