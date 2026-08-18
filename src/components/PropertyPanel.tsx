import React from 'react';
import { FlowchartNode, Connector, COLOR_PALETTE } from '../types/flowchart';
import { Trash2, Type, Palette, Maximize2, AlignLeft } from 'lucide-react';
import './PropertyPanel.css';

interface PropertyPanelProps {
  selectedNode: FlowchartNode | null;
  selectedConnector: Connector | null;
  onUpdateNodeStyle: (id: string, styleUpdates: Partial<FlowchartNode['style']>) => void;
  onUpdateNodeDimensions: (id: string, width: number, height: number) => void;
  onUpdateNodeLabel: (id: string, label: string) => void;
  onUpdateConnectorLabel: (id: string, label: string) => void;
  onUpdateConnectorStyle: (id: string, styleUpdates: Partial<Connector['style']>) => void;
  onDeleteSelected: () => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedNode,
  selectedConnector,
  onUpdateNodeStyle,
  onUpdateNodeDimensions,
  onUpdateNodeLabel,
  onUpdateConnectorLabel,
  onUpdateConnectorStyle,
  onDeleteSelected,
}) => {
  if (!selectedNode && !selectedConnector) {
    return (
      <aside className="property-panel empty">
        <p className="property-empty-text">要素を選択すると、プロパティを編集できます。</p>
      </aside>
    );
  }

  return (
    <aside className="property-panel">
      <div className="property-header">
        <h3>{selectedNode ? '図形プロパティ' : '接続線プロパティ'}</h3>
        <button
          className="btn-danger-icon"
          onClick={onDeleteSelected}
          title="選択中要素を削除"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {selectedNode && (
        <div className="property-sections">
          {/* Label section */}
          <div className="property-group">
            <label><Type size={14} /> テキスト / ラベル</label>
            <textarea
              value={selectedNode.label}
              onChange={(e) => onUpdateNodeLabel(selectedNode.id, e.target.value)}
              placeholder="テキストを入力..."
              rows={2}
            />
          </div>

          {/* Color Palette Presets */}
          <div className="property-group">
            <label><Palette size={14} /> カラープリセット</label>
            <div className="color-palette-grid">
              {COLOR_PALETTE.map((p) => (
                <button
                  key={p.name}
                  className="color-preset-btn"
                  style={{ backgroundColor: p.fill, borderColor: p.stroke }}
                  title={p.name}
                  onClick={() =>
                    onUpdateNodeStyle(selectedNode.id, {
                      fillColor: p.fill,
                      strokeColor: p.stroke,
                    })
                  }
                />
              ))}
            </div>
          </div>

          {/* Detailed Color Pickers */}
          <div className="property-group row">
            <div className="property-subfield">
              <label>塗りつぶし色</label>
              <input
                type="color"
                value={selectedNode.style.fillColor}
                onChange={(e) =>
                  onUpdateNodeStyle(selectedNode.id, { fillColor: e.target.value })
                }
              />
            </div>
            <div className="property-subfield">
              <label>枠線色</label>
              <input
                type="color"
                value={selectedNode.style.strokeColor}
                onChange={(e) =>
                  onUpdateNodeStyle(selectedNode.id, { strokeColor: e.target.value })
                }
              />
            </div>
          </div>

          {/* Text Styling */}
          <div className="property-group row">
            <div className="property-subfield">
              <label>文字色</label>
              <input
                type="color"
                value={selectedNode.style.textColor || '#ffffff'}
                onChange={(e) =>
                  onUpdateNodeStyle(selectedNode.id, { textColor: e.target.value })
                }
              />
            </div>
            <div className="property-subfield">
              <label>フォントサイズ (px)</label>
              <input
                type="number"
                min={10}
                max={48}
                value={selectedNode.style.fontSize || 14}
                onChange={(e) =>
                  onUpdateNodeStyle(selectedNode.id, {
                    fontSize: parseInt(e.target.value, 10) || 14,
                  })
                }
              />
            </div>
          </div>

          {/* Node Dimensions */}
          <div className="property-group">
            <label><Maximize2 size={14} /> サイズ (幅 × 高さ px)</label>
            <div className="property-group row">
              <div className="property-subfield">
                <input
                  type="number"
                  min={40}
                  max={800}
                  value={Math.round(selectedNode.width)}
                  onChange={(e) =>
                    onUpdateNodeDimensions(
                      selectedNode.id,
                      parseInt(e.target.value, 10) || selectedNode.width,
                      selectedNode.height
                    )
                  }
                />
              </div>
              <div className="property-subfield">
                <input
                  type="number"
                  min={30}
                  max={600}
                  value={Math.round(selectedNode.height)}
                  onChange={(e) =>
                    onUpdateNodeDimensions(
                      selectedNode.id,
                      selectedNode.width,
                      parseInt(e.target.value, 10) || selectedNode.height
                    )
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedConnector && (
        <div className="property-sections">
          <div className="property-group">
            <label><AlignLeft size={14} /> 線のラベル (Yes / No 等)</label>
            <input
              type="text"
              value={selectedConnector.label || ''}
              onChange={(e) => onUpdateConnectorLabel(selectedConnector.id, e.target.value)}
              placeholder="例: Yes, No, OK"
            />
          </div>

          <div className="property-group row">
            <div className="property-subfield">
              <label>線の色</label>
              <input
                type="color"
                value={selectedConnector.style.strokeColor}
                onChange={(e) =>
                  onUpdateConnectorStyle(selectedConnector.id, { strokeColor: e.target.value })
                }
              />
            </div>
            <div className="property-subfield">
              <label>線の太さ (px)</label>
              <input
                type="number"
                min={1}
                max={10}
                step={0.5}
                value={selectedConnector.style.strokeWidth}
                onChange={(e) =>
                  onUpdateConnectorStyle(selectedConnector.id, {
                    strokeWidth: parseFloat(e.target.value) || 1.75,
                  })
                }
              />
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
