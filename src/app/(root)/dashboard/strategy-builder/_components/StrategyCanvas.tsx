import React, { useCallback, useState } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Connection,
  NodeChange,
  EdgeChange,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Background,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { StartNode, AddNode, ConditionNode, ActionNode } from './canvas/CustomNodes';
import CustomControls from "./canvas/customeControl";
import { useSheetStore } from "@/lib/store/SheetStore"; // Import the store

import { useNodeStore } from "@/lib/store/nodeStore"; // Import the new NodeStore

// Define node types mapping
const nodeTypes = {
  startNode: StartNode,
  addNode: AddNode,
  conditionNode: ConditionNode,
  actionNode: ActionNode,
};

const StrategyCanvas = () => {

  const { nodes, edges, setNodes, setEdges } = useNodeStore();

  const { openSheet } = useSheetStore();

  // Handle nodes changes
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes(applyNodeChanges(changes, nodes)),
    [nodes, setNodes]
  );

  // Handle edges changes
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges(applyEdgeChanges(changes, edges)),
    [edges, setEdges]
  );

  // Handle new connections
  const onConnect = useCallback(
    (connection: Connection) => setEdges(addEdge(connection, edges)),
    [edges, setEdges]
  );

  // Handle node click
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.stopPropagation(); 

      openSheet('node', node);
    },
    [openSheet]
  );


  // Handle drag over
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left - 100,
        y: event.clientY - reactFlowBounds.top,
      };

      const dataTransfer = event.dataTransfer.getData('application/reactflow');

      if (dataTransfer) {
        const { item }: {
          item: Node
        } = JSON.parse(dataTransfer);
        const newNodeId = `node-${nodes.length + 1}`;
        console.log("item : ", item)
        const newNode = {
          id: newNodeId,
          type: item.type,
          position,
          data: { label: item.data.label },
        };

        // Use the nodestore method to add node
        setNodes([
          ...nodes.filter(n => n.id !== 'add'), 
          newNode
        ]);

        // Update edges
        const lastNodeId = nodes[nodes.length - 2].id;
        setEdges([
          ...edges.filter(e => e.target !== 'add'),
          {
            id: `${lastNodeId}-${newNodeId}`,
            source: lastNodeId,
            target: newNodeId,
            type: 'smoothstep',
          },
          {
            id: `${newNodeId}-add`,
            source: newNodeId,
            target: 'add',
            type: 'smoothstep',
          },
        ]);
      }
    },
    [nodes, edges, setNodes, setEdges]
  );

  return (
    <>
      <div className="h-full w-full bg-gray-50 dark:bg-gray-900">
        <div className="h-full w-full border border-dashed border-gray-300 dark:border-gray-700 relative">
          <div className="absolute inset-0 dark:text-black">
            <ReactFlowProvider>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onDragOver={onDragOver}
                onDrop={onDrop}
                nodeTypes={nodeTypes}
                fitView
                panOnScroll={true}
                selectionOnDrag={true}
                minZoom={1} // Minimum zoom level
                maxZoom={1.5} // Maximum zoom level
              >
                <CustomControls />
                <Background gap={12} size={1} />
              </ReactFlow>
            </ReactFlowProvider>
          </div>
        </div>
      </div>
    </>
  );
};

export default StrategyCanvas;