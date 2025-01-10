import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Clock, IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDataPointStore } from "@/lib/store/dataPointStore";
import type { Operation } from "./SettingSheet";

interface OrderOperationProps {
  type?: "entry" | "exit";
  disabled?: boolean;
  operation: Operation;
  onOperationChange: (updates: Partial<Operation>) => void;
}

const MAX_TIME_LIMIT = 3600; // Maximum time limit in seconds
const MAX_PRICE_BUFFER = 50; // Maximum price buffer

const OrderOperation: React.FC<OrderOperationProps> = ({
  type = "entry",
  disabled = false,
  operation,
  onOperationChange
}) => {
  const { symbolInfo, selectedSymbol } = useDataPointStore();
  const currentSymbolInfo = selectedSymbol ? symbolInfo[selectedSymbol] : null;

  const handleNumberInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'timeLimit' | 'priceBuffer'
  ) => {
    const value = e.target.value;
    
    // Allow any numeric input initially
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      const numValue = parseFloat(value);

      // Handle time limit validation
      if (field === 'timeLimit') {
        if (value === '' || isNaN(numValue)) {
          onOperationChange({ [field]: value });
        } else {
          const clampedValue = Math.min(Math.max(0, numValue), MAX_TIME_LIMIT);
          onOperationChange({ [field]: clampedValue.toString() });
        }
        return;
      }

      // Handle price buffer validation
      if (field === 'priceBuffer') {
        if (value === '') {
          onOperationChange({ [field]: value });
        } else if (!isNaN(numValue)) {
          // First clamp the value to the allowed range
          const clampedValue = Math.min(Math.max(0, numValue), MAX_PRICE_BUFFER);
          
          if (currentSymbolInfo?.tickSize) {
            const roundedValue = Math.round(clampedValue / currentSymbolInfo.tickSize) * currentSymbolInfo.tickSize;
            // Only format with fixed decimal places if the value contains a decimal point
            const formattedValue = value.includes('.') 
              ? roundedValue.toFixed(String(currentSymbolInfo.tickSize).split('.')[1]?.length || 0)
              : roundedValue.toString();
            onOperationChange({ [field]: formattedValue });
          } else {
            onOperationChange({ [field]: clampedValue.toString() });
          }
        }
      }
    }
  };

  return (
    <div className={cn(
      "rounded-xl bg-gray-50/50 dark:bg-gray-800/50 p-4 border border-gray-100 dark:border-gray-700",
      disabled && "opacity-50"
    )}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 place-content-start">
        {/* Time Limit */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            Time Limit (max {MAX_TIME_LIMIT} sec)
          </Label>
          <div className="relative">
            <Input
              type="text"
              inputMode="numeric"
              value={operation.timeLimit}
              onChange={(e) => handleNumberInput(e, 'timeLimit')}
              className="h-10 pl-4 pr-12 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter time (0-3600)"
              disabled={disabled}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
              sec
            </span>
          </div>
        </div>

        {/* Price Buffer */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-gray-500" />
            Price Buffer (max {MAX_PRICE_BUFFER}) {currentSymbolInfo?.tickSize && `(tick: ${currentSymbolInfo.tickSize})`}
          </Label>
          <div className="relative">
            <Input
              type="number"
              inputMode="decimal"
              value={operation.priceBuffer}
              onChange={(e) => handleNumberInput(e, 'priceBuffer')}
              className="h-10 pl-4 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter price (0-50)"
              disabled={disabled}
              step={Number(currentSymbolInfo?.tickSize) || undefined}
            />
          </div>
        </div>

        {/* Should Execute Switch */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Should Execute
          </Label>
          <div className="flex justify-end h-12">
            <Switch
              checked={operation.shouldExecute}
              onCheckedChange={(checked) => onOperationChange({ shouldExecute: checked })}
              className="data-[state=checked]:bg-blue-500"
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderOperation;