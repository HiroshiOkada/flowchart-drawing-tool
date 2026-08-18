import React, { useState, useRef, useEffect } from 'react';
import { FlowchartNode } from '../types/flowchart';

interface NodeShapeProps {
  node: FlowchartNode;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onUpdateLabel: (id: string, newLabel: string) => void;
  onMouseDown: (e: React.MouseEvent, nodeId: string) => void;
}

export const NodeShape: React.FC<NodeShapeProps> = ({
  node,
  isSelected,
  onSelect,
  onUpdateLabel,
  onMouseDown,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(node.label);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(node.label);
  }, [node.label]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onUpdateLabel(node.id, text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setIsEditing(false);
      onUpdateLabel(node.id, text);
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setText(node.label);
    }
  };

  const strokeWidth = isSelected ? 2.5 : 1.5;
  const strokeColor = isSelected ? 'var(--accent-color)' : node.style.strokeColor;
  const filter = isSelected ? 'url(#glow-filter)' : undefined;

  const renderShapeElement = () => {
    const { type, width, height, style } = node;

    switch (type) {
      case 'rectangle':
        return (
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            rx={6}
            ry={6}
            fill={style.fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            filter={filter}
          />
        );
      case 'rhombus': {
        const points = `${width / 2},0 ${width},${height / 2} ${width / 2},${height} 0,${height / 2}`;
        return (
          <polygon
            points={points}
            fill={style.fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            filter={filter}
          />
        );
      }
      case 'stadium': {
        const rx = height / 2;
        return (
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            rx={rx}
            ry={rx}
            fill={style.fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            filter={filter}
          />
        );
      }
      default:
        return null;
    }
  };

  // Split label into lines for text rendering when not editing
  const lines = node.label.split('\n');

  return (
    <g
      transform={`translate(${node.x}, ${node.y})`}
      onClick={onSelect}
      onMouseDown={(e) => onMouseDown(e, node.id)}
      onDoubleClick={handleDoubleClick}
      className="flowchart-node"
      style={{ cursor: 'move', userSelect: 'none' }}
    >
      {renderShapeElement()}

      {!isEditing ? (
        <text
          x={node.width / 2}
          y={node.height / 2}
          dominantBaseline="central"
          textAnchor="middle"
          fill={node.style.textColor || '#ffffff'}
          fontSize={node.style.fontSize || 14}
          fontFamily="var(--font-sans)"
          pointerEvents="none"
        >
          {lines.length === 1 ? (
            lines[0]
          ) : (
            lines.map((line, idx) => {
              const lineHeight = (node.style.fontSize || 14) * 1.2;
              const startY = (node.height / 2) - ((lines.length - 1) * lineHeight / 2);
              return (
                <tspan key={idx} x={node.width / 2} y={startY + idx * lineHeight}>
                  {line}
                </tspan>
              );
            })
          )}
        </text>
      ) : (
        <foreignObject
          x={node.type === 'rhombus' ? node.width * 0.15 : 8}
          y={node.type === 'rhombus' ? node.height * 0.15 : 8}
          width={node.type === 'rhombus' ? node.width * 0.7 : node.width - 16}
          height={node.type === 'rhombus' ? node.height * 0.7 : node.height - 16}
        >
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            style={{
              width: '100%',
              height: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: node.style.textColor || '#ffffff',
              fontSize: `${node.style.fontSize || 14}px`,
              fontFamily: 'var(--font-sans)',
              textAlign: 'center',
              resize: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1.2,
            }}
          />
        </foreignObject>
      )}
    </g>
  );
};
