import React from 'react';
import { Position } from '@xyflow/react';
import { PlayCircle, Settings2, Zap, AlertCircle, Trash2, ChevronUp, ChevronDown, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNodeStore } from '@/lib/store/nodeStore';
import CustomHandle from './CustomHandle';


export const StartNode = () => {
  return (
    <div className="relative group">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer">
        <PlayCircle className="w-7 h-7 text-white transform group-hover:scale-110 transition-transform duration-200" />
      </div>
      <CustomHandle 
        type="source" 
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-500 border-2 border-white" 
      />
    </div>
  );
};

export const ConditionNode = ({ data, id }: { data: Node, id: string }) => {
  const { nodes, edges, setNodes, setEdges } = useNodeStore();
  
  const conditionNodes = React.useMemo(() => {
    return nodes
      .filter(node => node.type === 'CONDITION')
      .sort((a, b) => a.position.y - b.position.y);
  }, [nodes]);

  const nodeIndex = React.useMemo(() => {
    return conditionNodes.findIndex(node => node.id === id);
  }, [conditionNodes, id]);

  const isFirstConditionNode = nodeIndex === 0;
  const isLastConditionNode = nodeIndex === conditionNodes.length - 1;

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();

    // Find incoming and outgoing edges for the node being deleted
    const incomingEdge = edges.find(edge => edge.target === id);
    const outgoingEdge = edges.find(edge => edge.source === id);

    let updatedEdges = edges.filter(edge => edge.source !== id && edge.target !== id);

    // If node had both incoming and outgoing connections, create a new edge to bridge the gap
    if (incomingEdge && outgoingEdge) {
      // Get source node type to determine correct handle
      const sourceNode = nodes.find(node => node.id === incomingEdge.source);
      const sourceHandle = sourceNode?.type === 'CONDITION' ? `${incomingEdge.source}-bottom` : undefined;
      
      const newEdge = {
        id: `${incomingEdge.source}-${outgoingEdge.target}`,
        source: incomingEdge.source,
        target: outgoingEdge.target,
        sourceHandle, // Use bottom handle for condition nodes
        targetHandle: outgoingEdge.targetHandle, // Preserve target handle
        type: 'smoothstep'
      };
      updatedEdges = [...updatedEdges, newEdge];
    }

    setEdges(updatedEdges);
    setNodes(nodes.filter(node => node.id !== id));
  };


  //basicly here we are switching the nodes position
  const switchNodes = (direction: 'up' | 'down') => (event: React.MouseEvent) => {
    event.stopPropagation();
    
    const currentNode = conditionNodes[nodeIndex];
    const switchIndex = direction === 'up' ? nodeIndex - 1 : nodeIndex + 1;
    const switchNode = conditionNodes[switchIndex];
    
    if (!switchNode) return;

    // Store positions
    const currentPos = { ...currentNode.position };
    const switchPos = { ...switchNode.position };

    // Update nodes with switched positions
    const updatedNodes = nodes.map(node => {
      if (node.id === currentNode.id) {
        return { ...node, position: switchPos };
      }
      if (node.id === switchNode.id) {
        return { ...node, position: currentPos };
      }
      return node;
    });

    // Update edges to maintain connections
    const updatedEdges = edges.map(edge => {
      let newEdge = { ...edge };
      
      // Update source connections
      if (edge.source === currentNode.id) newEdge.source = switchNode.id;
      else if (edge.source === switchNode.id) newEdge.source = currentNode.id;
      
      // Update target connections
      if (edge.target === currentNode.id) newEdge.target = switchNode.id;
      else if (edge.target === switchNode.id) newEdge.target = currentNode.id;
      
      return newEdge;
    });

    setNodes(updatedNodes);
    setEdges(updatedEdges);
  };

  return (
    <div className="group cursor-pointer">
      <div className="relative bg-white dark:bg-gray-800 border-2 border-indigo-200 dark:border-indigo-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 min-w-[250px]">
        {/* Control buttons */}
        <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {!isFirstConditionNode && (
            <button
              onClick={switchNodes('up')}
              className="p-1.5 bg-gray-500 rounded-full text-white hover:bg-gray-600"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleDelete}
            className="p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          
          {!isLastConditionNode && (
            <button
              onClick={switchNodes('down')}
              className="p-1.5 bg-gray-500 rounded-full text-white hover:bg-gray-600"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-indigo-500 rounded-full" />
        
        <CustomHandle 
          type="target" 
          position={Position.Top}
          className="w-3 h-3 bg-indigo-500 border-2 border-white" 
          id={`${id}-top`}
        />
        
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
              {data.label}
            </div>
          </div>
          <Settings2 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>

        {/* Right handle with icon */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1">
          <CustomHandle
            type="source"
            position={Position.Right}
            id={`${id}-right`}
            className="!flex items-center justify-center !w-6 !h-6 !bg-green-700 !border-none !cursor-cell !z-10"
          >
            <ArrowRight className="!w-5 !h-5 text-white pointer-events-none" />
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

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    setNodes(nodes.filter(node => node.id !== id));
    setEdges(edges.filter(edge => edge.source !== id && edge.target !== id));
  };

  return (
    <div className="group cursor-pointer">
      <div className="relative bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 min-w-[250px]">
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
          className="w-3 h-3 bg-emerald-500 border-2 border-white" 
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
              {data.label}
            </div>
          </div>
          <Settings2 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>
      </div>
    </div>
  );
};