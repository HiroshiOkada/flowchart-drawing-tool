import { FlowchartData, CanvasConfig } from '../types/flowchart';

const STORAGE_KEY = 'flowchart_studio_data_v1';

export const DEFAULT_CANVAS_CONFIG: CanvasConfig = {
  orientation: 'portrait',
  gridVisible: true,
  zoom: 1,
};

export const INITIAL_FLOWCHART_DATA: FlowchartData = {
  version: '1.0.0',
  canvasConfig: DEFAULT_CANVAS_CONFIG,
  nodes: [
    {
      id: 'node-start',
      type: 'stadium',
      x: 320,
      y: 100,
      width: 150,
      height: 60,
      label: '開始 (Start)',
      style: {
        fillColor: '#312e81',
        strokeColor: '#6366f1',
        textColor: '#ffffff',
        fontSize: 14,
      },
    },
    {
      id: 'node-process',
      type: 'rectangle',
      x: 315,
      y: 230,
      width: 160,
      height: 70,
      label: 'データ処理実行',
      style: {
        fillColor: '#1e293b',
        strokeColor: '#94a3b8',
        textColor: '#ffffff',
        fontSize: 14,
      },
    },
    {
      id: 'node-decision',
      type: 'rhombus',
      x: 305,
      y: 370,
      width: 180,
      height: 80,
      label: '正常終了か？',
      style: {
        fillColor: '#065f46',
        strokeColor: '#10b981',
        textColor: '#ffffff',
        fontSize: 14,
      },
    },
    {
      id: 'node-end',
      type: 'stadium',
      x: 320,
      y: 530,
      width: 150,
      height: 60,
      label: '終了 (End)',
      style: {
        fillColor: '#881337',
        strokeColor: '#f43f5e',
        textColor: '#ffffff',
        fontSize: 14,
      },
    },
  ],
  connections: [
    {
      id: 'conn-1',
      sourceId: 'node-start',
      sourceAnchor: 'bottom',
      targetId: 'node-process',
      targetAnchor: 'top',
      style: { strokeColor: '#94a3b8', strokeWidth: 1.75 },
    },
    {
      id: 'conn-2',
      sourceId: 'node-process',
      sourceAnchor: 'bottom',
      targetId: 'node-decision',
      targetAnchor: 'top',
      style: { strokeColor: '#94a3b8', strokeWidth: 1.75 },
    },
    {
      id: 'conn-3',
      sourceId: 'node-decision',
      sourceAnchor: 'bottom',
      targetId: 'node-end',
      targetAnchor: 'top',
      label: 'Yes',
      style: { strokeColor: '#10b981', strokeWidth: 1.75 },
    },
  ],
};

export function saveToLocalStorage(data: FlowchartData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save flowchart data to localStorage:', err);
  }
}

export function loadFromLocalStorage(): FlowchartData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_FLOWCHART_DATA;
    const parsed = JSON.parse(raw) as FlowchartData;
    if (parsed && Array.isArray(parsed.nodes) && Array.isArray(parsed.connections)) {
      return parsed;
    }
  } catch (err) {
    console.error('Failed to load flowchart data from localStorage:', err);
  }
  return INITIAL_FLOWCHART_DATA;
}

export function exportToJsonFile(data: FlowchartData, filename = 'flowchart.json'): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function parseFlowchartJson(jsonString: string): FlowchartData {
  const parsed = JSON.parse(jsonString);
  if (!parsed || !Array.isArray(parsed.nodes) || !Array.isArray(parsed.connections)) {
    throw new Error('無効なフローチャートJSONフォーマットです。');
  }
  return {
    version: parsed.version || '1.0.0',
    canvasConfig: parsed.canvasConfig || DEFAULT_CANVAS_CONFIG,
    nodes: parsed.nodes,
    connections: parsed.connections,
  };
}
