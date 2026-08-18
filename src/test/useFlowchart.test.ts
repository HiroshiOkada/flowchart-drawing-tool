import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFlowchart } from '../hooks/useFlowchart';

describe('useFlowchart Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with default nodes and connections', () => {
    const { result } = renderHook(() => useFlowchart());
    expect(result.current.data.nodes.length).toBeGreaterThan(0);
    expect(result.current.data.connections.length).toBeGreaterThan(0);
  });

  it('adds a new rectangle node', () => {
    const { result } = renderHook(() => useFlowchart());
    const initialCount = result.current.data.nodes.length;

    act(() => {
      result.current.addNode('rectangle', 100, 100);
    });

    expect(result.current.data.nodes).toHaveLength(initialCount + 1);
    expect(result.current.selectedNode?.type).toBe('rectangle');
  });

  it('supports Undo and Redo operations', () => {
    const { result } = renderHook(() => useFlowchart());
    const initialCount = result.current.data.nodes.length;

    act(() => {
      result.current.addNode('stadium', 200, 200);
    });
    expect(result.current.data.nodes).toHaveLength(initialCount + 1);
    expect(result.current.canUndo).toBe(true);

    act(() => {
      result.current.undo();
    });
    expect(result.current.data.nodes).toHaveLength(initialCount);
    expect(result.current.canRedo).toBe(true);

    act(() => {
      result.current.redo();
    });
    expect(result.current.data.nodes).toHaveLength(initialCount + 1);
  });

  it('deletes selected node and associated connections', () => {
    const { result } = renderHook(() => useFlowchart());
    const targetNodeId = 'node-process';

    act(() => {
      result.current.setSelectedNodeId(targetNodeId);
    });

    act(() => {
      result.current.deleteSelected();
    });

    expect(result.current.data.nodes.find((n) => n.id === targetNodeId)).toBeUndefined();
    // Connections connected to node-process should be removed
    const remainingConns = result.current.data.connections.filter(
      (c) => c.sourceId === targetNodeId || c.targetId === targetNodeId
    );
    expect(remainingConns).toHaveLength(0);
  });
});
