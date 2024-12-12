import React from "react";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { Position } from "./types";
import { useDataPointStore } from "@/lib/store/dataPointStore";
import MainSettings from "./MainSettings";
import ExpandableActions from "./ExpandableActions";

interface PositionCardProps {
  position: Position;
  onRemove: (id: string) => void;
  onSettingChange: (id: string, field: string, value: any) => void;
}

const PositionCard: React.FC<PositionCardProps> = ({
  position,
  onRemove,
  onSettingChange,
}) => {
  const { selectedSymbol, symbolInfo } = useDataPointStore();

  if (!selectedSymbol) return null;
  const currentSymbol = symbolInfo[selectedSymbol];

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm transition-all hover:shadow-md">
      {/* Header with Remove Button */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Position Leg {position.settings.legID}
          </span>
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100">
            {position.settings.segment}
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(position.id)}
          className="h-8 w-8 rounded-full hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-400"
        >
          <X className="w-4 h-4" />
        </Button>
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

