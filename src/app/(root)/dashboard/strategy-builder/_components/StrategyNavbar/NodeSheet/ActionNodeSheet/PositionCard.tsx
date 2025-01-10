import React from "react";
import { Button } from "@/components/ui/button";
import { X, ArrowUp, ArrowDown, Copy } from 'lucide-react';
import { Position, PositionSettings } from "./types";
import { useDataPointStore } from "@/lib/store/dataPointStore";
import { useActionStore } from "@/lib/store/actionStore";
import MainSettings from "./MainSettings";
import ExpandableActions from "./ExpandableActions";

interface PositionCardProps {
  position: Position;
  isFirst: boolean;
  isLast: boolean;
  nodeId: string;
  onRemove: (id: string) => void;
  onSettingChange: (id: string, field: keyof PositionSettings, value: any) => void;
}

const PositionCard: React.FC<PositionCardProps> = ({
  position,
  isFirst,
  isLast,
  nodeId,
  onRemove,
  onSettingChange,
}) => {
  const { selectedSymbol, symbolInfo } = useDataPointStore();
  const { moveItemUp, moveItemDown, duplicatePosition } = useActionStore();

  if (!selectedSymbol) return null;
  const currentSymbol = symbolInfo[selectedSymbol];

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm transition-all hover:shadow-md">
      {/* Header with Remove Button */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Add Position <span className="text-white font-semibold bg-blue-700 rounded-full px-2 py-1 text-xs">
              Leg {position.settings.legID}
            </span>
          </span>
          
          {/* Reorder Buttons */}
          <div className="flex gap-1 ml-2">
            <Button
              variant="ghost"
              size="icon"
              disabled={isFirst}
              onClick={() => moveItemUp(nodeId, position.id)}
              className="h-6 w-6 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={isLast}
              onClick={() => moveItemDown(nodeId, position.id)}
              className="h-6 w-6 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <ArrowDown className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Copy Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => duplicatePosition(nodeId, position.id)}
            className="h-8 w-8 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <Copy className="w-4 h-4" />
          </Button>

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(position.id)}
            className="h-8 w-8 rounded-full hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-400"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Settings */}
      <MainSettings
        position={position}
        onSettingChange={onSettingChange}
        currentSymbol={currentSymbol}
      />

      {/* Expandable Actions */}
      <ExpandableActions
        position={position}
        onSettingChange={onSettingChange}
      />
    </div>
  );
};

export default PositionCard;