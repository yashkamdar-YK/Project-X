import React, { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, Star } from "lucide-react";
import { useDataPointStore } from "@/lib/store/dataPointStore";

const convertToMinutes = (timeStr: string): number => {
  const value = parseInt(timeStr);
  if (timeStr.endsWith("m")) return value;
  if (timeStr.endsWith("h")) return value * 60;
  if (timeStr.endsWith("d")) return value * 24 * 60;
  if (timeStr.endsWith("w")) return value * 7 * 24 * 60;
  return value;
};

const sortTimeValues = (a: string, b: string): number => {
  return convertToMinutes(a) - convertToMinutes(b);
};

const formatTimeFrame = (minutes: number): string => {
  if (minutes >= 1440) { // 24 * 60
    return `${minutes / 1440}d`;
  } else if (minutes >= 60) {
    return `${minutes / 60}h`;
  }
  return `${minutes}m`;
};


const TimePicker = () => {
  const { symbolInfo, selectedSymbol } = useDataPointStore();
  const currentSymbolInfo = selectedSymbol ? symbolInfo[selectedSymbol] : null;
  
  // Convert API timeframes to our format
  const getTimeOptions = () => {
    if (!currentSymbolInfo?.timeFrame) {
      return [];
    }

    return currentSymbolInfo.timeFrame.map(minutes => ({
      value: formatTimeFrame(minutes),
      isStarred: false
    })).sort((a, b) => sortTimeValues(a.value, b.value));
  };

  const [timeOptions, setTimeOptions] = useState(getTimeOptions());
  const {selectedTimeFrame,setSelectedTimeFrame} = useDataPointStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if(!selectedTimeFrame){
      setSelectedTimeFrame(timeOptions[0]?.value || "1m");
    }
  }, [timeOptions]);

  // Update options when symbol changes
  useEffect(() => {
    const newOptions = getTimeOptions();
    setTimeOptions(newOptions);
    if (newOptions.length > 0) {
      setSelectedTimeFrame(newOptions[0].value);
    }
  }, [selectedSymbol, currentSymbolInfo]);

  const getQuickSelectionOptions = () => {
    if(!selectedTimeFrame) return [];
    const starredOptions = timeOptions
      .filter(option => option.isStarred)
      .map(option => option.value);
    
    if (!starredOptions.includes(selectedTimeFrame)) {
      starredOptions.push(selectedTimeFrame);
    }
    
    return starredOptions.sort(sortTimeValues);
  };

  const toggleStar = (timeValue: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    setTimeOptions(prevOptions =>
      prevOptions.map(option =>
        option.value === timeValue
          ? { ...option, isStarred: !option.isStarred }
          : option
      )
    );
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTimeFrame(time);
    setIsOpen(false);
  };

  const sortedTimeOptions = [...timeOptions].sort((a, b) =>
    sortTimeValues(a.value, b.value)
  );
  
  const quickSelectionOptions = getQuickSelectionOptions();

  if (!selectedSymbol || timeOptions.length === 0) return null

  console.log(selectedTimeFrame);
  

  return (
    <div className="flex items-center space-x-1">
      {/* Desktop view with quick selection */}
      <div className="hidden sm:flex items-center border rounded-md overflow-hidden dark:border-gray-700">
        {quickSelectionOptions.map((time) => (
          <Button
            key={time}
            variant="ghost"
            size="sm"
            onClick={() => handleTimeSelect(time)}
            className={cn(
              "px-2 py-1 h-8 text-sm font-medium transition-all duration-200 rounded-none relative",
              selectedTimeFrame === time
                ? "bg-blue-100 text-blue-700 dark:bg-gray-600 dark:text-blue-300"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            {time}
          </Button>
        ))}

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 border-0 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus:ring-0"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-32 p-0">
            <div className="max-h-[300px] overflow-auto hide-scrollbar">
              {sortedTimeOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "flex items-center justify-between px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer",
                    selectedTimeFrame === option.value ? "dark:bg-gray-700 bg-gray-200" : ""
                  )}
                  onClick={() => handleTimeSelect(option.value)}
                >
                  <span>{option.value}</span>
                  <button
                    onClick={(e) => toggleStar(option.value, e)}
                    className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-1 transition-all duration-200"
                  >
                    <Star
                      className={cn(
                        "h-4 w-4 transition-colors",
                        option.isStarred
                          ? "fill-yellow-400 stroke-yellow-400"
                          : "stroke-gray-400"
                      )}
                    />
                  </button>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Mobile view */}
      <div className="sm:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-fit border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-200"
            >
              {selectedTimeFrame}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0">
            <div className="max-h-[300px] overflow-auto">
              {sortedTimeOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "flex items-center justify-between px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer",
                    selectedTimeFrame === option.value ? "bg-gray-700" : ""
                  )}
                  onClick={() => handleTimeSelect(option.value)}
                >
                  <span>{option.value}</span>
                  <button
                    onClick={(e) => toggleStar(option.value, e)}
                    className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-1 transition-all duration-200"
                  >
                    <Star
                      className={cn(
                        "h-4 w-4 transition-colors",
                        option.isStarred
                          ? "fill-yellow-400 stroke-yellow-400"
                          : "stroke-gray-400"
                      )}
                    />
                  </button>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default TimePicker;