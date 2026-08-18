export type NodeType = 'rectangle' | 'rhombus' | 'stadium';

export type AnchorPosition = 'top' | 'right' | 'bottom' | 'left';

export interface NodeStyle {
  fillColor: string;
  strokeColor: string;
  textColor: string;
  fontSize: number;
}

export interface FlowchartNode {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  style: NodeStyle;
}

export interface ConnectorStyle {
  strokeColor: string;
  strokeWidth: number;
}

export interface Connector {
  id: string;
  sourceId: string;
  sourceAnchor: AnchorPosition;
  targetId: string;
  targetAnchor: AnchorPosition;
  label?: string;
  style: ConnectorStyle;
}

export type PageOrientation = 'portrait' | 'landscape';

export interface CanvasConfig {
  orientation: PageOrientation;
  gridVisible: boolean;
  zoom: number;
}

export interface FlowchartData {
  version: string;
  nodes: FlowchartNode[];
  connections: Connector[];
  canvasConfig: CanvasConfig;
}

export interface Point {
  x: number;
  y: number;
}

export interface AnchorPoint extends Point {
  position: AnchorPosition;
  nodeId: string;
}

// A4 dimensions in px at 96 DPI
export const A4_PORTRAIT = { width: 794, height: 1123 };
export const A4_LANDSCAPE = { width: 1123, height: 794 };

// Default node dimensions & styles
export const DEFAULT_NODE_SPECS: Record<NodeType, { width: number; height: number; defaultFill: string; defaultStroke: string }> = {
  rectangle: {
    width: 160,
    height: 70,
    defaultFill: '#1e293b', // Dark Slate
    defaultStroke: '#94a3b8',
  },
  rhombus: {
    width: 180,
    height: 80,
    defaultFill: '#065f46', // Emerald Green
    defaultStroke: '#10b981',
  },
  stadium: {
    width: 150,
    height: 60,
    defaultFill: '#312e81', // Indigo Blue
    defaultStroke: '#6366f1',
  },
};

// Preset colors from user requirements
export const COLOR_PALETTE = [
  { name: 'Dark Slate', fill: '#1e293b', stroke: '#94a3b8' },
  { name: 'Emerald Green', fill: '#065f46', stroke: '#10b981' },
  { name: 'Indigo Blue', fill: '#312e81', stroke: '#6366f1' },
  { name: 'Rose Red', fill: '#881337', stroke: '#f43f5e' },
  { name: 'Cyan', fill: '#164e63', stroke: '#06b6d4' },
  { name: 'Amber', fill: '#78350f', stroke: '#f59e0b' },
];
