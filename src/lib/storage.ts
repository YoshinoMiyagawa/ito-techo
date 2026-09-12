import type { BrandId } from '../types'

/**
 * 「持ってる糸」の保存先を抽象化するリポジトリ。
 *
 * 今はブラウザの localStorage だけを実装しているが、将来ユーザー登録機能を
 * 追加したときは ApiRepository のような別実装を用意して
 * `getRepository()` の返り値を切り替えるだけで、複数デバイス同期に対応できる想定。
 * UI（App.tsx など）は Repository インターフェースにしか依存しないので、
 * 保存先が変わってもコンポーネント側の変更は不要。
 */
export interface Repository {
  /** 指定ブランドの「持ってる」色番号一覧を取得する */
  getOwned(brand: BrandId): Promise<Set<string>>
  /** 持っている/持っていないを切り替える */
  setOwned(brand: BrandId, code: string, owned: boolean): Promise<void>
  /** 全ブランド分をまとめて書き出す（バックアップ・引っ越し用） */
  exportAll(): Promise<Record<string, string[]>>
  /** バックアップから全ブランド分をまとめて読み込む（既存データは上書き） */
  importAll(data: Record<string, string[]>): Promise<void>
}

const STORAGE_PREFIX = 'ito-techo:owned:'

function keyFor(brand: BrandId): string {
  return `${STORAGE_PREFIX}${brand}`
}

class LocalStorageRepository implements Repository {
  async getOwned(brand: BrandId): Promise<Set<string>> {
    try {
      const raw = window.localStorage.getItem(keyFor(brand))
      if (!raw) return new Set()
      const arr = JSON.parse(raw) as string[]
      return new Set(arr)
    } catch {
      return new Set()
    }
  }

  async setOwned(brand: BrandId, code: string, owned: boolean): Promise<void> {
    const current = await this.getOwned(brand)
    if (owned) {
      current.add(code)
    } else {
      current.delete(code)
    }
    window.localStorage.setItem(keyFor(brand), JSON.stringify(Array.from(current)))
  }

  async exportAll(): Promise<Record<string, string[]>> {
    const result: Record<string, string[]> = {}
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i)
      if (!key || !key.startsWith(STORAGE_PREFIX)) continue
      const brand = key.slice(STORAGE_PREFIX.length)
      const raw = window.localStorage.getItem(key)
      result[brand] = raw ? (JSON.parse(raw) as string[]) : []
    }
    return result
  }

  async importAll(data: Record<string, string[]>): Promise<void> {
    for (const [brand, codes] of Object.entries(data)) {
      window.localStorage.setItem(`${STORAGE_PREFIX}${brand}`, JSON.stringify(codes))
    }
  }
}

let repositoryInstance: Repository | null = null

export function getRepository(): Repository {
  if (!repositoryInstance) {
    // TODO: ログイン状態を見て ApiRepository に切り替える処理をここに追加する
    repositoryInstance = new LocalStorageRepository()
  }
  return repositoryInstance
}
