import React from 'react';
import { getBezierPath, EdgeProps, Edge } from '@xyflow/react';
import { Plus } from 'lucide-react';
import { useNodeStore } from '@/lib/store/nodeStore';
import { getNodeId, NodeTypes } from '../../_utils/nodeTypes';

interface ConditionEdgeProps extends EdgeProps {
  sourceHandle?: string;
  targetHandle?: string;
}

const ConditionEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  source,
  target,
  sourceHandle,
  targetHandle,
  style = {}
}: ConditionEdgeProps) => {
  const [edgePath, centerX, centerY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetPosition,
    targetX,
    targetY,
  });

  const { nodes, edges, setNodes, setEdges } = useNodeStore();

  const handleAddNode = () => {
    const newNodeId = getNodeId({ type: NodeTypes.CONDITION });
    const sourceNode = nodes.find(node => node.id === source);
    
    const newNode = {
      id: newNodeId,
      type: NodeTypes.CONDITION,
      position: { x: centerX - 125, y: centerY - 25 },
      data: { label: 'New Condition' },
    };

    // Remove the original edge
    const updatedEdges = edges.filter(edge => edge.id !== id);

    // Create new edges with explicit handle connections
    const newEdges: Edge[] = [
      {
        id: `${source}-${newNodeId}`,
        source,
        target: newNodeId,
        targetHandle: `${newNodeId}-top`,
        // Always use bottom handle for source if it's a condition node
        sourceHandle: sourceNode?.type === NodeTypes.CONDITION ? `${source}-bottom` : undefined,
        type: 'conditionEdge',
      },
      {
        id: `${newNodeId}-${target}`,
        source: newNodeId,
        target,
        sourceHandle: `${newNodeId}-bottom`,
        // targetHandle to top targat point 
        targetHandle: targetHandle || `${target}-top`,
        type: 'conditionEdge',
      },
      ...updatedEdges,
    ];

    setNodes([...nodes, newNode]);
    setEdges(newEdges);
  };


  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path stroke-indigo-300 dark:stroke-indigo-600"
        d={edgePath}
      />
      <foreignObject
        width={24}
        height={24}
        x={centerX - 12}
        y={centerY - 12}
        className="overflow-visible"
      >
        <button
          className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 hover:border border-gray-300 text-white shadow-md transition-all duration-200 hover:scale-110"
          onClick={(e) => {
            e.stopPropagation();
            handleAddNode();
          }}
        >
          <Plus className="w-4 h-4 text-blue-500" />
        </button>
      </foreignObject>
    </>
  );
};

export default ConditionEdge;