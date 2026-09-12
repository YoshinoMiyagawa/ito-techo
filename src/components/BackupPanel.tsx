import { useEffect, useState } from 'react'
import { getRepository } from '../lib/storage'

interface Props {
  open: boolean
  onClose: () => void
  onImported: () => void
}

export function BackupPanel({ open, onClose, onImported }: Props) {
  const [exportText, setExportText] = useState('')
  const [importText, setImportText] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!open) return
    setStatus(null)
    setCopied(false)
    getRepository()
      .exportAll()
      .then((data) => setExportText(JSON.stringify(data, null, 2)))
  }, [open])

  if (!open) return null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportText)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setStatus('コピーできませんでした。テキストを選択してコピーしてください。')
    }
  }

  const handleImport = async () => {
    try {
      const parsed = JSON.parse(importText) as Record<string, string[]>
      await getRepository().importAll(parsed)
      setStatus('読み込みました。')
      onImported()
    } catch {
      setStatus('読み込みに失敗しました。書き出したテキストをそのまま貼り付けてください。')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-lg border border-linen-300 bg-linen-50 p-5 shadow-tagHover max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-serif text-lg text-ink">データの引っ越し</h2>
            <p className="mt-1 text-[13px] text-ink-soft leading-relaxed">
              このアプリはブラウザだけにデータを保存しています。他の端末やブラウザに移すときは、
              下のテキストをコピーして、移し先の「読み込み」欄に貼り付けてください。
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="閉じる"
            className="shrink-0 rounded-full px-2 py-1 text-ink-soft hover:bg-linen-100"
          >
            ×
          </button>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-medium text-ink">書き出し（この端末のデータ）</label>
            <button
              onClick={handleCopy}
              className="rounded-full border border-linen-300 px-3 py-1 text-[12px] text-ink-soft hover:bg-linen-100"
            >
              {copied ? 'コピーしました' : 'コピー'}
            </button>
          </div>
          <textarea
            readOnly
            value={exportText}
            rows={6}
            className="mt-1.5 w-full rounded-md border border-linen-300 bg-linen-100 p-2 font-mono text-[11px] text-ink-soft"
          />
        </div>

        <div className="mt-4">
          <label className="text-[13px] font-medium text-ink">読み込み（他の端末のデータを貼り付け）</label>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            rows={6}
            placeholder="ここに書き出したテキストを貼り付ける"
            className="mt-1.5 w-full rounded-md border border-linen-300 bg-linen-50 p-2 font-mono text-[11px] text-ink placeholder:text-ink-soft/50"
          />
          <button
            onClick={handleImport}
            disabled={!importText.trim()}
            className="mt-2 rounded-md bg-thread-red px-4 py-1.5 text-[13px] text-linen-50 disabled:opacity-40"
          >
            読み込む
          </button>
          {status && <p className="mt-2 text-[12px] text-ink-soft">{status}</p>}
        </div>

        <p className="mt-4 text-[12px] text-ink-soft/80 leading-relaxed border-t border-linen-300 pt-3">
          ゆくゆくはアカウント登録機能を追加して、この作業なしで複数端末が自動的に同期できるようにする予定です。
        </p>
      </div>
    </div>
  )
}
