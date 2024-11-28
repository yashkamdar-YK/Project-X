import { Edge, Node } from "@xyflow/react";

export const NodeTypes = {
  CONDITION: "CONDITION",
  ACTION: "ACTION",
  START: "START"
}

// Helper functions for node positioning
const getNodePosition = (nodes: Node[], newNodeType: string | undefined) => {
  // For condition nodes
  if (newNodeType === NodeTypes.CONDITION) {
    // Find most recent condition node
    const recentConditionNode = [...nodes]
      .reverse()
      .find(node => node.type === NodeTypes.CONDITION);

    if (recentConditionNode) {
      return {
        x: recentConditionNode.position.x,
        y: recentConditionNode.position.y + 200
      };
    }
  }

  // For action nodes
  if (newNodeType === NodeTypes.ACTION) {
    const existingActionNodes = nodes.filter(node => node.type === NodeTypes.ACTION);
    const firstConditionNode = nodes.find(node => node.type === NodeTypes.CONDITION);

    if (existingActionNodes.length === 0 && firstConditionNode) {
      // First action node - position relative to first condition node
      return {
        x: firstConditionNode.position.x + 400,
        y: firstConditionNode.position.y
      };
    } else if (existingActionNodes.length > 0) {
      // Subsequent action nodes - stack vertically
      const lastActionNode = [...existingActionNodes].sort(
        (a, b) => b.position.y - a.position.y
      )[0];
      return {
        x: lastActionNode.position.x,
        y: lastActionNode.position.y + 200
      };
    }
  }

  // Default positioning if no reference nodes found
  return { x: 250, y: 100 };
};

export enum EdgeTypes {
  DEFAULT = "default",
  CONDITION_TO_ACTION = "conditionToAction",
  CONDITION_TO_CONDITION = "conditionToCondition"
}

// Helper for determining correct edge type and handle positions
const getEdgeConfiguration = (
  sourceType: string | undefined,
  targetType: string
): { type: EdgeTypes; sourceHandle?: string; targetHandle?: string } => {
  if (sourceType === NodeTypes.CONDITION && targetType === NodeTypes.ACTION) {
    return {
      type: EdgeTypes.CONDITION_TO_ACTION,
      sourceHandle: 'right',
      targetHandle: 'left'
    };
  }
  if (sourceType === NodeTypes.CONDITION && targetType === NodeTypes.CONDITION) {
    return {
      type: EdgeTypes.CONDITION_TO_CONDITION,
      sourceHandle: 'bottom',
      targetHandle: 'top'
    };
  }
  // For START node connections
  return {
    type: EdgeTypes.DEFAULT,
    sourceHandle: 'bottom',
    targetHandle: 'top'
  };
};

// Updated handler for adding node through button
export const handleAddNode = (nodes: Node[], edges: Edge[], item: Node) => {
  const newNodeId = `node-${nodes.length + 1}`;
  const position = getNodePosition(nodes, item.type);
  
  const newNode = {
    id: newNodeId,
    type: item.type,
    position,
    data: { label: item.data.label },
  };
  
  let newEdges = [...edges];
  
  // Add edge based on node types
  if (item.type === NodeTypes.CONDITION || item.type === NodeTypes.ACTION) {
    const sourceNode = [...nodes].reverse().find(node => {
      if (item.type === NodeTypes.ACTION) {
        return node.type === NodeTypes.CONDITION;
      }
      return node.type === NodeTypes.CONDITION || node.type === NodeTypes.START;
    });
    
    if (sourceNode) {
      const edgeConfig = getEdgeConfiguration(sourceNode.type, item.type);
      newEdges.push({
        id: `${sourceNode.id}-${newNodeId}`,
        source: sourceNode.id,
        target: newNodeId,
        type: edgeConfig.type,
        sourceHandle: edgeConfig.sourceHandle,
        targetHandle: edgeConfig.targetHandle
      });
    }
  }
  
  return { newNode, newEdges };
};

// Updated drop handler
export const handleDrop = (
  event: React.DragEvent,
  nodes: Node[],
  edges: Edge[],
  item: Node,
  bounds: DOMRect
) => {
  const position = getNodePosition(nodes, item.type);
  const newNodeId = `node-${nodes.length + 1}`;
  
  const newNode = {
    id: newNodeId,
    type: item.type,
    position,
    data: { label: item.data.label },
  };
  
  let newEdges = [...edges];
  
  // Add edge based on node types
  if (item.type === NodeTypes.CONDITION || item.type === NodeTypes.ACTION) {
    const sourceNode = [...nodes].reverse().find(node => {
      if (item.type === NodeTypes.ACTION) {
        return node.type === NodeTypes.CONDITION;
      }
      return node.type === NodeTypes.CONDITION || node.type === NodeTypes.START;
    });
    
    if (sourceNode) {
      const edgeConfig = getEdgeConfiguration(sourceNode.type, item.type);
      newEdges.push({
        id: `${sourceNode.id}-${newNodeId}`,
        source: sourceNode.id,
        target: newNodeId,
        type: edgeConfig.type,
        sourceHandle: edgeConfig.sourceHandle,
        targetHandle: edgeConfig.targetHandle
      });
    }
  }
  
  return { newNode, newEdges };
};


export { getNodePosition };