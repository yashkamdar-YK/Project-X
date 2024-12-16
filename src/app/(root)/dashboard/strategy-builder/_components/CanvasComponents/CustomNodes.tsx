import React from "react";
import { Position } from "@xyflow/react";
import {
  PlayCircle,
  Settings2,
  Zap,
  AlertCircle,
  Trash2,
  ChevronUp,
  ChevronDown,
  Copy,
} from "lucide-react";
import { useNodeStore } from "@/lib/store/nodeStore";
import CustomHandle from "./CustomHandle";
import { useActionStore } from "@/lib/store/actionStore";
import { useConditionStore } from "@/lib/store/conditionStore";
import { handleAddNode, NodeTypes } from "../../_utils/nodeTypes";
import { handleNodeDeletion } from "../../_utils/nodeHandling";

export const StartNode = () => {
  return (
    <div className="relative group">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer">
        <PlayCircle className="w-7 h-7 text-white transform group-hover:scale-110 transition-transform duration-200" />
      </div>
      <CustomHandle
        type="source"
        position={Position.Bottom}
        id="start-bottom"
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
    </div>
  );
};

export const ConditionNode = ({ data, id }: { data: Node; id: string }) => {
  const { nodes, edges, setNodes, setEdges } = useNodeStore();
  const { conditionBlocks } = useConditionStore();
  const conditionNodes = React.useMemo(() => {
    return nodes
      .filter((node) => node.type === "CONDITION")
      .sort((a, b) => a.position.y - b.position.y);
  }, [nodes]);

  const nodeIndex = React.useMemo(() => {
    return conditionNodes.findIndex((node) => node.id === id);
  }, [conditionNodes, id]);

  const isFirstConditionNode = nodeIndex === 0;
  const isLastConditionNode = nodeIndex === conditionNodes.length - 1;
  const currentNode = conditionBlocks[id];

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    const nodeToDelete = nodes.find((node) => node.id === id);
    if (nodeToDelete) {
      handleNodeDeletion([nodeToDelete], nodes, edges, setNodes, setEdges);
    }
  };

  /**
   * Handles the swapping of condition nodes when clicking up/down arrows
   * @param direction - The direction to swap ('up' or 'down')
   * @returns Event handler function for the swap
   */
  const handleNodeSwap =
    (direction: "up" | "down") => (event: React.MouseEvent) => {
      // Prevent event bubbling
      event.stopPropagation();

      // Get the nodes to swap
      const sourceConditionNode = conditionNodes[nodeIndex];
      const targetIndex = direction === "up" ? nodeIndex - 1 : nodeIndex + 1;
      const targetConditionNode = conditionNodes[targetIndex];

      // Exit if no valid target node to swap with
      if (!targetConditionNode) return;

      // Store the original positions of both nodes
      const sourceNodePosition = { ...sourceConditionNode.position };
      const targetNodePosition = { ...targetConditionNode.position };

      // Create new nodes array with swapped positions
      const nodesWithSwappedPositions = nodes.map((node) => {
        if (node.id === sourceConditionNode.id) {
          return { ...node, position: targetNodePosition };
        }
        if (node.id === targetConditionNode.id) {
          return { ...node, position: sourceNodePosition };
        }
        return node;
      });

      // Update edge connections while preserving action node relationships
      const updatedEdgeConnections = edges.map((edge) => {
        const newEdgeConnection = { ...edge };

        // Skip action node connections (from right handle) to maintain their relationships
        // Only update vertical connections between condition nodes
        const isVerticalConnection = !edge.sourceHandle?.includes("right");

        if (isVerticalConnection) {
          // Update source connections
          if (edge.source === sourceConditionNode.id) {
            newEdgeConnection.source = targetConditionNode.id;
            if (edge.sourceHandle) {
              // Preserve handle type (top/bottom) while updating node reference
              const handleDirection = edge.sourceHandle.split("-").pop();
              newEdgeConnection.sourceHandle = `${targetConditionNode.id}-${handleDirection}`;
            }
          } else if (edge.source === targetConditionNode.id) {
            newEdgeConnection.source = sourceConditionNode.id;
            if (edge.sourceHandle) {
              const handleDirection = edge.sourceHandle.split("-").pop();
              newEdgeConnection.sourceHandle = `${sourceConditionNode.id}-${handleDirection}`;
            }
          }

          // Update target connections
          if (edge.target === sourceConditionNode.id) {
            newEdgeConnection.target = targetConditionNode.id;
            if (edge.targetHandle) {
              const handleDirection = edge.targetHandle.split("-").pop();
              newEdgeConnection.targetHandle = `${targetConditionNode.id}-${handleDirection}`;
            }
          } else if (edge.target === targetConditionNode.id) {
            newEdgeConnection.target = sourceConditionNode.id;
            if (edge.targetHandle) {
              const handleDirection = edge.targetHandle.split("-").pop();
              newEdgeConnection.targetHandle = `${sourceConditionNode.id}-${handleDirection}`;
            }
          }
        }

        return newEdgeConnection;
      });

      // Update the state with new node positions and edge connections
      setNodes(nodesWithSwappedPositions);
      setEdges(updatedEdgeConnections);
    };

  return (
    <div className="group cursor-pointer">
      <div className="relative bg-white dark:bg-gray-800 border-2 border-indigo-200 dark:border-indigo-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 min-w-[250px]">
        <div className="absolute right-[23px] top-1/2 -translate-y-1/2 flex flex-col gap-3 ">

          <div className="opacity-0 group-hover:opacity-100">
            <button
              onClick={handleDelete}
              className="p-1.5 bg-red-500 rounded-full  absolute text-white hover:bg-red-600 bottom-6 left-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="lg:opacity-0 opacity-100 group-hover:opacity-100">
            {!isFirstConditionNode && (
              <button
                onClick={handleNodeSwap("up")}
                className="p-1.5 hover:bg-gray-300 hover:dark:bg-gray-700 rounded-full text-white absolute bottom-1 left-1/2 -translate-x-2/3"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
            )}

            {!isLastConditionNode && (
              <button
                onClick={handleNodeSwap("down")}
                className="p-1.5 rounded-full text-white hover:bg-gray-300 hover:dark:bg-gray-700 absolute top-1 left-1/2 -translate-x-2/3"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-indigo-500 rounded-full" />

        <CustomHandle type="target" position={Position.Top} id={`${id}-top`} />

        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider mb-1">
              Condition
            </div>
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {/* @ts-ignore */}
              {currentNode?.name || data.label}
            </div>
          </div>
        </div>

        <div className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1">
          <CustomHandle
            type="source"
            position={Position.Right}
            id={`${id}-right`}
            className="!flex items-center justify-center !w-6 !h-6 !bg-green-700 !border-none !cursor-cell !z-10"
          >
            <Zap className="!w-4 !h-5 text-white pointer-events-none" />
          </CustomHandle>
        </div>

        <CustomHandle
          type="source"
          position={Position.Bottom}
          id={`${id}-bottom`}
        />
      </div>
    </div>
  );
};


export const ActionNode = ({ data, id }: { data: Node; id: string }) => {
  const { nodes, edges, setNodes, setEdges } = useNodeStore();
  const {actionNodes} = useActionStore();
  const currentActionNode = actionNodes[id];

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    const nodeToDelete = nodes.find((node) => node.id === id);
    if (nodeToDelete) {
      handleNodeDeletion([nodeToDelete], nodes, edges, setNodes, setEdges);
    }
  };

  const handleCopyActionNode = (event: React.MouseEvent, nodeId: string)=>{
    event.stopPropagation();
    //@ts-ignore
    const { newEdges, newNode } = handleAddNode(nodes, edges, {
      type: NodeTypes.ACTION,
    //@ts-ignore
    isCopy: true, // Add a flag to indicate copying,
    //@ts-ignore
      label: data?.label
    });
    setNodes([...nodes, newNode]);
    setEdges(newEdges);
  }

  return (
    <div className="group cursor-pointer">
      <div className="relative bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 min-w-[250px]">

      {/* Copy button */}
      <button
          // @ts-ignore
          onClick={handleCopyActionNode}
          className="absolute right-6 -top-2 p-1.5 bg-emerald-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-emerald-600"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="absolute -right-2 -top-2 p-1.5 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        {/* Decorative elements */}
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-emerald-500 rounded-full" />

        <CustomHandle
          type="target"
          position={Position.Left}
          className="!w-3 !h-3 md:!w-[10px] md:!h-[10px] sm:!w-4 sm:!h-4 !bg-green-600 !border-1 !border-indigo-600"
        />

        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <Zap className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-semibold text-emerald-500 dark:text-emerald-400 uppercase tracking-wider mb-1">
              Action
            </div>
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {/* @ts-ignore */}
              {currentActionNode?.nodeName || data.label}
            </div>
          </div>
          <Settings2 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>
      </div>
    </div>
  );
};
