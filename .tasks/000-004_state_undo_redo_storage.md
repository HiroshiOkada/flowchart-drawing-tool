# タスク 000-004: 状態管理・Undo/Redo・永続化実装

編集履歴の Undo/Redo (キーボードショートカット対応)、LocalStorage への自動保存・復元、JSON ファイルのダンプ/リストア機能を実装する。

## チェックリスト
- [x] Undo/Redo 履歴スタックを保持する `useFlowchart` カスタムフック
- [x] キーボードショートカット (`Ctrl+Z`, `Ctrl+Y` / `Cmd+Z`, `Cmd+Shift+Z`) 対応
- [x] LocalStorage への自動保存およびロード時の復元
- [x] JSON ファイルダウンロードエクスポートおよび JSON ファイル選択インポート
- [x] 状態履歴およびストレージ関連の単体テスト
