// メーカー（ブランド）の識別子。データファイルとキーが一致している必要がある。
export type BrandId = 'dmc' | 'cosmo' | 'olympus'

export interface BrandInfo {
  id: BrandId
  label: string // 表示名
  fullName: string // 正式名称
  accent: string // タブ等に使うブランドカラー（テーマの補色として少量だけ使用）
}

// Excelから抽出した1色分のデータ
export interface ThreadColor {
  no: number // メーカー内の通し番号（表示順の基準）
  code: string // 色番号（例: "3713", "B5200"）
  r: number
  g: number
  b: number
}

// ユーザーが「持っている」とチェックした色番号の集合（ブランドごと）
export type OwnedSet = Set<string>

export type FilterMode = 'all' | 'owned' | 'missing'
