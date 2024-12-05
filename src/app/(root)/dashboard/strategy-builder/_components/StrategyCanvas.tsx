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
import { useSheetStore } from "@/lib/store/SheetStore"; 
import { useNodeStore } from "@/lib/store/nodeStore";
import { handleDrop, NodeTypes } from "../_utils/nodeTypes";
import ConditionEdge from "./canvas/ConditionEdge";
import ActionEdge from "./canvas/ActionEdge";

import { debounce } from "lodash";
import { createContext, useContext } from "react";

// Create a context for deletion
const CanvasContext = createContext<{ deleteNode: (id: string) => void } | null>(
  null
);


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

  // Undo/Redo state management with debounce
  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>(
    []
  );
  const [currentIndex, setCurrentIndex] = useState(-1);

  // initialize history with current state when component mount
  useEffect(() => {
    setHistory([{ nodes, edges }]);
    setCurrentIndex(0);
  }, []);

  // Debounced state save function
  const debouncedSaveState = useCallback(
    debounce((newNodes: Node[], newEdges: Edge[]) => {
      setHistory((prevHistory) => {
        const newHistory = prevHistory.slice(
          Math.max(0, prevHistory.length - 50),
          currentIndex + 1
        );
        newHistory.push({ nodes: newNodes, edges: newEdges });
        return newHistory;
      });
      setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, 49)); // Limit index
    }, 150),
    [currentIndex]
  );

  // Function to save the current state
  const saveState = useCallback(
    (newNodes: Node[], newEdges: Edge[]) => {
      // Only save state if nodes or edges have actually changed
      if (
        JSON.stringify(newNodes) !==
          JSON.stringify(history[currentIndex]?.nodes) ||
        JSON.stringify(newEdges) !==
          JSON.stringify(history[currentIndex]?.edges)
      ) {
        debouncedSaveState(newNodes, newEdges);
      }
    },
    [debouncedSaveState, history, currentIndex]
  );

  // Undo functionality
  const undo = useCallback(() => {
    if (currentIndex > 0 && history.length > 0) {
      const previousState = history[currentIndex - 1];
      if (previousState) {
        setNodes(previousState.nodes || []);
        setEdges(previousState.edges || []);
        setCurrentIndex((prevIndex) => prevIndex - 1);
      } else {
        console.warn("no previous state found in history");
      }
    }
  }, [currentIndex, history, setNodes, setEdges]);

  // Redo functionality
  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      const nextState = history[currentIndex + 1];
      // Add null checks and provide fallback
      if (nextState) {
        setNodes(nextState.nodes || []);
        setEdges(nextState.edges || []);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      } else {
        console.warn("no next state found in history");
      }
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
  

  //On connection Function
  const onConnect = useCallback(
    (connection: Connection) => {
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
    },
    [nodes, edges, setEdges, saveState]
  );


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
      } else if (
        (event.ctrlKey && event.shiftKey && event.key === "Z") ||
        (event.metaKey && event.shiftKey && event.key === "Z")
      ) {
        redo();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [undo, redo]);

  

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

  // handle connection of node After delete from default way
  const handleNodeDeletion = (
    nodesToDelete: Node[],
    allNodes: Node[],
    allEdges: Edge[],
    setNodes: Function,
    setEdges: Function
  ) => {
    let updatedEdges = [...allEdges];

    nodesToDelete.forEach((node) => {
      // Find all edges connected to this node
      const connectedEdges = allEdges.filter(
        (edge) => edge.source === node.id || edge.target === node.id
      );

      // Remove all edges connected to the deleted node
      updatedEdges = updatedEdges.filter(
        (edge) => edge.source !== node.id && edge.target !== node.id
      );

      // If the deleted node is a Condition node
      if (node.type === NodeTypes.CONDITION) {
        // Find the Action nodes originally connected to this Condition node
        const actionNodesConnected = allNodes.filter(
          (n) =>
            n.type === NodeTypes.ACTION &&
            connectedEdges.some(
              (edge) => edge.source === node.id && edge.target === n.id
            )
        );

        // For each connected Action node
        actionNodesConnected.forEach((actionNode) => {
          // Find edges connected to this specific Action node
          const actionNodeEdges = allEdges.filter(
            (edge) =>
              edge.source === actionNode.id || edge.target === actionNode.id
          );

          // Remove only the edges to the deleted Condition node
          const edgesToRemove = actionNodeEdges.filter(
            (edge) => edge.source === node.id || edge.target === node.id
          );

          // Remove these specific edges
          updatedEdges = updatedEdges.filter(
            (edge) =>
              !edgesToRemove.some((removeEdge) => removeEdge.id === edge.id)
          );
        });
      }
    });

    // Remove nodes from the state
    const remainingNodes = allNodes.filter(
      (node) => !nodesToDelete.some((n) => n.id === node.id)
    );

    // Automatically reconnect Start node if needed
    const finalEdges = handleStartNodeReconnection(
      remainingNodes,
      updatedEdges,
      setEdges
    );

    setNodes(remainingNodes);
    setEdges(finalEdges);
  };
 
  //Export Function
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