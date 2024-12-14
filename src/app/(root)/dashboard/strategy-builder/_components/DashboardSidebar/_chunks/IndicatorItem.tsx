import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { AlertCircle, Edit2, X } from "lucide-react";
import { Indicator } from "../Indicators/types";

interface IndicatorItemProps {
  indicator: Indicator;
  isMissing: boolean;
  onEdit: (indicator: Indicator) => void;
  onRemove: (id: string) => void;
}

export const IndicatorItem: React.FC<IndicatorItemProps> = ({
  indicator,
  isMissing,
  onEdit,
  onRemove,
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md relative border 
          ${isMissing ? "border-red-500" : "border-transparent"}`}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">{indicator.elementName}</span>
            {isMissing && <AlertCircle className="w-4 h-4 text-red-500" />}
          </div>
          <div className="absolute right-1 z-10">
            <div className="flex items-center space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(indicator);
                }}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <Edit2 className="w-4 h-4 text-blue-500" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(indicator.id);
                }}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-blue-500" />
              </button>
            </div>
          </div>
        </div>
      </TooltipTrigger>
      {isMissing && (
        <TooltipContent>
          <p>
            Required data point{" "}
            <span className="font-semibold">{indicator.onData}</span> is missing
          </p>
        </TooltipContent>
      )}
    </Tooltip>
  </TooltipProvider>
);
