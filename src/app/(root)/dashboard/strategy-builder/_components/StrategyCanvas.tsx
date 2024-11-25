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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
// import { useNodeStore } from "./store/CanvasNode";
import NodeSheet from "./StrategyNavbar/NodeSheet";

// Define the type for your node data
type NodeData = {
  label: string;
};

// Define the custom node type
type CustomNode = Node<NodeData>;


const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const StrategyCanvas = () => {
  // State to manage selected node and sidebar visibility
  const [selectedNode, setSelectedNode] = useState<CustomNode | null>(null);
  const [isNodeSidebarOpen, setIsNodeSidebarOpen] = useState(false);

  //Initial Nodes And Edges
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);

  const onNodesChange = useCallback(
    (
      changes: NodeChange<{
        id: string;
        position: { x: number; y: number };
        data: { label: string };
      }>[]
    ) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange<{ id: string; source: string; target: string }>[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  // const nodes = useNodeStore((state) => state.nodes);
  // const edges = useNodeStore((state) => state.edges);
  // const setNodes = useNodeStore((state) => state.setNodes);
  // const setEdges = useNodeStore((state) => state.setEdges);

  // const onNodesChange = useCallback(
  //   (changes: NodeChange[]) => {
  //     setNodes(applyNodeChanges(changes, nodes));
  //   },
  //   [nodes, setNodes]
  // );

  // const onEdgesChange = useCallback(
  //   (changes: EdgeChange[]) => {
  //     setEdges(applyEdgeChanges(changes, edges));
  //   },
  //   [edges, setEdges]
  // );

  // const onConnect = useCallback(
  //   (connection: Connection) => {
  //     const newEdges = addEdge(connection, edges);
  //     setEdges(newEdges);
  //   },
  //   [edges, setEdges]
  // );

  // Handle node click with proper typing
  const onNodeClick = useCallback((event: React.MouseEvent, clickedNode: CustomNode) => {
    setSelectedNode(clickedNode);
    setIsNodeSidebarOpen(true);
  }, []);

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
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              fitView
            >
              <Controls className="dark:text-black" />
              <MiniMap zoomable pannable />
              <Background gap={12} size={1} />
            </ReactFlow>
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
