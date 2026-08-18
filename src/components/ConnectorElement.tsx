import React, { useState } from 'react';
import { Connector, FlowchartNode } from '../types/flowchart';
import { getAnchorPoint, getConnectorPath, getLineMidPoint } from '../utils/geometry';

interface ConnectorElementProps {
  connector: Connector;
  nodes: FlowchartNode[];
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onUpdateLabel: (id: string, newLabel: string) => void;
}

export const ConnectorElement: React.FC<ConnectorElementProps> = ({
  connector,
  nodes,
  isSelected,
  onSelect,
  onUpdateLabel,
}) => {
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [labelText, setLabelText] = useState(connector.label || '');

  const sourceNode = nodes.find((n) => n.id === connector.sourceId);
  const targetNode = nodes.find((n) => n.id === connector.targetId);

  if (!sourceNode || !targetNode) return null;

  const startPoint = getAnchorPoint(sourceNode, connector.sourceAnchor);
  const endPoint = getAnchorPoint(targetNode, connector.targetAnchor);

  const pathString = getConnectorPath(startPoint, endPoint, connector.sourceAnchor, connector.targetAnchor);
  const midPoint = getLineMidPoint(startPoint, endPoint);

  const strokeWidth = isSelected ? 2.5 : connector.style.strokeWidth || 1.75;
  const strokeColor = isSelected ? 'var(--accent-color)' : connector.style.strokeColor || '#94a3b8';
  const markerId = isSelected ? 'arrowhead-selected' : `arrowhead-${connector.id}`;

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingLabel(true);
  };

  const handleBlur = () => {
    setIsEditingLabel(false);
    onUpdateLabel(connector.id, labelText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditingLabel(false);
      onUpdateLabel(connector.id, labelText);
    }
    if (e.key === 'Escape') {
      setIsEditingLabel(false);
      setLabelText(connector.label || '');
    }
  };

  return (
    <g className="connector-element" onClick={onSelect}>
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 10 5 L 0 9 z" fill={strokeColor} />
        </marker>
      </defs>

      {/* Invisible wider path to make selection easier */}
      <path
        d={pathString}
        fill="none"
        stroke="transparent"
        strokeWidth={12}
        style={{ cursor: 'pointer' }}
      />

      {/* Visible connector line */}
      <path
        d={pathString}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        markerEnd={`url(#${markerId})`}
        style={{ cursor: 'pointer', transition: 'stroke 0.15s ease' }}
      />

      {/* Label on connector */}
      {(connector.label || isEditingLabel || isSelected) && (
        <g
          transform={`translate(${midPoint.x}, ${midPoint.y})`}
          onDoubleClick={handleDoubleClick}
          style={{ cursor: 'pointer' }}
        >
          {!isEditingLabel ? (
            <g>
              <rect
                x={-((connector.label?.length || 4) * 4 + 8)}
                y={-10}
                width={(connector.label?.length || 4) * 8 + 16}
                height={20}
                rx={4}
                fill="var(--bg-panel)"
                stroke={isSelected ? 'var(--accent-color)' : 'var(--border-color)'}
                strokeWidth={1}
              />
              <text
                x={0}
                y={0}
                dominantBaseline="central"
                textAnchor="middle"
                fill={connector.label ? 'var(--text-primary)' : 'var(--text-muted)'}
                fontSize={12}
                fontFamily="var(--font-sans)"
              >
                {connector.label || '+ ラベル'}
              </text>
            </g>
          ) : (
            <foreignObject x={-40} y={-12} width={80} height={24}>
              <input
                type="text"
                autoFocus
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--accent-color)',
                  borderRadius: '4px',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  textAlign: 'center',
                  outline: 'none',
                }}
              />
            </foreignObject>
          )}
        </g>
      )}
    </g>
  );
};
