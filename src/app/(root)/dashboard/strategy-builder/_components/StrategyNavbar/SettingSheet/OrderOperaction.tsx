import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const OrderOperaction = () => {
  const [orderOperations, setOrderOperations] = useState("10");
  const quickOptions = ["10", "0", "YES"];

  // Create dynamic quick options array that always includes selected time
  const displayOptions =
    orderOperations && !quickOptions.includes(orderOperations)
      ? [orderOperations, ...quickOptions.slice(0, -1)]
      : quickOptions;

  return (
    <div className="flex items-center space-x-1">
      {/* Quick selectors with selected time - Hidden on mobile */}
      <div className="hidden sm:flex items-center rounded-md overflow-hidden dark:border-gray-700">
        {displayOptions.map((time) => (
          <Button
            key={time}
            variant="ghost"
            size="sm"
            onClick={() => setOrderOperations(time)}
            className={cn(
              "px-2 py-1 h-8 text-sm font-medium transition-all border dark:border-gray-700 duration-200 rounded-none",
              orderOperations === time
                ? "bg-blue-100 text-blue-700 dark:bg-gray-600  dark:text-blue-300"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            {time}
          </Button>
        ))}
      </div>
      <div className="sm:hidden">
        <Select value={orderOperations} onValueChange={setOrderOperations}>
          <SelectTrigger className="w-20 min-w-18 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-200">
            <SelectValue>{orderOperations}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {quickOptions.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default OrderOperaction;
