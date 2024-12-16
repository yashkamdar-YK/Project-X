import { useActionStore } from "@/lib/store/actionStore";
import { useConditionStore } from "@/lib/store/conditionStore";
import { Edge, Node, Position } from "@xyflow/react";
export const NodeTypes = {
  CONDITION: "CONDITION",
  ACTION: "ACTION",
  START: "START",
};

// Helper functions for node positioning
// const getNodePosition = (
//   nodes: Node[],
//   newNodeType: string | undefined,
//   edges: Edge[]
// ) => {
//   // For condition nodes
//   if (newNodeType === NodeTypes.CONDITION) {
//     // Find most recent condition node
//     const nodeWithSingleConnection = nodes.find((node) => {
//       if (node.type === NodeTypes.CONDITION || node.type === NodeTypes.START) {
//         const incomingEdge = edges.find((edge) => edge.target === node.id);
//         const outgoingEdge = edges.find((edge) => edge.source === node.id);
//         return incomingEdge && !outgoingEdge;
//       }
//     });

//     if (nodeWithSingleConnection) {
//       return {
//         x: nodeWithSingleConnection.position.x,
//         y: nodeWithSingleConnection.position.y + 200,
//       };
//     }
//   }

//   // For action nodes
//   if (newNodeType === NodeTypes.ACTION) {
//     const existingActionNodes = nodes.filter(
//       (node) => node.type === NodeTypes.ACTION
//     );
//     const firstConditionNode = nodes.find(
//       (node) => node.type === NodeTypes.CONDITION
//     );

//     if (existingActionNodes.length === 0 && firstConditionNode) {
//       // First action node - position relative to first condition node
//       return {
//         x: firstConditionNode.position.x + 400,
//         y: firstConditionNode.position.y,
//       };
//     } else if (existingActionNodes.length > 0) {
//       // Subsequent action nodes - stack vertically
//       const lastActionNode = [...existingActionNodes].sort(
//         (a, b) => b.position.y - a.position.y
//       )[0];
//       return {
//         x: lastActionNode.position.x,
//         y: lastActionNode.position.y + 200,
//       };
//     }
//   }
//   // Default positioning if no reference nodes found
//   return { x: 250, y: 100 };
// };

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


//  COMMENDET HANDLEADDNODE FUNCTION YOU SHOULD SEE CHANGES
// const handleAddNode = (nodes: Node[], edges: Edge[], item: Node) => {
//   const newNodeId = `node-${Date.now()}`;
//   const position = getNodePosition(nodes, item.type, edges);

//   const newNode = {
//     id: newNodeId,
//     type: item.type,
//     position,
//     data: { label: item.data.label },
//     sourcePosition: Position.Bottom,
//     targetPosition: Position.Top,
//   };

//   let newEdges = [...edges];

//   // Find the node with a single connection
//   const nodeWithSingleConnection = nodes.find((node) => {
//     const incomingEdge = edges.find((edge) => edge.target === node.id);
//     const outgoingEdge = edges.find((edge) => edge.source === node.id);
//     return incomingEdge && !outgoingEdge;
//   });

//   if (nodeWithSingleConnection && item.type === NodeTypes.CONDITION) {
//     newEdges.push({
//       id: `${nodeWithSingleConnection.id}-${newNodeId}`,
//       source: nodeWithSingleConnection.id,
//       target: newNodeId,
//       sourceHandle: `${nodeWithSingleConnection.id}-bottom`,
//       targetHandle: `${newNodeId}-top`,
//       type: "conditionEdge",
//     });
//   } else if (item.type === NodeTypes.CONDITION) {
//     // Connect to start node if no condition nodes exist
//     newEdges.push({
//       id: `start-${newNodeId}`,
//       source: "start",
//       target: newNodeId,
//       type: "conditionEdge",
//     });
//   }
//   return { newNode, newEdges };
// };

const handleAddNode = (nodes: Node[], edges: Edge[], item: Node) => {
  const newNodeId = `node-${Date.now()}`;
  const position = getNodePosition(nodes, item.type, edges);
  //@ts-ignore
  const label:string = item.isCopy
  ? `${item.type === "ACTION" ? "Action" : "Condition"}_${
      Object.keys(useActionStore.getState().actionNodes).length + 1
    } COPY` // Add "COPY" text for copied nodes
     
    : item?.data?.label ? item.data.label : item.type === 'ACTION'
    ? `Action_${Object.keys(useActionStore.getState().actionNodes).length + 1}`
    : `Condition_${Object.keys(useConditionStore.getState().conditionBlocks).length + 1}`;

  const newNode = {
    id: newNodeId,
    type: item.type,
    position,
    data: { label: label },
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

  //create in there store
  if (item.type === NodeTypes.ACTION) {
    useActionStore.getState().createActionNode(newNodeId,label);
  }
  if(item.type === NodeTypes.CONDITION){
    useConditionStore.getState().createConditionBlock(newNodeId, label);
  }

  return { newNode, newEdges };
};

// const handleDrop = (
//   event: React.DragEvent,
//   nodes: Node[],
//   edges: Edge[],
//   item: Node,
//   bounds: DOMRect
// ) => {
//   const position = getNodePosition(nodes, item.type, edges);
//   const newNodeId = `node-${nodes.length + 1}`;
//   const newNode = {
//     id: newNodeId,
//     type: item.type,
//     position,
//     data: { label: item.data.label },
//     sourcePosition: Position.Bottom, // Add default positions
//     targetPosition: Position.Top,
//   };

//   let newEdges = [...edges];

//   // Find node with a single connection
//   const nodeWithSingleConnection = nodes.find((node) => {
//     const incomingEdge = edges.find((edge) => edge.target === node.id);
//     const outgoingEdge = edges.find((edge) => edge.source === node.id);
//     return incomingEdge && !outgoingEdge;
//   });

//   if (nodeWithSingleConnection && item.type === NodeTypes.CONDITION) {
//     newEdges.push({
//       id: `${nodeWithSingleConnection.id}-${newNodeId}`,
//       source: nodeWithSingleConnection.id,
//       target: newNodeId,
//       sourceHandle: `${nodeWithSingleConnection.id}-bottom`, // Add specific handle
//       targetHandle: `${newNodeId}-top`, // Add specific handle
//       type: "conditionEdge",
//     });
//   }

//   return { newNode, newEdges };
// };

const handleDrop = (
  event: React.DragEvent,
  nodes: Node[],
  edges: Edge[],
  item: Node,
  bounds: DOMRect
) => {
  const position = getNodePosition(nodes, item.type, edges);
  const newNodeId = `node-${Date.now()}`; // Use timestamp to ensure unique ID
  const newNode = {
    id: newNodeId,
    type: item.type,
    position,
    data: { label: item.data.label },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  };

  let newEdges = [...edges];

  // Find the most recently added node without an outgoing connection
  const nodeWithSingleConnection = nodes.find((node) => {
    const incomingEdge = edges.find((edge) => edge.target === node.id);
    const outgoingEdge = edges.find((edge) => edge.source === node.id);
    return incomingEdge && !outgoingEdge;
  });

  // Connect Condition nodes
  if (item.type === NodeTypes.CONDITION) {
    if (nodeWithSingleConnection) {
      // If a node with a single connection exists, connect to it
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

  // Connect Action nodes
  if (item.type === NodeTypes.ACTION) {
    const latestConditionNode = nodes
      .filter((node) => node.type === NodeTypes.CONDITION)
      .sort((a, b) => b.position.y - a.position.y)[0];

    if (latestConditionNode) {
      newEdges.push({
        id: `${latestConditionNode.id}-${newNodeId}`,
        source: latestConditionNode.id,
        target: newNodeId,
        sourceHandle: `${latestConditionNode.id}-right`,
        type: "actionEdge",
      });
    }
  }

  return { newNode, newEdges };
};


export { getNodePosition, handleAddNode, handleDrop };
