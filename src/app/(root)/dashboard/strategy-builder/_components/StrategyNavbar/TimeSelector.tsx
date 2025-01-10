import React, { useState, useEffect, useMemo } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, Star } from "lucide-react";
import { useDataPointStore } from "@/lib/store/dataPointStore";
import { markUnsavedChanges } from "@/lib/store/unsavedChangesStore";

interface TimeOption {
  label: string;
  value: number;
  isStarred: boolean;
}

const STORAGE_KEY = 'timepicker-starred-items';

const sortTimeValues = (a: number, b: number): number => a - b;

const formatTimeFrame = (minutes: number): string => {
  if (!minutes || minutes < 0) return "0m";
  
  if (minutes >= 1440) { // 24 * 60
    const days = Math.floor(minutes / 1440);
    return `${days}d`;
  } else if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    return `${hours}h`;
  }
  return `${minutes}m`;
};

// Function to get starred items from localStorage
const getStoredStarredItems = (symbol: string): number[] => {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}-${symbol}`);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

// Function to store starred items in localStorage
const storeStarredItems = (symbol: string, items: number[]) => {
  try {
    localStorage.setItem(`${STORAGE_KEY}-${symbol}`, JSON.stringify(items));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

const TimePicker = () => {
  const { symbolInfo, selectedSymbol, selectedTimeFrame, setSelectedTimeFrame } = useDataPointStore();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentSymbolInfo = selectedSymbol ? symbolInfo[selectedSymbol] : null;
  
  const timeOptions = useMemo(() => {
    if (!currentSymbolInfo?.timeFrame || !Array.isArray(currentSymbolInfo.timeFrame)) {
      return [];
    }

    // Get starred items from localStorage for the current symbol
    const storedStarredItems = selectedSymbol ? getStoredStarredItems(selectedSymbol) : [];

    return currentSymbolInfo.timeFrame
      .filter(minutes => typeof minutes === 'number' && minutes > 0)
      .map(minutes => ({
        label: formatTimeFrame(minutes),
        value: minutes,
        isStarred: storedStarredItems.includes(minutes)
      }))
      .sort((a, b) => sortTimeValues(a.value, b.value));
  }, [currentSymbolInfo?.timeFrame, selectedSymbol]);

  const [localTimeOptions, setLocalTimeOptions] = useState<TimeOption[]>([]);

  useEffect(() => {
    setLocalTimeOptions(timeOptions);
  }, [timeOptions]);

  useEffect(() => {
    if (!selectedTimeFrame && localTimeOptions.length > 0) {
      setSelectedTimeFrame(localTimeOptions[3].value);
    }
  }, [localTimeOptions]);

  const quickSelectionOptions = useMemo(() => {
    if (!selectedTimeFrame) return [];
    
    const starredOptions = localTimeOptions
      .filter(option => option.isStarred)
      .map(option => option.value);
    
    if (!starredOptions.includes(selectedTimeFrame)) {
      starredOptions.push(selectedTimeFrame);
    }
    
    return starredOptions.sort(sortTimeValues);
  }, [localTimeOptions, selectedTimeFrame]);

  const toggleStar = (timeValue: number, event?: React.MouseEvent) => {
    event?.stopPropagation();
    setLocalTimeOptions(prevOptions => {
      const newOptions = prevOptions.map(option =>
        option.value === timeValue
          ? { ...option, isStarred: !option.isStarred }
          : option
      );
      
      // Update localStorage with new starred items
      if (selectedSymbol) {
        const starredItems = newOptions
          .filter(option => option.isStarred)
          .map(option => option.value);
        storeStarredItems(selectedSymbol, starredItems);
      }
      
      return newOptions;
    });
  };

  const handleTimeSelect = (time: number) => {
    markUnsavedChanges()
    setSelectedTimeFrame(time);
    setIsOpen(false);
  };

  if (!selectedSymbol || localTimeOptions.length === 0) {
    return null;
  }

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
            {formatTimeFrame(time)}
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
              {localTimeOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "flex items-center justify-between px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer",
                    selectedTimeFrame === option.value ? "dark:bg-gray-700 bg-gray-200" : ""
                  )}
                  onClick={() => handleTimeSelect(option.value)}
                >
                  <span>{option.label}</span>
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
              className="w-fit border-gray-300 text-sm px-2 sm:px-3 sm:text-base dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-200"
            >
              {formatTimeFrame(selectedTimeFrame || 0)}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0">
            <div className="max-h-[300px] overflow-auto">
              {localTimeOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "flex items-center justify-between px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer",
                    selectedTimeFrame === option.value ? "bg-gray-700" : ""
                  )}
                  onClick={() => handleTimeSelect(option.value)}
                >
                  <span>{option.label}</span>
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