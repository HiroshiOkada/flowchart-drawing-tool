import { useState, useEffect, useCallback } from 'react';
import {
  FlowchartData,
  FlowchartNode,
  Connector,
  NodeType,
  AnchorPosition,
  PageOrientation,
  DEFAULT_NODE_SPECS,
} from '../types/flowchart';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/storage';

export function useFlowchart() {
  const [data, setData] = useState<FlowchartData>(() => loadFromLocalStorage());
  const [past, setPast] = useState<FlowchartData[]>([]);
  const [future, setFuture] = useState<FlowchartData[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedConnectorId, setSelectedConnectorId] = useState<string | null>(null);

  // Auto-save to localStorage whenever data changes
  useEffect(() => {
    saveToLocalStorage(data);
  }, [data]);

  // Helper to commit new state with undo history
  const updateData = useCallback((newData: FlowchartData | ((prev: FlowchartData) => FlowchartData)) => {
    setData((prev) => {
      const nextData = typeof newData === 'function' ? newData(prev) : newData;
      setPast((history) => [...history, prev]);
      setFuture([]);
      return nextData;
    });
  }, []);

  // Undo
  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    setFuture((f) => [data, ...f]);
    setData(previous);
    setPast(newPast);
  }, [past, data]);

  // Redo
  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);

    setPast((p) => [...p, data]);
    setData(next);
    setFuture(newFuture);
  }, [future, data]);

  // Keyboard shortcut listener (Ctrl+Z, Ctrl+Y / Cmd+Z, Cmd+Shift+Z)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when typing inside input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (modifier && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      } else if (modifier && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        // Delete selected element
        e.preventDefault();
        deleteSelected();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, selectedNodeId, selectedConnectorId]);

  // Add a new node
  const addNode = useCallback((type: NodeType, x = 200, y = 200) => {
    const spec = DEFAULT_NODE_SPECS[type];
    const newNode: FlowchartNode = {
      id: `node-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      x,
      y,
      width: spec.width,
      height: spec.height,
      label: type === 'rectangle' ? '新規処理' : type === 'rhombus' ? '条件分岐' : '端点',
      style: {
        fillColor: spec.defaultFill,
        strokeColor: spec.defaultStroke,
        textColor: '#ffffff',
        fontSize: 14,
      },
    };

    updateData((prev) => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
    }));

    setSelectedNodeId(newNode.id);
    setSelectedConnectorId(null);
  }, [updateData]);

  // Update node position
  const updateNodePosition = useCallback((id: string, x: number, y: number) => {
    updateData((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => (n.id === id ? { ...n, x, y } : n)),
    }));
  }, [updateData]);

  // Update node dimensions
  const updateNodeDimensions = useCallback((id: string, width: number, height: number) => {
    updateData((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) =>
        n.id === id
          ? {
              ...n,
              width: Math.max(40, width),
              height: Math.max(30, height),
            }
          : n
      ),
    }));
  }, [updateData]);

  // Update node label
  const updateNodeLabel = useCallback((id: string, label: string) => {
    updateData((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => (n.id === id ? { ...n, label } : n)),
    }));
  }, [updateData]);

  // Update node style
  const updateNodeStyle = useCallback((id: string, styleUpdates: Partial<FlowchartNode['style']>) => {
    updateData((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) =>
        n.id === id ? { ...n, style: { ...n.style, ...styleUpdates } } : n
      ),
    }));
  }, [updateData]);

  // Add connection
  const addConnection = useCallback(
    (sourceId: string, sourceAnchor: AnchorPosition, targetId: string, targetAnchor: AnchorPosition) => {
      // Prevent duplicate connection between same source and target anchors
      const exists = data.connections.some(
        (c) =>
          c.sourceId === sourceId &&
          c.sourceAnchor === sourceAnchor &&
          c.targetId === targetId &&
          c.targetAnchor === targetAnchor
      );
      if (exists) return;

      const newConnector: Connector = {
        id: `conn-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        sourceId,
        sourceAnchor,
        targetId,
        targetAnchor,
        style: { strokeColor: '#94a3b8', strokeWidth: 1.75 },
      };

      updateData((prev) => ({
        ...prev,
        connections: [...prev.connections, newConnector],
      }));

      setSelectedConnectorId(newConnector.id);
      setSelectedNodeId(null);
    },
    [data.connections, updateData]
  );

  // Update connector label
  const updateConnectorLabel = useCallback((id: string, label: string) => {
    updateData((prev) => ({
      ...prev,
      connections: prev.connections.map((c) => (c.id === id ? { ...c, label } : c)),
    }));
  }, [updateData]);

  // Update connector style
  const updateConnectorStyle = useCallback((id: string, styleUpdates: Partial<Connector['style']>) => {
    updateData((prev) => ({
      ...prev,
      connections: prev.connections.map((c) =>
        c.id === id ? { ...c, style: { ...c.style, ...styleUpdates } } : c
      ),
    }));
  }, [updateData]);

  // Delete selected node or connector
  const deleteSelected = useCallback(() => {
    if (selectedNodeId) {
      updateData((prev) => ({
        ...prev,
        // Delete node and associated connections
        nodes: prev.nodes.filter((n) => n.id !== selectedNodeId),
        connections: prev.connections.filter(
          (c) => c.sourceId !== selectedNodeId && c.targetId !== selectedNodeId
        ),
      }));
      setSelectedNodeId(null);
    } else if (selectedConnectorId) {
      updateData((prev) => ({
        ...prev,
        connections: prev.connections.filter((c) => c.id !== selectedConnectorId),
      }));
      setSelectedConnectorId(null);
    }
  }, [selectedNodeId, selectedConnectorId, updateData]);

  // Set canvas orientation
  const setOrientation = useCallback((orientation: PageOrientation) => {
    updateData((prev) => ({
      ...prev,
      canvasConfig: { ...prev.canvasConfig, orientation },
    }));
  }, [updateData]);

  // Import full flowchart data from JSON
  const importData = useCallback((newData: FlowchartData) => {
    updateData(newData);
    setSelectedNodeId(null);
    setSelectedConnectorId(null);
  }, [updateData]);

  // Selected elements
  const selectedNode = data.nodes.find((n) => n.id === selectedNodeId) || null;
  const selectedConnector = data.connections.find((c) => c.id === selectedConnectorId) || null;

  return {
    data,
    selectedNode,
    selectedConnector,
    selectedNodeId,
    selectedConnectorId,
    setSelectedNodeId: (id: string | null) => {
      setSelectedNodeId(id);
      if (id) setSelectedConnectorId(null);
    },
    setSelectedConnectorId: (id: string | null) => {
      setSelectedConnectorId(id);
      if (id) setSelectedNodeId(null);
    },
    addNode,
    updateNodePosition,
    updateNodeDimensions,
    updateNodeLabel,
    updateNodeStyle,
    addConnection,
    updateConnectorLabel,
    updateConnectorStyle,
    deleteSelected,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    setOrientation,
    importData,
  };
}
