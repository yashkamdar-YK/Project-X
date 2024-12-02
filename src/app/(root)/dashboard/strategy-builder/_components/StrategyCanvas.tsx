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
import { StartNode, ConditionNode, ActionNode } from "./canvas/CustomNodes";
import CustomControls from "./canvas/customeControl";
import { useSheetStore } from "@/lib/store/SheetStore"; // Import the store
import { useNodeStore } from "@/lib/store/nodeStore"; // Import the new NodeStore
import { handleDrop, NodeTypes } from "../_utils/nodeTypes";
import ConditionEdge from "./canvas/conditionEdge";
import ActionEdge from "./canvas/ActionEdge";

// Define node types mapping
const nodeTypes = {
  [NodeTypes.START]: StartNode,
  [NodeTypes.CONDITION]: ConditionNode,
  [NodeTypes.ACTION]: ActionNode,
};

const edgeTypes = {
  smoothstep: ConditionEdge,
  actionEdge: ActionEdge
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
        setEdges(addEdge({ ...connection, type: 'smoothstep' }, edges));
      }
      // For Condition to Action connections using right handle
      else if (
        sourceNode?.type === NodeTypes.CONDITION &&
        connection.sourceHandle?.endsWith("-right") &&
        targetNode?.type === NodeTypes.ACTION
      ) {
        setEdges(addEdge({ ...connection, type: 'actionEdge' }, edges));
      }
      // Reject other connections
      else {
        console.warn("Invalid connection");
      }
    },
    [nodes, edges, setEdges]
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

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const dataTransfer = event.dataTransfer.getData("application/reactflow");
      // console.log("Drop Data:", dataTransfer);
      if (dataTransfer) {
        const { item }: { item: Node } = JSON.parse(dataTransfer);
        // console.log("Parsed Item:", item);
        const { newNode, newEdges } = handleDrop(
          event,
          nodes,
          edges,
          item,
          event.currentTarget.getBoundingClientRect()
        );
        setNodes([...nodes.filter((n) => n.id !== "add"), newNode]);
        setEdges(newEdges);
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
                edgeTypes={edgeTypes}
                // fitView
                panOnScroll={true}
                selectionOnDrag={true}
                minZoom={0.5} // Minimum zoom level
                maxZoom={2} // Maximum zoom level
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
