import { Edge, Node } from "@xyflow/react";

const getStandardHandleId = (nodeId: string, type: 'top' | 'bottom' | 'right') => `${nodeId}-${type}`;

const handleNodeConnections = (nodes: Node[], edges: Edge[]) => {
  const updatedEdges = [...edges];
  const sortedNodes = nodes
    .filter(node => node.type === 'CONDITION')
    .sort((a, b) => a.position.y - b.position.y);

  // Reconnect vertical connections
  sortedNodes.forEach((node, index) => {
    if (index > 0) {
      const prevNode = sortedNodes[index - 1];
      const existingEdge = updatedEdges.find(
        edge => edge.source === prevNode.id && edge.target === node.id
      );

      if (!existingEdge) {
        updatedEdges.push({
          id: `${prevNode.id}-${node.id}`,
          source: prevNode.id,
          target: node.id,
          sourceHandle: getStandardHandleId(prevNode.id, 'bottom'),
          targetHandle: getStandardHandleId(node.id, 'top'),
          type: 'conditionEdge'
        });
      }
    }

    // Maintain action connections
    const actionEdges = edges.filter(
      edge => 
        edge.source === node.id && 
        edge.sourceHandle?.includes('right') &&
        nodes.find(n => n.id === edge.target)?.type === 'ACTION'
    );

    actionEdges.forEach(edge => {
      const existingEdge = updatedEdges.find(e => e.id === edge.id);
      if (!existingEdge) {
        updatedEdges.push({
          ...edge,
          sourceHandle: getStandardHandleId(node.id, 'right')
        });
      }
    });
  });

  return updatedEdges;
};

const switchNodes = (
  currentNode: Node,
  switchNode: Node,
  nodes: Node[],
  edges: Edge[],
  setNodes: Function,
  setEdges: Function
) => {
  const currentPos = { ...currentNode.position };
  const switchPos = { ...switchNode.position };

  const updatedNodes = nodes.map(node => {
    if (node.id === currentNode.id) return { ...node, position: switchPos };
    if (node.id === switchNode.id) return { ...node, position: currentPos };
    return node;
  });

  const updatedEdges = handleNodeConnections(updatedNodes, edges);
  
  setNodes(updatedNodes);
  setEdges(updatedEdges);
  
  return { nodes: updatedNodes, edges: updatedEdges };
};

export { handleNodeConnections, switchNodes };