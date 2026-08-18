# Flowchart Studio (フローチャート Web アプリケーション)

ブラウザ上で高品位なフローチャートやダイアグラムの作成・編集・印刷・保存ができる単一ページWebアプリケーション (SPA) です。バックエンドサーバーを必要とせず、クライアントサイドのみで完結して動作します。

![Flowchart Studio Preview](https://via.placeholder.com/800x450/0b1120/f8fafc?text=Flowchart+Studio+SPA)

## ✨ 主な機能要件と特長

### 1. サポートする図形・コネクタ
* **長方形 (Rectangle)**: 処理ステップ・プロセス用 (デフォルト `160×70px`, `rx=6`)
* **ひし形 (Rhombus)**: 条件分岐・判断用 (デフォルト `180×80px`)
* **両端半円長方形 (Stadium)**: フロー開始・終了ターミナル用 (デフォルト `150×60px`, `rx=30`)
* **直線・矢印コネクタ (Connector)**: ノード上下左右アンカーポイントへの動的接続・アンカーへの自動スナップ・矢印マーク描画・線上ラベルテキスト (Yes/Noなど) の入力に対応

### 2. デザイン & UI/UX
* **モダン・ダークテーマ UI**: 深みのあるネイビー・ダークスレート背景 (`#0b1120`) とグリッドドット背景
* **要素操作**: ドラッグ＆ドロップ移動、8方向ハンドル操作によるリサイズ、ダブルクリックによるインラインテキスト編集
* **リアルタイムプロパティ変更**: 塗りつぶし色、枠線色、文字色、フォントサイズ、ノード寸法、プリセットカラー（Dark Slate, Emerald Green, Indigo Blue, Rose Red, Cyan, Amber）のワンタップ適用

### 3. A4基準設計 & 最重要：印刷機能 (`@media print`)
* **A4 縦 (Portrait: 794×1123px)** / **A4 横 (Landscape: 1123×794px)** の切り替えに対応
* **印刷最適化**: `window.print()` やブラウザの印刷実行時には、ツールバー、サイドバー、プロパティパネル、ガイド枠線、アンカーポイント等のUIコントロールを**完全非表示化**
* `@media print` と `@page` 用紙指定により、余白と拡大縮小が自動最適化され、**必ず A4 用紙 1 枚ぴったり**に白背景・高コントラストで綺麗に出力されます。

### 4. データ保存 & エクスポート
* **LocalStorage 自動保存**: 編集内容はリアルタイムで LocalStorage に自動保存され、ページ再読み込み後も即座に復元
* **JSON 入出力**: 編集データを JSON ファイルとしてダウンロード・再読み込み編集可能
* **高解像度 PNG エクスポート**: SVG 描画エンジンから直接 2 倍高解像度の PNG 画像を生成・保存
* **Undo / Redo**: キーボードショートカット (`Ctrl+Z`, `Ctrl+Y` / `Cmd+Z`, `Cmd+Shift+Z`) に対応

---

## 🛠️ 開発・テスト手順

### 動作環境
- Node.js 18+
- npm 9+

### 1. パッケージインストール
```bash
npm install
```

### 2. 開発サーバーの起動
```bash
npm run dev
```
ブラウザで `http://localhost:5173` にアクセスして動的に動作確認を行えます。

### 3. 単体テストの実行 (Vitest)
```bash
npm run test
```
幾何学計算 (アンカー・ライン座標 calculation)、状態管理フック (useFlowchart)、ストレージ保存/パース処理の単体テストが実行されます。

### 4. 生産用ビルド & プレビュー
```bash
npm run build
npm run preview
```

---

## 🚀 GitHub Pages へのデプロイ手順

本アプリケーションは完全なクライアントサイド SPA のため、GitHub Pages へ容易にデプロイ可能です。

### 方法 1: `gh-pages` パッケージを使用する場合 (推奨)

1. `gh-pages` パッケージを開発依存関係に追加:
   ```bash
   npm install -D gh-pages
   ```

2. `package.json` の `scripts` に以下を追加:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. デプロイを実行:
   ```bash
   npm run deploy
   ```

### 方法 2: GitHub CLI (`gh`) を使用する場合

1. リポジトリを作成してプッシュ:
   ```bash
   gh repo create flowchart-drawing-tool --public --source=. --remote=origin --push
   ```

2. GitHub Pages を有効化:
   ```bash
   gh api -X POST repos/{owner}/flowchart-drawing-tool/pages -f build_type=workflow
   ```
   またはリポジトリの Settings > Pages から、デプロイブランチとして `main` (フォルダ `/dist` または GitHub Actions 経由) を指定します。

---

## 📄 ライセンス
MIT License
