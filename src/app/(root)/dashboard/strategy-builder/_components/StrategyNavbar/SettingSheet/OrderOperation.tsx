import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Clock, DollarSign, IndianRupee } from "lucide-react";

interface OrderOperationProps {
  type?: "entry" | "exit";
}

const OrderOperation: React.FC<OrderOperationProps> = ({ type = "entry" }) => {
  const [timeLimit, setTimeLimit] = useState("10");
  const [priceBuffer, setPriceBuffer] = useState("0");
  const [shouldExecute, setShouldExecute] = useState(true);

  const handleNumberInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setter(value);
    }
  };

  return (
    <div className="rounded-xl bg-gray-50/50 dark:bg-gray-800/50 p-4 border border-gray-100 dark:border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 place-content-start">
        {/* Time Limit */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            Time Limit
          </Label>
          <div className="relative">
            <Input
              type="text"
              inputMode="numeric"
              value={timeLimit}
              onChange={(e) => handleNumberInput(e, setTimeLimit)}
              className="h-10 pl-4 pr-12 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter time"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
              sec
            </span>
          </div>
        </div>

        {/* Price Buffer */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <IndianRupee  className="w-4 h-4 text-gray-500" />
            Price Buffer
          </Label>
          <div className="relative">
            <Input
              type="text"
              inputMode="decimal"
              value={priceBuffer}
              onChange={(e) => handleNumberInput(e, setPriceBuffer)}
              className="h-10 pl-4 pr-12 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter price"
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
              checked={shouldExecute}
              onCheckedChange={setShouldExecute}
              className="data-[state=checked]:bg-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderOperation;