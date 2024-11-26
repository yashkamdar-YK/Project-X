import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface OrderOperationProps {
  type?: "entry" | "exit";
}

const OrderOperation: React.FC<OrderOperationProps> = ({ type = "entry" }) => {
  const [timeLimit, setTimeLimit] = useState("10");
  const [priceBuffer, setPriceBuffer] = useState("0");
  const [shouldExecute, setShouldExecute] = useState(true);

  // Handler for number inputs to ensure only numbers are entered
  const handleNumberInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const value = e.target.value;
    // Allow empty string or numbers (including decimals for price buffer)
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setter(value);
    }
  };

  return (
    <div className="w-full grid grid-cols-3 gap-4 items-center">
      {/* Time Limit */}
      <div className="flex flex-col space-y-1.5">
        <Label className="text-xs text-gray-500 dark:text-gray-400">
          Time Limit
        </Label>
        <Input
          type="text"
          inputMode="numeric"
          value={timeLimit}
          onChange={(e) => handleNumberInput(e, setTimeLimit)}
          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-10"
          placeholder="Enter time"
        />
      </div>

      {/* Price Buffer */}
      <div className="flex flex-col space-y-1.5">
        <Label className="text-xs text-gray-500 dark:text-gray-400">
          Price Buffer
        </Label>
        <Input
          type="text"
          inputMode="decimal"
          value={priceBuffer}
          onChange={(e) => handleNumberInput(e, setPriceBuffer)}
          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-10"
          placeholder="Enter price"
        />
      </div>

      {/* Should Execute Switch */}
      <div className="flex flex-col space-y-1.5">
        <Label className="text-xs text-gray-500 dark:text-gray-400">
          Should Execute
        </Label>
        <div className="h-10 flex items-center">
          <Switch
            checked={shouldExecute}
            onCheckedChange={setShouldExecute}
            className="data-[state=checked]:bg-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default OrderOperation;