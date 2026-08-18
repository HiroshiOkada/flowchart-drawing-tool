import { FlowchartNode, AnchorPosition, Point, AnchorPoint } from '../types/flowchart';

/**
 * Calculate absolute (x, y) coordinate of a node's anchor point
 */
export function getAnchorPoint(node: FlowchartNode, position: AnchorPosition): AnchorPoint {
  const { x, y, width, height, id } = node;

  let px = x;
  let py = y;

  switch (position) {
    case 'top':
      px = x + width / 2;
      py = y;
      break;
    case 'right':
      px = x + width;
      py = y + height / 2;
      break;
    case 'bottom':
      px = x + width / 2;
      py = y + height;
      break;
    case 'left':
      px = x;
      py = y + height / 2;
      break;
  }

  return { x: px, y: py, position, nodeId: id };
}

/**
 * Get all 4 anchor points for a given node
 */
export function getNodeAnchors(node: FlowchartNode): AnchorPoint[] {
  const positions: AnchorPosition[] = ['top', 'right', 'bottom', 'left'];
  return positions.map((pos) => getAnchorPoint(node, pos));
}

/**
 * Find nearest anchor point among all nodes to a target coordinate
 */
export function findNearestAnchor(
  nodes: FlowchartNode[],
  targetPoint: Point,
  maxDistance: number = 30,
  excludeNodeId?: string
): AnchorPoint | null {
  let closest: AnchorPoint | null = null;
  let minDistance = maxDistance;

  for (const node of nodes) {
    if (excludeNodeId && node.id === excludeNodeId) continue;
    const anchors = getNodeAnchors(node);
    for (const anchor of anchors) {
      const dist = Math.hypot(anchor.x - targetPoint.x, anchor.y - targetPoint.y);
      if (dist < minDistance) {
        minDistance = dist;
        closest = anchor;
      }
    }
  }

  return closest;
}

/**
 * Calculate mid point of a line for connector text label
 */
export function getLineMidPoint(p1: Point, p2: Point): Point {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
}

/**
 * Calculate line path string (smooth cubic bezier or straight line)
 */
export function getConnectorPath(p1: Point, p2: Point, sourceAnchor?: AnchorPosition, targetAnchor?: AnchorPosition): string {
  // If anchors are specified, create a clean orthogonal/bezier path
  if (!sourceAnchor || !targetAnchor) {
    return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
  }

  const dx = Math.abs(p2.x - p1.x);
  const dy = Math.abs(p2.y - p1.y);
  const offset = Math.max(25, Math.min(dx, dy) * 0.5);

  let c1 = { ...p1 };
  let c2 = { ...p2 };

  switch (sourceAnchor) {
    case 'top': c1.y -= offset; break;
    case 'bottom': c1.y += offset; break;
    case 'left': c1.x -= offset; break;
    case 'right': c1.x += offset; break;
  }

  switch (targetAnchor) {
    case 'top': c2.y -= offset; break;
    case 'bottom': c2.y += offset; break;
    case 'left': c2.x -= offset; break;
    case 'right': c2.x += offset; break;
  }

  return `M ${p1.x} ${p1.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p2.x} ${p2.y}`;
}
