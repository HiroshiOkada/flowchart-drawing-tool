import React from 'react';
import { FlowchartNode } from '../types/flowchart';

export type HandleDirection = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

interface ResizeHandlesProps {
  node: FlowchartNode;
  onResizeStart: (e: React.MouseEvent, handle: HandleDirection) => void;
}

export const ResizeHandles: React.FC<ResizeHandlesProps> = ({ node, onResizeStart }) => {
  const { x, y, width, height } = node;
  const handleSize = 8;
  const half = handleSize / 2;

  const handles: { dir: HandleDirection; cx: number; cy: number; cursor: string }[] = [
    { dir: 'nw', cx: x - half, cy: y - half, cursor: 'nwse-resize' },
    { dir: 'n', cx: x + width / 2 - half, cy: y - half, cursor: 'ns-resize' },
    { dir: 'ne', cx: x + width - half, cy: y - half, cursor: 'nesw-resize' },
    { dir: 'e', cx: x + width - half, cy: y + height / 2 - half, cursor: 'ew-resize' },
    { dir: 'se', cx: x + width - half, cy: y + height - half, cursor: 'nwse-resize' },
    { dir: 's', cx: x + width / 2 - half, cy: y + height - half, cursor: 'ns-resize' },
    { dir: 'sw', cx: x - half, cy: y + height - half, cursor: 'nesw-resize' },
    { dir: 'w', cx: x - half, cy: y + height / 2 - half, cursor: 'ew-resize' },
  ];

  return (
    <g className="resize-handles">
      {/* Outer bounding box selection outline */}
      <rect
        x={x - 2}
        y={y - 2}
        width={width + 4}
        height={height + 4}
        fill="none"
        stroke="var(--accent-color)"
        strokeWidth={1}
        strokeDasharray="4 4"
        pointerEvents="none"
      />
      {handles.map(({ dir, cx, cy, cursor }) => (
        <rect
          key={dir}
          x={cx}
          y={cy}
          width={handleSize}
          height={handleSize}
          fill="#ffffff"
          stroke="var(--accent-color)"
          strokeWidth={1.5}
          className="resize-handle"
          style={{ cursor }}
          onMouseDown={(e) => onResizeStart(e, dir)}
        />
      ))}
    </g>
  );
};
