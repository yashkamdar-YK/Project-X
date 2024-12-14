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
import {
  StartNode,
  ConditionNode,
  ActionNode,
} from "./CanvasComponents/CustomNodes";
import CustomControls from "./CanvasComponents/customeControl";
import { useSheetStore } from "@/lib/store/SheetStore";
import { useNodeStore } from "@/lib/store/nodeStore";
import { handleDrop, NodeTypes } from "../_utils/nodeTypes";
import ConditionEdge from "./CanvasComponents/ConditionEdge";
import ActionEdge from "./CanvasComponents/ActionEdge";

import { debounce } from "lodash";
import { createContext, useContext } from "react";
import { handleNodeDeletion, handleOnConnection } from "../_utils/nodeHandling";

// Create a context for deletion
const CanvasContext = createContext<{
  deleteNode: (id: string) => void;
} | null>(null);

// Define node types mapping
const nodeTypes = {
  [NodeTypes.START]: StartNode,
  [NodeTypes.CONDITION]: ConditionNode,
  [NodeTypes.ACTION]: ActionNode,
};

const edgeTypes = {
  conditionEdge: ConditionEdge,
  actionEdge: ActionEdge,
};

const StrategyCanvas = () => {
  const { nodes, edges, setNodes, setEdges } = useNodeStore();
  const { openSheet } = useSheetStore();

  // State for history and current index
  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>([
    { nodes: [], edges: [] },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);

  // For knowing node for delete based on id
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Debounced state save function
  const debouncedSaveState = useCallback(
    debounce((newNodes: Node[], newEdges: Edge[]) => {
      setHistory((prevHistory) => {
        // Trim history to current index
        const trimmedHistory = prevHistory.slice(0, currentIndex + 1);

        // Check if the new state is different from the last state
        const lastState = trimmedHistory[trimmedHistory.length - 1];
        const isNewStateDifferent =
          !lastState ||
          JSON.stringify(newNodes) !== JSON.stringify(lastState.nodes) ||
          JSON.stringify(newEdges) !== JSON.stringify(lastState.edges);

        // Only add new state if it's meaningfully different
        if (isNewStateDifferent) {
          const newHistory = [
            ...trimmedHistory,
            { nodes: newNodes, edges: newEdges },
          ];

          // Limit history to last 50 states
          return newHistory.slice(-50);
        }

        return trimmedHistory;
      });

      // Update current index
      setCurrentIndex((prevIndex) => {
        const newIndex = Math.min(prevIndex + 1, 49);
        return newIndex;
      });
    }, 150), // 150ms debounce time
    [currentIndex]
  );

  // Function to save the current state
  const saveState = useCallback(
    (newNodes: Node[], newEdges: Edge[]) => {
      // Only trigger debounced save if state has changed
      const lastState = history[currentIndex];
      if (
        !lastState ||
        JSON.stringify(newNodes) !== JSON.stringify(lastState.nodes) ||
        JSON.stringify(newEdges) !== JSON.stringify(lastState.edges)
      ) {
        debouncedSaveState(newNodes, newEdges);
      }
    },
    [debouncedSaveState, history, currentIndex]
  );

  // Undo functionality
  const undo = useCallback(() => {
    if (currentIndex > 0) {
      const previousIndex = currentIndex - 1;
      const previousState = history[previousIndex];

      // Ensure at least the start node always exists
      const startNode = previousState.nodes.find((node) => node.id === "start");
      if (!startNode) {
        // If no start node, keep the current state
        return;
      }

      setNodes(previousState.nodes);
      setEdges(previousState.edges);
      setCurrentIndex(previousIndex);
    }
  }, [currentIndex, history, setNodes, setEdges]);

  // Redo functionality
  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextState = history[nextIndex];

      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setCurrentIndex(nextIndex);
    }
  }, [currentIndex, history, setNodes, setEdges]);

  // Automatically save state when nodes or edges change
  useEffect(() => {
    saveState(nodes, edges);
  }, [nodes, edges, saveState]);

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

  //On connection Function
  const onConnect = useCallback(
    (connection: Connection) => {
      handleOnConnection(connection, nodes, edges, setEdges, saveState);
    },
    [nodes, edges, setEdges, saveState]
  );

  // OnNodeClick Function
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.stopPropagation();
      setSelectedNodeId(node.id); // Set the selected node ID
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
      // Undo (Ctrl+Z or Cmd+Z)
      if (event.ctrlKey && event.key === "z") {
        event.preventDefault();
        undo();
      }
      // Redo (Ctrl+Shift+Z or Cmd+Shift+Z or Ctrl+Y)
      else if (
        (event.ctrlKey && event.shiftKey && event.key === "Z") ||
        (event.ctrlKey && event.shiftKey && event.key === "z")
      ) {
        event.preventDefault();
        redo();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [undo, redo]);

  // Handle keydown for delete functionality
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Delete key
      if (event.key === "Delete" && selectedNodeId) {
        deleteNode(selectedNodeId); // Call delete function for the selected node
        setSelectedNodeId(null); // Reset selected node
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedNodeId]);

  const deleteNode = (id: string) => {
    const nodeToDelete = nodes.find((node) => node.id === id);
    if (nodeToDelete) {
      handleNodeDeletion([nodeToDelete], nodes, edges, setNodes, setEdges);
    }
  };

  return (
    <div className="h-full w-full bg-gray-50 dark:bg-gray-900">
      <div className="h-full w-full border border-dashed border-gray-300 dark:border-gray-700 relative">
        <div className="absolute inset-0 dark:text-black">
          {/* Wrap deleteNode in React Provider */}
          <CanvasContext.Provider value={{ deleteNode }}>
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
                onNodesDelete={(nodesToDelete) =>
                  handleNodeDeletion(
                    nodesToDelete,
                    nodes,
                    edges,
                    setNodes,
                    setEdges
                  )
                }
              >
                <CustomControls onUndo={undo} onRedo={redo} />
                <Background gap={12} size={1} />
              </ReactFlow>
            </ReactFlowProvider>
          </CanvasContext.Provider>
        </div>
      </div>
    </div>
  );
};

export default StrategyCanvas;

//Export handleNodeDeletion to use in CustomeNode.tsx
export const useCanvasContext = () => useContext(CanvasContext);
