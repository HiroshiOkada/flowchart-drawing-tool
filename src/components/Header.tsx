import React, { useRef } from 'react';
import { PageOrientation } from '../types/flowchart';
import {
  Undo2,
  Redo2,
  Download,
  Upload,
  Printer,
  Image as ImageIcon,
  FileSpreadsheet,
} from 'lucide-react';
import './Header.css';

interface HeaderProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  orientation: PageOrientation;
  onOrientationChange: (orientation: PageOrientation) => void;
  onExportJson: () => void;
  onImportJson: (jsonStr: string) => void;
  onExportPng: () => void;
  onPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  orientation,
  onOrientationChange,
  onExportJson,
  onImportJson,
  onExportPng,
  onPrint,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        onImportJson(content);
      } catch (err) {
        alert('無効なJSONファイルです。');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="header">
      <div className="header-brand">
        <div className="brand-logo">
          <FileSpreadsheet size={20} />
        </div>
        <div className="brand-title">
          <h2>Flowchart Studio</h2>
          <span className="brand-badge">A4 Ready</span>
        </div>
      </div>

      <div className="header-toolbar">
        {/* History actions */}
        <div className="toolbar-group">
          <button
            className="toolbar-btn"
            disabled={!canUndo}
            onClick={onUndo}
            title="元に戻す (Ctrl+Z)"
          >
            <Undo2 size={16} />
          </button>
          <button
            className="toolbar-btn"
            disabled={!canRedo}
            onClick={onRedo}
            title="やり直し (Ctrl+Y)"
          >
            <Redo2 size={16} />
          </button>
        </div>

        <div className="toolbar-divider" />

        {/* Orientation toggle */}
        <div className="toolbar-group">
          <button
            className={`toolbar-btn text-btn ${orientation === 'portrait' ? 'active' : ''}`}
            onClick={() => onOrientationChange('portrait')}
            title="A4 縦向き (794 x 1123 px)"
          >
            A4 縦
          </button>
          <button
            className={`toolbar-btn text-btn ${orientation === 'landscape' ? 'active' : ''}`}
            onClick={() => onOrientationChange('landscape')}
            title="A4 横向き (1123 x 794 px)"
          >
            A4 横
          </button>
        </div>

        <div className="toolbar-divider" />

        {/* Export & Import actions */}
        <div className="toolbar-group">
          <button className="toolbar-btn text-btn" onClick={onExportJson} title="JSONファイルとしてダウンロード">
            <Download size={16} />
            <span>JSON保存</span>
          </button>
          <button
            className="toolbar-btn text-btn"
            onClick={() => fileInputRef.current?.click()}
            title="外部JSONファイルを読み込み"
          >
            <Upload size={16} />
            <span>JSON読込</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,application/json"
            style={{ display: 'none' }}
          />

          <button className="toolbar-btn text-btn" onClick={onExportPng} title="高解像度PNG画像を出力">
            <ImageIcon size={16} />
            <span>PNG出力</span>
          </button>
        </div>

        <div className="toolbar-divider" />

        {/* Print button */}
        <div className="toolbar-group">
          <button className="toolbar-btn btn-primary" onClick={onPrint} title="A4 1ページ印刷">
            <Printer size={16} />
            <span>印刷 (Print)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
