import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  parseFlowchartJson,
  INITIAL_FLOWCHART_DATA,
} from '../utils/storage';
import { FlowchartData } from '../types/flowchart';

describe('Storage Utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves and loads flowchart data from localStorage', () => {
    const customData: FlowchartData = {
      version: '1.0.0',
      canvasConfig: { orientation: 'landscape', gridVisible: false, zoom: 1 },
      nodes: [
        {
          id: 'test-1',
          type: 'rectangle',
          x: 10,
          y: 20,
          width: 100,
          height: 50,
          label: 'Test',
          style: { fillColor: '#000', strokeColor: '#fff', textColor: '#fff', fontSize: 14 },
        },
      ],
      connections: [],
    };

    saveToLocalStorage(customData);
    const loaded = loadFromLocalStorage();
    expect(loaded.nodes).toHaveLength(1);
    expect(loaded.nodes[0].id).toBe('test-1');
    expect(loaded.canvasConfig.orientation).toBe('landscape');
  });

  it('returns default initial data if localStorage is empty', () => {
    const loaded = loadFromLocalStorage();
    expect(loaded.nodes.length).toBeGreaterThan(0);
    expect(loaded.nodes[0].id).toBe('node-start');
  });

  it('parses valid JSON string into FlowchartData', () => {
    const jsonStr = JSON.stringify(INITIAL_FLOWCHART_DATA);
    const parsed = parseFlowchartJson(jsonStr);
    expect(parsed.nodes).toHaveLength(INITIAL_FLOWCHART_DATA.nodes.length);
  });

  it('throws error for invalid JSON format', () => {
    expect(() => parseFlowchartJson('{"invalid": true}')).toThrow();
  });
});
