import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { AlertCircle, Edit2, X } from "lucide-react";
import { DataPoint } from "../DatapointDialog/types";

interface DataPointItemProps {
  point: DataPoint;
  validation: { isValid: boolean; error: string };
  onEdit: (point: DataPoint) => void;
  onRemove: (id: string) => void;
}

export const DataPointItem: React.FC<DataPointItemProps> = ({
  point,
  validation,
  onEdit,
  onRemove,
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`flex items-center justify-between p-2 bg-gray-100 shadow-sm dark:bg-gray-800 relative rounded-md border 
          ${!validation.isValid ? "border-red-500" : "border-transparent"}`}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">{point.elementName}</span>
            {!validation.isValid && (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
          <div className="absolute right-1 z-10">
            <div className="flex items-center space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(point);
                }}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <Edit2 className="w-4 h-4 text-blue-500" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(point.id);
                }}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-blue-500" />
              </button>
            </div>
          </div>
        </div>
      </TooltipTrigger>
      {!validation.isValid && (
        <TooltipContent>
          <p>{validation.error}</p>
        </TooltipContent>
      )}
    </Tooltip>
  </TooltipProvider>
);
