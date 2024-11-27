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
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { StartNode, AddNode, ConditionNode, ActionNode } from './canvas/CustomNodes';
import CustomControls from "./canvas/customeControl";
import { useSheetStore } from "@/lib/store/SheetStore"; // Import the store
import { TNode } from "../types/nodeTypes";



// Define node types mapping
const nodeTypes = {
  startNode: StartNode,
  addNode: AddNode,
  conditionNode: ConditionNode,
  actionNode: ActionNode,
};

const INITIAL_NODES: Node[] = [
  {
    id: 'start',
    type: 'startNode',
    position: { x: 350, y: 20 },
    data: { label: 'Start', isRunning: false },
  },
  {
    id: 'entry-1',
    type: 'conditionNode',
    position: { x: 300, y: 120 },
    data: { 
      label: 'Supertrend HA condition',
      category: 'Entry Condition'
    },
  },
  {
    id: 'add',
    type: 'addNode',
    position: { x: 350, y: 250 },
    data: { label: 'Add', onAddNode: () => {} },
  },
];

const INITIAL_EDGES: Edge[] = [
  {
    id: 'start-entry',
    source: 'start',
    target: 'entry-1',
    type: 'smoothstep',
  },
  {
    id: 'entry-add',
    source: 'entry-1',
    target: 'add',
    type: 'smoothstep',
  },
];

const StrategyCanvas = () => {
  // State for nodes and edges
  const [nodes, setNodes] = useNodesState(INITIAL_NODES);
  const [edges, setEdges] = useEdgesState(INITIAL_EDGES);

  const { openSheet } = useSheetStore();
  
  // State for selected node

  // Handle nodes changes
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  // Handle edges changes
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  // Handle new connections
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  // Handle node click
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.stopPropagation(); // Prevent event bubbling

        openSheet('node', node); // Pass the type as 'node' and the clicked node as selectedItem
    },
    [nodes, edges, setNodes, setEdges, openSheet]
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
        const { item }:{
          item:TNode
        } = JSON.parse(dataTransfer);
        const newNodeId = `node-${nodes.length + 1}`;
        
        const newNode = {
          id: newNodeId,
          type: item.type,
          position,
          data: { label: item.data.label },
        };

        setNodes([...nodes.filter(n => n.id !== 'add'), newNode, nodes.find(n => n.id === 'add')!]);
        
        // Update edges to maintain flow
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
              // onPaneClick={onPaneClick}
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