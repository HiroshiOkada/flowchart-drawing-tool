import React from 'react';
import { NodeType, DEFAULT_NODE_SPECS } from '../types/flowchart';
import { Square, Diamond, CircleDot } from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  onAddNode: (type: NodeType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onAddNode }) => {
  const shapes: { type: NodeType; label: string; icon: React.ReactNode; description: string }[] = [
    {
      type: 'rectangle',
      label: '処理 (Process)',
      icon: <Square size={20} />,
      description: '通常の処理ステップやアクション',
    },
    {
      type: 'rhombus',
      label: '条件分岐 (Decision)',
      icon: <Diamond size={20} />,
      description: '判断・Yes/Noなどの条件分岐',
    },
    {
      type: 'stadium',
      label: '端点 (Terminal)',
      icon: <CircleDot size={20} />,
      description: 'フローの開始および終了',
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-section-title">パレット / 図形要素</div>
      <p className="sidebar-hint">クリックしてキャンバスへ追加します。</p>

      <div className="sidebar-shape-list">
        {shapes.map(({ type, label, icon, description }) => {
          const spec = DEFAULT_NODE_SPECS[type];
          return (
            <button
              key={type}
              className="sidebar-shape-btn"
              onClick={() => onAddNode(type)}
            >
              <div
                className="shape-preview-icon"
                style={{
                  backgroundColor: spec.defaultFill,
                  borderColor: spec.defaultStroke,
                }}
              >
                {icon}
              </div>
              <div className="shape-info">
                <span className="shape-label">{label}</span>
                <span className="shape-desc">{description}</span>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
