/**
 * Tree Layout Utility
 *
 * Provides pure functions for calculating tree node positions using a modified
 * Reingold-Tilford algorithm that allocates vertical space proportional to subtree sizes.
 */

export interface TreeLayoutConfig {
  horizontalSpacing: number; // Space between depth levels (columns)
  verticalSpacing: number;   // Base space between sibling branches
  startX: number;            // Starting X position
  startY: number;            // Starting Y position
}

export interface TreeLayoutResult {
  nodePositions: Map<number, { x: number; y: number }>;
  nodesByParent: Map<number, number[]>;
  nodeDepths: Map<number, number>;
  subtreeHeights: Map<number, number>;
}

/**
 * Normalize various node ID types to number
 * Handles string, number, and bigint inputs from blockchain data
 */
export function normalizeNodeId(nodeId: string | number | bigint): number {
  if (typeof nodeId === 'bigint') {
    return Number(nodeId);
  }
  if (typeof nodeId === 'number') {
    return nodeId;
  }
  return parseInt(String(nodeId));
}

/**
 * Calculate tree layout positions for nodes
 *
 * Algorithm:
 * 1. Build parent-child relationships
 * 2. Calculate depth for each node (distance from root)
 * 3. Calculate subtree heights (how much vertical space each subtree needs)
 * 4. Position nodes based on depth (X) and accumulated subtree heights (Y)
 *
 * @param nodeIds - Array of node identifiers
 * @param previousNodes - Array of parent node identifiers (0 or empty for root)
 * @param config - Layout configuration
 * @returns Layout data including positions and tree structure
 */
export function calculateTreeLayout(
  nodeIds: readonly (string | number | bigint)[],
  previousNodes: readonly (string | number | bigint)[],
  config: TreeLayoutConfig
): TreeLayoutResult {
  const { horizontalSpacing, verticalSpacing, startX, startY } = config;

  // Step 1: Build parent-child relationships and calculate depths
  const nodesByParent = new Map<number, number[]>();
  const nodeDepths = new Map<number, number>();

  nodeIds.forEach((nodeIdStr, index) => {
    const nodeId = normalizeNodeId(nodeIdStr);
    const previousNode = previousNodes[index] || '';
    const parentId = (previousNode && String(previousNode) !== '0')
      ? normalizeNodeId(previousNode)
      : 0;

    // Add to parent's children list
    if (!nodesByParent.has(parentId)) {
      nodesByParent.set(parentId, []);
    }
    nodesByParent.get(parentId)!.push(nodeId);

    // Calculate depth (distance from root)
    const parentDepth = nodeDepths.get(parentId) || 0;
    nodeDepths.set(nodeId, parentDepth + 1);
  });

  // Step 2: Sort siblings by ID for consistent ordering
  nodesByParent.forEach((siblings) => {
    siblings.sort((a, b) => a - b);
  });

  // Step 3: Calculate subtree heights (vertical space needed)
  const subtreeHeights = new Map<number, number>();

  const calculateSubtreeHeight = (nodeId: number): number => {
    // Memoization - return cached result if available
    if (subtreeHeights.has(nodeId)) {
      return subtreeHeights.get(nodeId)!;
    }

    const children = nodesByParent.get(nodeId) || [];

    if (children.length === 0) {
      // Leaf node needs 1 unit of vertical space
      subtreeHeights.set(nodeId, 1);
      return 1;
    }

    // Internal node needs space = sum of all children's subtrees
    const totalHeight = children.reduce((sum, childId) => {
      return sum + calculateSubtreeHeight(childId);
    }, 0);

    subtreeHeights.set(nodeId, totalHeight);
    return totalHeight;
  };

  // Calculate heights for all nodes
  nodeIds.forEach((nodeIdStr) => {
    const nodeId = normalizeNodeId(nodeIdStr);
    calculateSubtreeHeight(nodeId);
  });

  // Step 4: Calculate final positions
  const nodePositions = new Map<number, { x: number; y: number }>();

  nodeIds.forEach((nodeIdStr, index) => {
    const nodeId = normalizeNodeId(nodeIdStr);
    const previousNode = previousNodes[index] || '';
    const parentId = (previousNode && String(previousNode) !== '0')
      ? normalizeNodeId(previousNode)
      : 0;

    const depth = nodeDepths.get(nodeId) || 0;
    let x: number, y: number;

    if (parentId === 0) {
      // Root node - positioned at starting coordinates
      x = startX;
      y = startY;
    } else {
      const siblings = nodesByParent.get(parentId) || [];
      const siblingIndex = siblings.indexOf(nodeId);

      // X position based on depth (creates vertical columns)
      x = startX + (depth * horizontalSpacing);

      // Y position based on sibling index and subtree heights
      if (siblingIndex === 0) {
        // First child stays at parent's Y level (main timeline continuation)
        const parentPos = nodePositions.get(parentId);
        y = parentPos ? parentPos.y : startY;
      } else {
        // Subsequent children offset vertically based on previous siblings' subtree sizes
        const parentPos = nodePositions.get(parentId);
        const baseY = parentPos ? parentPos.y : startY;

        // Accumulate vertical offset from all previous siblings
        let yOffset = 0;
        for (let i = 0; i < siblingIndex; i++) {
          const prevSiblingId = siblings[i];
          const prevSiblingHeight = subtreeHeights.get(prevSiblingId) || 1;
          yOffset += prevSiblingHeight * verticalSpacing;
        }

        y = baseY + yOffset;
      }
    }

    nodePositions.set(nodeId, { x, y });
  });

  return {
    nodePositions,
    nodesByParent,
    nodeDepths,
    subtreeHeights,
  };
}

/**
 * Generate event labels for nodes based on branching structure
 *
 * Main timeline: "1", "2", "3", ...
 * Branches: "2b", "2c", "3b", ...
 *
 * @param nodeId - The node to generate label for
 * @param parentId - The parent node ID (0 for root)
 * @param nodesByParent - Map of parent IDs to their children
 * @returns Event label string
 */
export function getEventLabel(
  nodeId: number,
  parentId: number,
  nodesByParent: Map<number, number[]>
): string {
  if (parentId === 0) {
    // Root nodes use their numeric ID
    return nodeId.toString();
  }

  const siblings = nodesByParent.get(parentId) || [];
  const siblingIndex = siblings.indexOf(nodeId);

  if (siblingIndex === 0) {
    // First child continues the main timeline (no letter suffix)
    return nodeId.toString();
  } else {
    // Additional children are branches with letter suffixes ('b', 'c', 'd', ...)
    const branchLetter = String.fromCharCode(97 + siblingIndex);
    return `${parentId}${branchLetter}`;
  }
}
