import React, { useState, useRef, useCallback } from 'react';
import {
  FlowchartNode,
  Connector,
  AnchorPoint,
  AnchorPosition,
  PageOrientation,
  A4_PORTRAIT,
  A4_LANDSCAPE,
} from '../types/flowchart';
import { NodeShape } from './NodeShape';
import { ConnectorElement } from './ConnectorElement';
import { ResizeHandles, HandleDirection } from './ResizeHandles';
import { getNodeAnchors, findNearestAnchor } from '../utils/geometry';
import './Canvas.css';

interface CanvasProps {
  nodes: FlowchartNode[];
  connections: Connector[];
  selectedNodeId: string | null;
  selectedConnectorId: string | null;
  orientation: PageOrientation;
  onSelectNode: (id: string | null) => void;
  onSelectConnector: (id: string | null) => void;
  onUpdateNodePosition: (id: string, x: number, y: number) => void;
  onUpdateNodeDimensions: (id: string, width: number, height: number) => void;
  onUpdateNodeLabel: (id: string, label: string) => void;
  onUpdateConnectorLabel: (id: string, label: string) => void;
  onAddConnection: (
    sourceId: string,
    sourceAnchor: AnchorPosition,
    targetId: string,
    targetAnchor: AnchorPosition
  ) => void;
}

interface DragState {
  type: 'node-move' | 'resize' | 'connect';
  nodeId?: string;
  handleDir?: HandleDirection;
  sourceAnchor?: AnchorPoint;
  startX: number;
  startY: number;
  initialNodeX?: number;
  initialNodeY?: number;
  initialWidth?: number;
  initialHeight?: number;
}

export const Canvas: React.FC<CanvasProps> = ({
  nodes,
  connections,
  selectedNodeId,
  selectedConnectorId,
  orientation,
  onSelectNode,
  onSelectConnector,
  onUpdateNodePosition,
  onUpdateNodeDimensions,
  onUpdateNodeLabel,
  onUpdateConnectorLabel,
  onAddConnection,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [tempConnectLine, setTempConnectLine] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const [snapAnchor, setSnapAnchor] = useState<AnchorPoint | null>(null);

  const a4Dim = orientation === 'portrait' ? A4_PORTRAIT : A4_LANDSCAPE;

  // Convert client mouse event to SVG coordinate space
  const getSvgCoordinates = useCallback((e: React.MouseEvent): { x: number; y: number } => {
    if (!svgRef.current) return { x: e.clientX, y: e.clientY };
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  // Background click to clear selection
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === svgRef.current || (e.target as HTMLElement).tagName === 'svg') {
      onSelectNode(null);
      onSelectConnector(null);
    }
  };

  // Node MouseDown -> start drag move
  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    onSelectNode(nodeId);

    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    const coords = getSvgCoordinates(e);
    setDragState({
      type: 'node-move',
      nodeId,
      startX: coords.x,
      startY: coords.y,
      initialNodeX: node.x,
      initialNodeY: node.y,
    });
  };

  // Resize Handle MouseDown
  const handleResizeStart = (e: React.MouseEvent, handleDir: HandleDirection) => {
    e.stopPropagation();
    if (!selectedNodeId) return;

    const node = nodes.find((n) => n.id === selectedNodeId);
    if (!node) return;

    const coords = getSvgCoordinates(e);
    setDragState({
      type: 'resize',
      nodeId: selectedNodeId,
      handleDir,
      startX: coords.x,
      startY: coords.y,
      initialNodeX: node.x,
      initialNodeY: node.y,
      initialWidth: node.width,
      initialHeight: node.height,
    });
  };

  // Anchor MouseDown -> start connection drag
  const handleAnchorMouseDown = (e: React.MouseEvent, anchor: AnchorPoint) => {
    e.stopPropagation();
    const coords = getSvgCoordinates(e);
    setDragState({
      type: 'connect',
      sourceAnchor: anchor,
      startX: coords.x,
      startY: coords.y,
    });
    setTempConnectLine({
      x1: anchor.x,
      y1: anchor.y,
      x2: anchor.x,
      y2: anchor.y,
    });
  };

  // Canvas MouseMove -> handle node drag, resize, or connection line
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragState) return;
    const coords = getSvgCoordinates(e);

    if (dragState.type === 'node-move' && dragState.nodeId) {
      const dx = coords.x - dragState.startX;
      const dy = coords.y - dragState.startY;
      const newX = Math.round((dragState.initialNodeX || 0) + dx);
      const newY = Math.round((dragState.initialNodeY || 0) + dy);
      onUpdateNodePosition(dragState.nodeId, newX, newY);
    } else if (dragState.type === 'resize' && dragState.nodeId && dragState.handleDir) {
      const dx = coords.x - dragState.startX;
      const dy = coords.y - dragState.startY;
      const dir = dragState.handleDir;
      const initX = dragState.initialNodeX || 0;
      const initY = dragState.initialNodeY || 0;
      const initW = dragState.initialWidth || 100;
      const initH = dragState.initialHeight || 50;

      let newX = initX;
      let newY = initY;
      let newW = initW;
      let newH = initH;

      if (dir.includes('e')) newW = Math.max(40, initW + dx);
      if (dir.includes('s')) newH = Math.max(30, initH + dy);
      if (dir.includes('w')) {
        const potentialW = initW - dx;
        if (potentialW >= 40) {
          newW = potentialW;
          newX = initX + dx;
        }
      }
      if (dir.includes('n')) {
        const potentialH = initH - dy;
        if (potentialH >= 30) {
          newH = potentialH;
          newY = initY + dy;
        }
      }

      onUpdateNodePosition(dragState.nodeId, newX, newY);
      onUpdateNodeDimensions(dragState.nodeId, newW, newH);
    } else if (dragState.type === 'connect' && dragState.sourceAnchor) {
      const nearest = findNearestAnchor(nodes, coords, 30, dragState.sourceAnchor.nodeId);
      setSnapAnchor(nearest);

      const targetX = nearest ? nearest.x : coords.x;
      const targetY = nearest ? nearest.y : coords.y;

      setTempConnectLine({
        x1: dragState.sourceAnchor.x,
        y1: dragState.sourceAnchor.y,
        x2: targetX,
        y2: targetY,
      });
    }
  };

  // Canvas MouseUp -> complete drag / connection
  const handleMouseUp = () => {
    if (dragState?.type === 'connect' && dragState.sourceAnchor) {
      if (snapAnchor) {
        onAddConnection(
          dragState.sourceAnchor.nodeId,
          dragState.sourceAnchor.position,
          snapAnchor.nodeId,
          snapAnchor.position
        );
      }
    }
    setDragState(null);
    setTempConnectLine(null);
    setSnapAnchor(null);
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  return (
    <div className="canvas-container">
      <svg
        ref={svgRef}
        className="flowchart-canvas"
        width={a4Dim.width}
        height={a4Dim.height}
        viewBox={`0 0 ${a4Dim.width} ${a4Dim.height}`}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <defs>
          {/* Dot grid pattern */}
          <pattern
            id="dot-grid"
            width={20}
            height={20}
            patternUnits="userSpaceOnUse"
          >
            <circle cx={2} cy={2} r={1.2} fill="var(--grid-dot-color)" />
          </pattern>

          {/* Glow filter for selected items */}
          <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#6366f1" floodOpacity="0.7" />
          </filter>
        </defs>

        {/* Grid dots background */}
        <rect
          width="100%"
          height="100%"
          fill="url(#dot-grid)"
          className="grid-dots"
        />

        {/* A4 border guide */}
        <rect
          x={0}
          y={0}
          width={a4Dim.width}
          height={a4Dim.height}
          fill="none"
          stroke="rgba(99, 102, 241, 0.2)"
          strokeWidth={2}
          strokeDasharray="8 8"
          className="a4-border-guide"
          pointerEvents="none"
        />

        {/* 1. Connections */}
        {connections.map((conn) => (
          <ConnectorElement
            key={conn.id}
            connector={conn}
            nodes={nodes}
            isSelected={selectedConnectorId === conn.id}
            onSelect={(e) => {
              e.stopPropagation();
              onSelectConnector(conn.id);
            }}
            onUpdateLabel={onUpdateConnectorLabel}
          />
        ))}

        {/* Temporary connection line being dragged */}
        {tempConnectLine && (
          <line
            x1={tempConnectLine.x1}
            y1={tempConnectLine.y1}
            x2={tempConnectLine.x2}
            y2={tempConnectLine.y2}
            stroke="var(--accent-color)"
            strokeWidth={2}
            strokeDasharray="4 4"
            pointerEvents="none"
          />
        )}

        {/* 2. Nodes */}
        {nodes.map((node) => {
          const isSelected = selectedNodeId === node.id;
          const isHovered = hoveredNodeId === node.id;
          const anchors = getNodeAnchors(node);

          return (
            <g
              key={node.id}
              onMouseEnter={() => setHoveredNodeId(node.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
            >
              <NodeShape
                node={node}
                isSelected={isSelected}
                onSelect={(e) => {
                  e.stopPropagation();
                  onSelectNode(node.id);
                }}
                onUpdateLabel={onUpdateNodeLabel}
                onMouseDown={handleNodeMouseDown}
              />

              {/* Anchor points (visible on hover or select or during connection drag) */}
              {(isHovered || isSelected || dragState?.type === 'connect') &&
                anchors.map((anchor) => {
                  const isHighlighted = snapAnchor?.nodeId === anchor.nodeId && snapAnchor.position === anchor.position;
                  return (
                    <circle
                      key={`${node.id}-${anchor.position}`}
                      cx={anchor.x}
                      cy={anchor.y}
                      r={isHighlighted ? 7 : 5}
                      fill={isHighlighted ? 'var(--anchor-hover)' : 'var(--anchor-color)'}
                      stroke="#ffffff"
                      strokeWidth={1.5}
                      className="anchor-point"
                      style={{ cursor: 'crosshair' }}
                      onMouseDown={(e) => handleAnchorMouseDown(e, anchor)}
                    />
                  );
                })}
            </g>
          );
        })}

        {/* 3. Resize handles for selected node */}
        {selectedNode && (
          <ResizeHandles
            node={selectedNode}
            onResizeStart={handleResizeStart}
          />
        )}
      </svg>
    </div>
  );
};
