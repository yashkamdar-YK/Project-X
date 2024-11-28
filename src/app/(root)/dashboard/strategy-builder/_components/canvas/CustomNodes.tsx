import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { PlayCircle, Settings2, Zap, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNodeStore } from '@/lib/store/nodeStore';

interface NodeData {
  label: string;
  category?: string;
  isRunning?: boolean;
  onAddNode?: (item: string, category: string) => void;
}

export const StartNode = ({ data }: { data: NodeData }) => {
  return (
    <div className="relative group">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer">
        <PlayCircle className="w-7 h-7 text-white transform group-hover:scale-110 transition-transform duration-200" />
      </div>
      <Handle 
        type="source" 
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-500 border-2 border-white" 
      />
    </div>
  );
};

export const ConditionNode = ({ data, id }: { data: NodeData; id: string }) => {
  const { nodes, edges } = useNodeStore();
  const isLastConditionNode = React.useMemo(() => {
    const conditionNodes = nodes.filter(node => node.type === 'CONDITION');
    return id === conditionNodes[conditionNodes.length - 1]?.id;
  }, [nodes, id]);

  return (
    <div className="group cursor-pointer">
      <div className="relative bg-white dark:bg-gray-800 border-2 border-indigo-200 dark:border-indigo-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 min-w-[250px]">
        {/* Decorative elements */}
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-indigo-500 rounded-full" />
        
        <Handle 
          type="target" 
          position={Position.Top}
          className="w-3 h-3 bg-indigo-500 border-2 border-white" 
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
              {data.label}
            </div>
          </div>
          <Settings2 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>

        <Handle 
          type="source" 
          position={Position.Bottom}
          className="w-3 h-3 bg-indigo-500 border-2 border-white" 
          isConnectableStart={!isLastConditionNode}  // Disable connecting from this handle if it's not the last node
        />
      </div>
    </div>
  );
};

export const ActionNode = ({ data }: { data: NodeData }) => {
  return (
    <div className="group cursor-pointer">
      <div className="relative bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 min-w-[250px]">
        {/* Decorative elements */}
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-emerald-500 rounded-full" />
        
        <Handle 
          type="target" 
          position={Position.Top}
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
              {data.label}
            </div>
          </div>
          <Settings2 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>
      </div>
    </div>
  );
};