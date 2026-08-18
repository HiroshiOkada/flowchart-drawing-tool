import React, { useEffect } from 'react';
import { useFlowchart } from './hooks/useFlowchart';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { PropertyPanel } from './components/PropertyPanel';
import { exportToJsonFile, parseFlowchartJson } from './utils/storage';
import { exportSvgToPng } from './utils/export';

export const App: React.FC = () => {
  const {
    data,
    selectedNode,
    selectedConnector,
    selectedNodeId,
    selectedConnectorId,
    setSelectedNodeId,
    setSelectedConnectorId,
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
    canUndo,
    canRedo,
    setOrientation,
    importData,
  } = useFlowchart();

  // Set print class on body depending on orientation
  useEffect(() => {
    document.body.className = `print-${data.canvasConfig.orientation}`;
  }, [data.canvasConfig.orientation]);

  const handleExportJson = () => {
    exportToJsonFile(data, `flowchart-${Date.now()}.json`);
  };

  const handleImportJson = (jsonStr: string) => {
    try {
      const parsed = parseFlowchartJson(jsonStr);
      importData(parsed);
    } catch (err: any) {
      alert(err.message || 'JSONデータの読み込みに失敗しました。');
    }
  };

  const handleExportPng = () => {
    const svgEl = document.querySelector('.flowchart-canvas') as SVGSVGElement | null;
    if (svgEl) {
      exportSvgToPng(svgEl, `flowchart-${Date.now()}.png`, 2);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="app-container">
      <Header
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        orientation={data.canvasConfig.orientation}
        onOrientationChange={setOrientation}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onExportPng={handleExportPng}
        onPrint={handlePrint}
      />

      <main className="app-main">
        <Sidebar onAddNode={(type) => addNode(type)} />

        <Canvas
          nodes={data.nodes}
          connections={data.connections}
          selectedNodeId={selectedNodeId}
          selectedConnectorId={selectedConnectorId}
          orientation={data.canvasConfig.orientation}
          onSelectNode={setSelectedNodeId}
          onSelectConnector={setSelectedConnectorId}
          onUpdateNodePosition={updateNodePosition}
          onUpdateNodeDimensions={updateNodeDimensions}
          onUpdateNodeLabel={updateNodeLabel}
          onUpdateConnectorLabel={updateConnectorLabel}
          onAddConnection={addConnection}
        />

        <PropertyPanel
          selectedNode={selectedNode}
          selectedConnector={selectedConnector}
          onUpdateNodeStyle={updateNodeStyle}
          onUpdateNodeDimensions={updateNodeDimensions}
          onUpdateNodeLabel={updateNodeLabel}
          onUpdateConnectorLabel={updateConnectorLabel}
          onUpdateConnectorStyle={updateConnectorStyle}
          onDeleteSelected={deleteSelected}
        />
      </main>
    </div>
  );
};

export default App;
