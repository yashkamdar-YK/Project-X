import { Edge, Node, Position } from "@xyflow/react";
export const NodeTypes = {
  CONDITION: "CONDITION",
  ACTION: "ACTION",
  START: "START",
};

const getNodePosition = (
  nodes: Node[],
  newNodeType: string | undefined,
  edges: Edge[]
) => {
  // For condition nodes
  if (newNodeType === NodeTypes.CONDITION) {
    // Find most recent condition node
    const lastConditionOrStartNode = [...nodes]
      .filter(
        (node) =>
          node.type === NodeTypes.CONDITION || node.type === NodeTypes.START
      )
      .sort((a, b) => b.position.y - a.position.y)[0];

    if (lastConditionOrStartNode) {
      return {
        x: lastConditionOrStartNode.position.x,
        y: lastConditionOrStartNode.position.y + 200,
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

const handleAddNode = (nodes: Node[], edges: Edge[], item: Node) => {
  const newNodeId = `node-${Date.now()}`;
  const position = getNodePosition(nodes, item.type, edges);

  // Find connected condition node before adding sequence
  const connectedConditionNode = edges.find(
    edge => edge.target === newNodeId && 
    nodes.find(node => node.id === edge.source)?.type === NodeTypes.CONDITION
  );

    // Count existing Action Nodes to generate sequence number
    const actionNodes = nodes.filter(node => node.type === NodeTypes.ACTION);
    const sequenceNumber = actionNodes.length + 1;

  const newNode = {
    id: newNodeId,
    type: item.type,
    position,
    data: {
       label: item.data.label,
      // Only add sequence for Action Nodes connected to a condition
      ...(item.type === NodeTypes.ACTION && connectedConditionNode 
        ? { 
            sequenceNumber: nodes.filter(node => node.type === NodeTypes.ACTION).length + 1 
          } 
        : {})
    },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  };

  let newEdges = [...edges];

  // Find the last Condition or Start node
  const lastConditionOrStartNode = [...nodes]
    .filter(
      (node) =>
        node.type === NodeTypes.CONDITION || node.type === NodeTypes.START
    )
    .sort((a, b) => b.position.y - a.position.y)[0];
  if (lastConditionOrStartNode && item.type === NodeTypes.CONDITION) {
    // Add an edge to connect the new node to the last Condition or Start node
    newEdges.push({
      id: `${lastConditionOrStartNode.id}-${newNodeId}`,
      source: lastConditionOrStartNode.id,
      target: newNodeId,
      sourceHandle: `${lastConditionOrStartNode.id}-bottom`, // Match your handle IDs
      targetHandle: `${newNodeId}-top`,
      type: "conditionEdge",
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
  const newNodeId = `node-${Date.now()}`; 

  // Get connected action nodes and sort them by Y position
  const connectedActionNodes = nodes.filter(node => 
    node.type === NodeTypes.ACTION &&
    edges.some(edge => 
      edge.target === node.id && 
      nodes.find(n => n.id === edge.source)?.type === NodeTypes.CONDITION
    )
  ).sort((a, b) => a.position.y - b.position.y);

  // Calculate the sequence number based on Y position
  const newSequenceNumber = connectedActionNodes.length + 1;

  const newNode = {
    id: newNodeId,
    type: item.type,
    position,
    data: { 
      ...item.data,
      label: item.data.label,
      // Initialize sequenceNumber only if it's an Action node
      ...(item.type === NodeTypes.ACTION ? { sequenceNumber: newSequenceNumber } : {})
    },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  };

  let newEdges = [...edges];

  // Connect only Condition nodes
  if (item.type === NodeTypes.CONDITION) {
    const nodeWithSingleConnection = nodes.find((node) => {
      const incomingEdge = edges.find((edge) => edge.target === node.id);
      const outgoingEdge = edges.find((edge) => edge.source === node.id);
      return incomingEdge && !outgoingEdge;
    });

    if (nodeWithSingleConnection) {
      newEdges.push({
        id: `${nodeWithSingleConnection.id}-${newNodeId}`,
        source: nodeWithSingleConnection.id,
        target: newNodeId,
        sourceHandle: `${nodeWithSingleConnection.id}-bottom`,
        targetHandle: `${newNodeId}-top`,
        type: "conditionEdge",
      });
    } else {
      // If no existing nodes, connect to start node
      newEdges.push({
        id: `start-${newNodeId}`,
        source: "start",
        target: newNodeId,
        type: "smoothstep",
      });
    }
  }

  return { newNode, newEdges };
};


export { getNodePosition, handleAddNode, handleDrop };
