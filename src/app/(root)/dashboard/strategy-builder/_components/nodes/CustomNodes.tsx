import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { PlayCircle, PauseCircle, Plus } from 'lucide-react';

interface NodeData {
  label: string;
  category?: string;
  isRunning?: boolean;
}

export const StartNode = ({ data }: { data: NodeData }) => {
  return (
    <div className="relative">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer">
        {data.isRunning ? (
          <PauseCircle className="w-6 h-6 text-white" />
        ) : (
          <PlayCircle className="w-6 h-6 text-white" />
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export const AddNode = () => {
  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} />
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer">
        <Plus className="w-6 h-6 text-white" />
      </div>
    </div>
  );
};

export const ConditionNode = ({ data }: { data: NodeData }) => {
  return (
    <div className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 min-w-[200px]">
      <Handle type="target" position={Position.Top} />
      <div className="mb-2 text-xs text-gray-500 dark:text-gray-400 uppercase">
        {data.category}
      </div>
      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {data.label}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export const ActionNode = ({ data }: { data: NodeData }) => {
  return (
    <div className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 min-w-[200px]">
      <Handle type="target" position={Position.Top} />
      <div className="mb-2 text-xs text-gray-500 dark:text-gray-400 uppercase">
        {data.category}
      </div>
      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {data.label}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};