import { describe, it, expect } from 'vitest';
import { FlowchartNode } from '../types/flowchart';
import { getAnchorPoint, getNodeAnchors, findNearestAnchor, getLineMidPoint } from '../utils/geometry';

describe('Geometry Utils', () => {
  const sampleNode: FlowchartNode = {
    id: 'node-1',
    type: 'rectangle',
    x: 100,
    y: 200,
    width: 160,
    height: 70,
    label: 'Test Node',
    style: {
      fillColor: '#1e293b',
      strokeColor: '#94a3b8',
      textColor: '#ffffff',
      fontSize: 14,
    },
  };

  it('calculates anchor points correctly', () => {
    const top = getAnchorPoint(sampleNode, 'top');
    expect(top).toEqual({ x: 180, y: 200, position: 'top', nodeId: 'node-1' });

    const right = getAnchorPoint(sampleNode, 'right');
    expect(right).toEqual({ x: 260, y: 235, position: 'right', nodeId: 'node-1' });

    const bottom = getAnchorPoint(sampleNode, 'bottom');
    expect(bottom).toEqual({ x: 180, y: 270, position: 'bottom', nodeId: 'node-1' });

    const left = getAnchorPoint(sampleNode, 'left');
    expect(left).toEqual({ x: 100, y: 235, position: 'left', nodeId: 'node-1' });
  });

  it('returns all 4 anchor points for a node', () => {
    const anchors = getNodeAnchors(sampleNode);
    expect(anchors).toHaveLength(4);
  });

  it('finds nearest anchor within max distance', () => {
    const nodes = [sampleNode];
    // Point very close to top anchor (180, 200)
    const target = { x: 182, y: 203 };
    const nearest = findNearestAnchor(nodes, target, 20);
    expect(nearest).not.toBeNull();
    expect(nearest?.position).toBe('top');
  });

  it('calculates mid point of a line', () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 100, y: 200 };
    const mid = getLineMidPoint(p1, p2);
    expect(mid).toEqual({ x: 50, y: 100 });
  });
});
