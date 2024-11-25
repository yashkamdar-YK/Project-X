import React, { useCallback, useState } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Connection,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  Controls,
  MiniMap,
  Background,
  addEdge,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useNodeStore } from "./store/CanvasNode";
import NodeSheet from "./StrategyNavbar/NodeSheet";

const StrategyCanvas = () => {
  // State to manage selected node and sidebar visibility
  const [selectedNode, setSelectedNode] = useState<null>(null);
  const [isNodeSidebarOpen, setIsNodeSidebarOpen] = useState(false);

  const nodes = useNodeStore((state) => state.nodes);
  const edges = useNodeStore((state) => state.edges);
  const setNodes = useNodeStore((state) => state.setNodes);
  const setEdges = useNodeStore((state) => state.setEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes(applyNodeChanges(changes, nodes));
    },
    [nodes, setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges(applyEdgeChanges(changes, edges));
    },
    [edges, setEdges]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdges = addEdge(connection, edges);
      setEdges(newEdges);
    },
    [edges, setEdges]
  );

  // functions for drag and drop
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      // Get the position where the node was dropped
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      try {
        // Get the dragged data
        const data = JSON.parse(
          event.dataTransfer.getData("application/reactflow")
        );

        // Create and add the new node
        if (data.item && data.category) {
          const newNode: Node = {
            id: Date.now().toString(),
            position,
            data: {
              label: data.item,
              category: data.category,
            },
          };

          // setNodes((nds:) => [...nds, newNode]);
          useNodeStore.getState().addNode(data.item, data.category);
        }
      } catch (error) {
        console.error("Error adding node:", error);
      }
    },
    [setNodes]
  );

  // Handle node click with proper typing
  const onNodeClick = useCallback(
    (event: React.MouseEvent, clickedNode: any) => {
      setSelectedNode(clickedNode);
      setIsNodeSidebarOpen(true);
    },
    []
  );

  // Handle canvas click (background click)
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setIsNodeSidebarOpen(false);
  }, []);

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
              onPaneClick={onPaneClick}
              onDragOver={onDragOver}
              onDrop={onDrop}
              fitView
              panOnScroll={true}
              selectionOnDrag={true}
            >
              <Controls className="dark:text-black" />
              <MiniMap zoomable pannable />
              <Background gap={12} size={1} />
            </ReactFlow>
            </ReactFlowProvider>
          </div>
        </div>
      </div>
      <NodeSheet
        isOpen={isNodeSidebarOpen}
        onClose={() => setIsNodeSidebarOpen(false)}
        node={selectedNode}
      />
    </>
  );
};

export default StrategyCanvas;
