/**
 * Tree Layout Utilities
 *
 * Utilities for calculating positions and formatting blockchain timeline nodes
 */

export interface LayoutConfig {
  horizontalSpacing: number;
  verticalSpacing: number;
  startX: number;
  startY: number;
}

export interface NodePosition {
  x: number;
  y: number;
}

/**
 * Calculate tree layout positions for blockchain nodes
 */
export function calculateTreeLayout(
  nodeIds: readonly (string | number | bigint)[],
  previousNodes: readonly (string | number | bigint)[],
  config: LayoutConfig
): Map<string | number | bigint, NodePosition> {
  const positions = new Map<string | number | bigint, NodePosition>();
  const { horizontalSpacing, verticalSpacing, startX, startY } = config;

  // Build adjacency map: parent -> children[]
  const children = new Map<string | number | bigint, (string | number | bigint)[]>();

  nodeIds.forEach((nodeId, index) => {
    const prevNode = previousNodes[index];
    if (!children.has(prevNode)) {
      children.set(prevNode, []);
    }
    children.get(prevNode)?.push(nodeId);
  });

  // Track vertical position for each depth level
  const depthY = new Map<number, number>();

  // Recursive function to position nodes
  function positionNode(
    nodeId: string | number | bigint,
    depth: number,
    parentY?: number
  ): NodePosition {
    // If already positioned, return existing position
    if (positions.has(nodeId)) {
      return positions.get(nodeId)!;
    }

    const x = startX + depth * horizontalSpacing;

    // Calculate Y position
    let y: number;
    if (parentY !== undefined && (!depthY.has(depth) || depthY.get(depth)! <= parentY)) {
      // First child at this depth, or continuing from parent
      y = parentY;
    } else {
      // Subsequent children, offset vertically
      y = (depthY.get(depth) || startY) + verticalSpacing;
    }

    depthY.set(depth, y);
    const position = { x, y };
    positions.set(nodeId, position);

    // Position children
    const nodeChildren = children.get(nodeId) || [];
    nodeChildren.forEach(child => {
      positionNode(child, depth + 1, y);
    });

    return position;
  }

  // Find root nodes (nodes that are not children of any other node)
  const allChildren = new Set(nodeIds);
  const rootNodes = nodeIds.filter(nodeId => {
    const prevNode = previousNodes[nodeIds.indexOf(nodeId)];
    return prevNode === 0n || prevNode === 0 || !allChildren.has(prevNode);
  });

  // Position from each root
  rootNodes.forEach((rootId, index) => {
    positionNode(rootId, 0, startY + index * verticalSpacing);
  });

  return positions;
}

/**
 * Normalize node ID to string for consistent comparison
 */
export function normalizeNodeId(nodeId: string | number | bigint): string {
  if (typeof nodeId === 'bigint') {
    return nodeId.toString();
  }
  return String(nodeId);
}

/**
 * Get formatted event label for display
 */
export function getEventLabel(
  nodeId: string | number | bigint,
  description?: string
): string {
  const id = normalizeNodeId(nodeId);
  if (description && description.length > 0) {
    return `Event ${id}`;
  }
  return `Event ${id}`;
}
