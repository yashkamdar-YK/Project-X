import React from 'react';
import { getBezierPath, EdgeProps } from '@xyflow/react';
import { Plus } from 'lucide-react';
import { useNodeStore } from '@/lib/store/nodeStore';
import { NodeTypes } from '../../_utils/nodeTypes';

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  source,
  target,
  style = {}
}: EdgeProps) => {
  const [edgePath, centerX, centerY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const { nodes, edges, setNodes, setEdges } = useNodeStore();

  const handleAddNode = () => {
    const newNodeId = `node-${nodes.length + 1}`;
    const newNode = {
      id: newNodeId,
      type: NodeTypes.CONDITION,
      position: { x: centerX - 125, y: centerY - 25 }, // Adjust position to center the node
      data: { label: 'New Condition' },
    };

    // Remove the original edge
    const updatedEdges = edges.filter(edge => edge.id !== id);

    // Add two new edges connecting the new node
    const newEdges = [
      {
        id: `${source}-${newNodeId}`,
        source: source,
        target: newNodeId,
        type: 'smoothstep',
      },
      {
        id: `${newNodeId}-${target}`,
        source: newNodeId,
        target: target,
        type: 'smoothstep',
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
        className="react-flow__edge-path stroke-gray-300 dark:stroke-gray-600"
        d={edgePath}
      />
      {/* Add button in the middle of the edge */}
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

export default CustomEdge;