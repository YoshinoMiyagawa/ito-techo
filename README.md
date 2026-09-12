# 糸手帖（Ito Techō）

DMC・コスモ・オリンパスの刺繍糸を、色番号ごとに「持ってる／持ってない」で管理するWebアプリです。

## できること

- メーカー（DMC / コスモ / オリンパス）ごとにタブで切り替え
- 各色番号をRGBから再現した色見本つきで一覧表示
- 色番号を検索、「すべて／持ってる／未所持」で絞り込み
- カードをタップして「持ってる」チェックをON/OFF
- ユーザー登録なしでも使える（データはブラウザの localStorage に保存）
- 「データの引っ越し」機能で、他の端末・ブラウザへ手動でコピー可能

## データについて

抽出したRGB値は付属Excelの近似値であり、実際の糸の色とは光の当たり方やモニターの発色で
多少差が出ます。あくまで「見分けるための目印」としてお使いください。
色データは、https://hutarigurashi.com/様からお借りしたExcel（`RGB-DMC.xlsm` / `RGB-COSMO.xlsm` / `RGB-OLYMPUS.xlsm`）の
「RGB対応表」シートから、色番号とRGB値を抽出して `src/data/*.json` に変換したものです。

## セットアップ

```bash
npm install
npm run dev
```

`npm run build` で `dist/` に静的ファイルが生成されるので、Netlify / Vercel / GitHub Pages など
どこでもそのまま公開できます（バックエンドは不要です）。

## ディレクトリ構成

```
src/
  data/
    dmc.json / cosmo.json / olympus.json   # 抽出した色番号データ
    brands.ts                              # メーカー情報・色変換ユーティリティ
  lib/
    storage.ts     # データ保存を抽象化するRepository（今はlocalStorage実装のみ）
  components/
    BrandTabs.tsx     # メーカー切り替えタブ
    Toolbar.tsx        # 検索・絞り込み
    ThreadGrid.tsx      # 一覧グリッド
    ThreadCard.tsx      # 1色ぶんのカード
    BackupPanel.tsx    # データ引っ越し（書き出し・読み込み）
  App.tsx
  types.ts
```
