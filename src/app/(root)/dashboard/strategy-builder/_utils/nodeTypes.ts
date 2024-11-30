import { Edge, Node, Position } from "@xyflow/react";

export const NodeTypes = {
  CONDITION: "CONDITION",
  ACTION: "ACTION",
  START: "START",
};

// Helper functions for node positioning
const getNodePosition = (nodes: Node[], newNodeType: string | undefined, edges: Edge[]) => {
  // For condition nodes
  if (newNodeType === NodeTypes.CONDITION) {
    // Find most recent condition node
    const nodeWithSingleConnection = nodes.find((node) => {
      if (node.type === NodeTypes.CONDITION) {
        const incomingEdge = edges.find((edge) => edge.target === node.id);
        const outgoingEdge = edges.find((edge) => edge.source === node.id);
        return incomingEdge && !outgoingEdge;
      }
    });

    if (nodeWithSingleConnection) {
      return {
        x: nodeWithSingleConnection.position.x,
        y: nodeWithSingleConnection.position.y + 200,
      };
    }
  }

  // For action nodes
  if (newNodeType === NodeTypes.ACTION) {
    const existingActionNodes = nodes.filter(
      (node) => node.type === NodeTypes.ACTION
    );
    const firstConditionNode = nodes.find(
      (node) => node.type === NodeTypes.CONDITION
    );

    if (existingActionNodes.length === 0 && firstConditionNode) {
      // First action node - position relative to first condition node
      return {
        x: firstConditionNode.position.x + 400,
        y: firstConditionNode.position.y,
      };
    } else if (existingActionNodes.length > 0) {
      // Subsequent action nodes - stack vertically
      const lastActionNode = [...existingActionNodes].sort(
        (a, b) => b.position.y - a.position.y
      )[0];
      return {
        x: lastActionNode.position.x,
        y: lastActionNode.position.y + 200,
      };
    }
  }
  // Default positioning if no reference nodes found
  return { x: 250, y: 100 };
};


// UPDATED: Connect new Node with that node how has only single connection
const handleAddNode = (nodes: Node[], edges: Edge[], item: Node) => {
  const newNodeId = `node-${Date.now()}`;
  const position = getNodePosition(nodes, item.type, edges);

  const newNode = {
    id: newNodeId,
    type: item.type,
    position,
    data: { label: item.data.label },
    sourcePosition:Position.Bottom,
    targetPosition:Position.Top
  };

  let newEdges = [...edges];

  // Find the node with a single connection
  const nodeWithSingleConnection = nodes.find((node) => {
    const incomingEdge = edges.find((edge) => edge.target === node.id);
    const outgoingEdge = edges.find((edge) => edge.source === node.id);
    return incomingEdge && !outgoingEdge;
  });

  if (nodeWithSingleConnection && item.type === NodeTypes.CONDITION) {
    newEdges.push({
      id: `${nodeWithSingleConnection.id}-${newNodeId}`,
      source: nodeWithSingleConnection.id,
      target: newNodeId,
      sourceHandle: `${nodeWithSingleConnection.id}-bottom`, // Specify bottom handle
      targetHandle: `${newNodeId}-top`, // Target top handle of new node
      type: "smoothstep",
    });
  }

  return { newNode, newEdges };
};

const handleDrop = (
  event: React.DragEvent,
  nodes: Node[],
  edges: Edge[],
  item: Node,
  bounds: DOMRect
) => {
  const position = getNodePosition(nodes, item.type, edges);
  const newNodeId = `node-${nodes.length + 1}`;
  const newNode = {
    id: newNodeId,
    type: item.type,
    position,
    data: { label: item.data.label },
  };

  let newEdges = [...edges];

  // Find node with a single connection
  const nodeWithSingleConnection = nodes.find((node) => {
    const incomingEdge = edges.find((edge) => edge.target === node.id);
    const outgoingEdge = edges.find((edge) => edge.source === node.id);
    return incomingEdge && !outgoingEdge;
  });

  if (nodeWithSingleConnection && item.type === NodeTypes.CONDITION) {
    newEdges.push({
      id: `${nodeWithSingleConnection.id}-${newNodeId}`,
      source: nodeWithSingleConnection.id,
      target: newNodeId,
      type: "smoothstep",
    });
  }

  return { newNode, newEdges };
};


export { getNodePosition, handleAddNode, handleDrop };
