import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { PlayCircle, PauseCircle, Plus } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface NodeData {
  label: string;
  category?: string;
  isRunning?: boolean;
  onAddNode?: (item: string, category: string) => void;
}

export const StartNode = ({ data }: { data: NodeData }) => {
  return (
    <div className="relative">
      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer">
          <PlayCircle className="w-6 h-6 text-white" />
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};


export const AddNode = ({ data }: { data: NodeData }) => {
  const [isOpen, setIsOpen] = useState(false);

  const components = [
    {
      category: "Entry",
      items: ["Entry Condition", "Entry into ATM"]
    },
    {
      category: "Exit",
      items: ["Exit Condition", "Square off All"]
    }
  ];

  const handleSelect = (item: string, category: string) => {
    if (data.onAddNode) {
      data.onAddNode(item, category);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} />
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer">
            <Plus className={cn(
              "w-6 h-6 text-white transition-transform duration-200",
              isOpen && "rotate-45"
            )} />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          className="w-64 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          {components.map((section, index) => (
            <DropdownMenuGroup key={index}>
              <div className="px-2 py-1.5 text-sm font-semibold text-gray-500 dark:text-gray-400">
                {section.category}
              </div>
              {section.items.map((item, itemIndex) => (
                <DropdownMenuItem
                  key={itemIndex}
                  className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  onClick={() => handleSelect(item, section.category)}
                >
                  {item}
                </DropdownMenuItem>
              ))}
              {index < components.length - 1 && (
                <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
              )}
            </DropdownMenuGroup>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
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