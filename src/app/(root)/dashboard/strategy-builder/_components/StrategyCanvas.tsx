import React, { useCallback, useState, useEffect } from "react";
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
import { StartNode, ConditionNode, ActionNode } from "./canvas/CustomNodes";
import CustomControls from "./canvas/customeControl";
import { useSheetStore } from "@/lib/store/SheetStore"; // Import the store
import { useNodeStore } from "@/lib/store/nodeStore"; // Import the new NodeStore
import { handleDrop, NodeTypes } from "../_utils/nodeTypes";
import ConditionEdge from "./canvas/ConditionEdge";
import ActionEdge from "./canvas/ActionEdge";

// Define node types mapping
const nodeTypes = {
  [NodeTypes.START]: StartNode,
  [NodeTypes.CONDITION]: ConditionNode,
  [NodeTypes.ACTION]: ActionNode,
};

const edgeTypes = {
  conditionEdge: ConditionEdge,
  actionEdge: ActionEdge
};

const StrategyCanvas = () => {
  const { nodes, edges, setNodes, setEdges } = useNodeStore();
  const { openSheet } = useSheetStore();

  // Undo/Redo state management
  const [history, setHistory] = useState([{ nodes, edges }]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to save the current state
  const saveState = useCallback(
    (newNodes: any, newEdges: any) => {
      const newHistory = history.slice(0, currentIndex + 1); // Clear forward history
      newHistory.push({ nodes: newNodes, edges: newEdges });
      setHistory(newHistory);
      setCurrentIndex(newHistory.length - 1);
    },
    [history, currentIndex]
  );

  // Undo functionality
  const undo = useCallback(() => {
    if (currentIndex > 0) {
      const previousState = history[currentIndex - 1];
      setNodes(previousState.nodes);
      setEdges(previousState.edges);
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex, history, setNodes, setEdges]);

  // Redo functionality
  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      const nextState = history[currentIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, history, setNodes, setEdges]);

  // Handle nodes changes
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const updatedNodes = applyNodeChanges(changes, nodes);
      setNodes(updatedNodes);
      saveState(updatedNodes, edges);
    },
    [nodes, edges, setNodes, saveState]
  );

  // Handle edges changes
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const updatedEdges = applyEdgeChanges(changes, edges);
      setEdges(updatedEdges);
      saveState(nodes, updatedEdges);
    },
    [nodes, edges, setEdges, saveState]
  );

  const onConnect = useCallback(
  (connection: Connection) => {
    const sourceNode = nodes.find((node) => node.id === connection.source);
    const targetNode = nodes.find((node) => node.id === connection.target);

    // For Condition to Condition connections
    if (
      sourceNode?.type === NodeTypes.CONDITION &&
      targetNode?.type === NodeTypes.CONDITION &&
      connection.sourceHandle?.endsWith("-bottom") &&
      connection.targetHandle?.endsWith("-top")
    ) {
      const updatedEdges = addEdge({ ...connection, type: 'conditionEdge' }, edges);
      setEdges(updatedEdges);
      saveState(nodes, updatedEdges);
    }
    // For Condition to Action connections using right handle
    else if (
      sourceNode?.type === NodeTypes.CONDITION &&
      connection.sourceHandle?.endsWith("-right") &&
      targetNode?.type === NodeTypes.ACTION
    ) {
      const updatedEdges = addEdge({ ...connection, type: 'actionEdge' }, edges);
      setEdges(updatedEdges);
      saveState(nodes, updatedEdges);
    }
    // Reject other connections
    else {
      console.warn("Invalid connection");
    }
  },
  [nodes, edges, setEdges, saveState]
);
  
  // Handle node click
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.stopPropagation();
      openSheet("node", node);
    },
    [openSheet]
  );

  // Handle drag over
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Handle node drop
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const dataTransfer = event.dataTransfer.getData("application/reactflow");
      if (dataTransfer) {
        const { item }: { item: Node } = JSON.parse(dataTransfer);
        const { newNode, newEdges } = handleDrop(
          event,
          nodes,
          edges,
          item,
          event.currentTarget.getBoundingClientRect()
        );
        const updatedNodes = [...nodes.filter((n) => n.id !== "add"), newNode];
        setNodes(updatedNodes);
        setEdges(newEdges);
        saveState(updatedNodes, newEdges);
      }
    },
    [nodes, edges, setNodes, setEdges, saveState]
  );

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "z") {
        undo();
      } else if (event.ctrlKey && event.key === "y") {
        redo();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [undo, redo]);

  return (
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
              edgeTypes={edgeTypes}
              panOnScroll={true}
              selectionOnDrag={true}
              minZoom={0.5}
              maxZoom={2}
            >
              <CustomControls />
              <Background gap={12} size={1} />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </div>
    </div>
  );
};

export default StrategyCanvas;
