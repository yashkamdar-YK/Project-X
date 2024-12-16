import { addEdge, Connection, Edge, Node } from "@xyflow/react";
import { NodeTypes } from "./nodeTypes";
import { useConditionStore } from "@/lib/store/conditionStore";
import { useActionStore } from "@/lib/store/actionStore";

export const handleNodeDeletion = (
  nodesToDelete: Node[],
  allNodes: Node[],
  allEdges: Edge[],
  setNodes: Function,
  setEdges: Function
) => {
  let updatedEdges = [...allEdges];

  nodesToDelete.forEach((nodeToDelete) => {
    //delete from there respective stores
    if(nodeToDelete.type === NodeTypes.CONDITION){
      useConditionStore.getState().removeConditionBlock(nodeToDelete.id);
    }
    if(nodeToDelete.type === NodeTypes.ACTION){
      useActionStore.getState().removeActionNode(nodeToDelete.id);
    }

    // Find all edges connected to this node
    const connectedEdges = allEdges.filter(
      (edge) => edge.source === nodeToDelete.id || edge.target === nodeToDelete.id
    );

    // If this is a condition node, handle reconnection
    if (nodeToDelete.type === NodeTypes.CONDITION) {
      // Find the predecessor and successor condition nodes
      const incomingEdge = connectedEdges.find(
        (edge) => edge.target === nodeToDelete.id && !edge.sourceHandle?.includes('right')
      );
      const outgoingEdge = connectedEdges.find(
        (edge) => edge.source === nodeToDelete.id && !edge.sourceHandle?.includes('right')
      );

      // If both predecessor and successor exist, connect them
      if (incomingEdge && outgoingEdge) {
        const predecessorNode = allNodes.find(node => node.id === incomingEdge.source);
        const successorNode = allNodes.find(node => node.id === outgoingEdge.target);

        // Only create connection if both nodes exist and are valid types
        if (predecessorNode && successorNode) {
          const newEdge: Edge = {
            id: `${predecessorNode.id}-${successorNode.id}`,
            source: predecessorNode.id,
            target: successorNode.id,
            // Preserve handle connections
            sourceHandle: `${predecessorNode.id}-bottom`,
            targetHandle: `${successorNode.id}-top`,
            type: 'conditionEdge'
          };

          // Add the new connecting edge
          updatedEdges.push(newEdge);
        }
      }

      // Handle connected action nodes
      const actionConnections = connectedEdges.filter(
        (edge) =>
          edge.source === nodeToDelete.id &&
          edge.sourceHandle?.includes('right') &&
          allNodes.find(n => n.id === edge.target)?.type === NodeTypes.ACTION
      );

      // Remove action node connections
      actionConnections.forEach(actionEdge => {
        updatedEdges = updatedEdges.filter(
          edge => edge.id !== actionEdge.id
        );
      });
    }

    // Remove all original edges connected to the deleted node
    updatedEdges = updatedEdges.filter(
      (edge) => edge.source !== nodeToDelete.id && edge.target !== nodeToDelete.id
    );
  });

  // Remove nodes from the state
  const remainingNodes = allNodes.filter(
    (node) => !nodesToDelete.some((n) => n.id === node.id)
  );

  // Handle potential start node reconnection
  const finalEdges = handleStartNodeReconnection(
    remainingNodes,
    updatedEdges,
    setEdges
  );

  setNodes(remainingNodes);
  setEdges(finalEdges);
};

// Add this helper function to handle reconnecting Start node
const handleStartNodeReconnection = (
  nodes: Node[],
  edges: Edge[],
  setEdges: Function
) => {
  // Find the Start node
  const startNode = nodes.find((node) => node.id === "start");
  if (!startNode) return edges;

  // Find all Condition nodes
  const conditionNodes = nodes.filter(
    (node) => node.type === NodeTypes.CONDITION
  );

  // Check if Start node is currently disconnected
  const isStartNodeDisconnected = !edges.some(
    (edge) => edge.source === "start" || edge.target === "start"
  );

  // If Start node is disconnected and there are Condition nodes
  if (isStartNodeDisconnected && conditionNodes.length > 0) {
    // Find the first Condition node
    const firstConditionNode = conditionNodes.sort(
      (a, b) => a.position.y - b.position.y
    )[0];

    // Create a new edge connecting Start to the first Condition node
    const newEdge = {
      id: `start-${firstConditionNode.id}`,
      source: "start",
      target: firstConditionNode.id,
      type: "smoothstep",
    };

    return [...edges, newEdge];
  }

  return edges;
};

export const handleOnConnection = (connection: Connection, nodes: Node[], edges: Edge[], setEdges: Function, saveState: Function) => {
  const sourceNode = nodes.find((node) => node.id === connection.source);
  const targetNode = nodes.find((node) => node.id === connection.target);

  // For manual connection of Condition node to Start node only
  if (
    (sourceNode?.type === NodeTypes.START &&
      targetNode?.type === NodeTypes.CONDITION) ||
    (sourceNode?.type === NodeTypes.CONDITION &&
      targetNode?.type === NodeTypes.START)
  ) {
    const updatedEdges = addEdge(
      { ...connection, type: "smoothstep" },
      edges
    );
    setEdges(updatedEdges);
    saveState(nodes, updatedEdges);
    return;
  }

  // For Condition to Condition connections
  if (
    sourceNode?.type === NodeTypes.CONDITION &&
    targetNode?.type === NodeTypes.CONDITION &&
    connection.sourceHandle?.endsWith("-bottom") &&
    connection.targetHandle?.endsWith("-top")
  ) {
    const updatedEdges = addEdge(
      { ...connection, type: "conditionEdge" },
      edges
    );
    setEdges(updatedEdges);
    saveState(nodes, updatedEdges);
  }
  // For Condition to Action connections using right handle
  else if (
    sourceNode?.type === NodeTypes.CONDITION &&
    connection.sourceHandle?.endsWith("-right") &&
    targetNode?.type === NodeTypes.ACTION
  ) {
    const updatedEdges = addEdge(
      { ...connection, type: "actionEdge" },
      edges
    );
    setEdges(updatedEdges);
    saveState(nodes, updatedEdges);
  }
  // Reject other connections
  else {
    console.warn("Invalid connection");
  }
}