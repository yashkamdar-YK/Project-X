import { useActionStore } from "@/lib/store/actionStore";
import { useConditionStore } from "@/lib/store/conditionStore";
import { useNodeStore } from "@/lib/store/nodeStore";
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
  const newNodeId = getNodeId(item);
  const position = getNodePosition(nodes, item.type, edges);
  const label = getNodeLabel(item);

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
    //@ts-ignore
    if(item?.isCopy){
      useActionStore.getState().copyActionNode(item.id, newNodeId, label);
    }else{
      useActionStore.getState().createActionNode(newNodeId,label);
    }
  }
  if(item.type === NodeTypes.CONDITION){
    //@ts-ignore
    if(item?.isCopy){
      useConditionStore.getState().copyConditionBlock(item.id, newNodeId, label);
    }else {
      useConditionStore.getState().createConditionBlock(newNodeId, label, label?.includes('Entry') ? 'entry' : 'exit');
    }
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
  const newNodeId = getNodeId(item);
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

const getNodeLabel = (item: any): string => {
  // If it's a copy, generate a label with "COPY" suffix
  if (item.isCopy) {
    return `${item?.label}_COPY`;
  }

  // If item already has a label, use it
  if (item?.data?.label) {
    return item.data.label;
  }

  // Generate new label based on type
  const isAction = item.type === "ACTION";
  const count = isAction 
    ? Object.keys(useActionStore.getState().actionNodes).length + 1
    : Object.keys(useConditionStore.getState().conditionBlocks).length + 1;
  const prefix = isAction ? "Action" : "Condition";
  
  return `${prefix}_${count}`;
};

export const getNodeId = (item: any): string => {
  if(!item?.type) throw new Error("Item type is required to generate node id");
  const prefix = item.type === NodeTypes.ACTION ? "ac" : "ct";
  const suffix = Date.now()?.toString().slice(-3);
  const id = `${prefix}${suffix}`;

  //check is already existing in nodes
  const nodes = useNodeStore.getState().nodes;
  const isExist = nodes.find(node => node.id === id);
  if(isExist){
    return getNodeId(item);
  }

  return id;
}