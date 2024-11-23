import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown } from 'lucide-react';

const TimeSelector = () => {
  const [selectedTime, setSelectedTime] = useState('3m');
  const quickOptions = ['5m', '15m', '30m'];
  const allOptions = ['1m', '3m', ...quickOptions, '1h', '4h', '1d', '1w'];

  // Create dynamic quick options array that always includes selected time
  const displayOptions = selectedTime && !quickOptions.includes(selectedTime)
    ? [selectedTime, ...quickOptions.slice(0, -1)]
    : quickOptions;

  return (
    <div className="flex items-center space-x-1">
      {/* Quick selectors with selected time - Hidden on mobile */}
      <div className="hidden sm:flex items-center border rounded-md dark:border-gray-700">
        {displayOptions.map((time) => (
          <Button
            key={time}
            variant="ghost"
            size="sm"
            onClick={() => setSelectedTime(time)}
            className={cn(
              "px-2 py-1 h-8 text-sm font-medium transition-all duration-200 rounded-none",
              selectedTime === time
                ? "bg-blue-100 text-blue-700 dark:bg-gray-600 dark:text-blue-300"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            {time}
          </Button>
        ))}
        
        {/* Desktop dropdown trigger */}
        <Select value={selectedTime} onValueChange={setSelectedTime}>
          <SelectTrigger className="hidden sm:block h-8 w-8 border-0 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus:ring-0">
            {/* <ChevronDown className="h-4 w-4" /> */}
          </SelectTrigger>
          <SelectContent>
            {allOptions.filter(time => !displayOptions.includes(time)).map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Mobile dropdown */}
      <div className="sm:hidden">
        <Select value={selectedTime} onValueChange={setSelectedTime}>
          <SelectTrigger className="w-20 min-w-20 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-200">
            <SelectValue>{selectedTime}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {allOptions.map((time) => (
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

export default TimeSelector;