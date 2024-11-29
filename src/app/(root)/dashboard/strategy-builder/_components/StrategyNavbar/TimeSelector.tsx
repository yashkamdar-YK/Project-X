import React, { useState, useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, Star } from 'lucide-react';

// Helper function to convert time string to minutes for comparison
const convertToMinutes = (timeStr: string): number => {
  const value = parseInt(timeStr);
  if (timeStr.endsWith('m')) return value;
  if (timeStr.endsWith('h')) return value * 60;
  if (timeStr.endsWith('d')) return value * 24 * 60;
  if (timeStr.endsWith('w')) return value * 7 * 24 * 60;
  return value;
};

// Sort function for time values
const sortTimeValues = (a: string, b: string): number => {
  return convertToMinutes(a) - convertToMinutes(b);
};

const initialTimeOptions = [
  { value: '1m', isStarred: false },
  { value: '3m', isStarred: false },
  { value: '5m', isStarred: true },
  { value: '15m', isStarred: true },
  { value: '30m', isStarred: true },
  { value: '1h', isStarred: false },
  { value: '4h', isStarred: false },
  { value: '1d', isStarred: false },
  { value: '1w', isStarred: false },
].sort((a, b) => sortTimeValues(a.value, b.value));

const TimePicker = () => {
  const [selectedTime, setSelectedTime] = useState(initialTimeOptions[0].value);
  const [timeOptions, setTimeOptions] = useState(initialTimeOptions);
  const [quickOptions, setQuickOptions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    updateQuickOptions();
  }, [timeOptions]);

  const updateQuickOptions = () => {
    const starred = timeOptions
      .filter(option => option.isStarred)
      .map(option => option.value)
      .sort(sortTimeValues);
    
    const nonStarred = timeOptions
      .filter(option => !option.isStarred)
      .map(option => option.value)
      .sort(sortTimeValues);
    
    const quickOpts = starred.length >= 4 
      ? starred.slice(0, 4) 
      : [...starred, ...nonStarred].slice(0, 4);
    
    setQuickOptions(quickOpts);
  };

  const toggleStar = (timeValue: string) => {
    setTimeOptions(prevOptions =>
      prevOptions.map(option =>
        option.value === timeValue
          ? { ...option, isStarred: !option.isStarred }
          : option
      )
    );
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setIsOpen(false);
  };

  // Sort timeOptions before rendering
  const sortedTimeOptions = [...timeOptions].sort((a, b) => 
    sortTimeValues(a.value, b.value)
  );

  return (
    <div className="flex items-center space-x-1">
      {/* Desktop view with quick options */}
      <div className="hidden sm:flex items-center border rounded-md overflow-hidden dark:border-gray-700">
        {quickOptions.map((time) => (
          <Button
            key={time}
            variant="ghost"
            size="sm"
            onClick={() => setSelectedTime(time)}
            className={cn(
              "px-2 py-1 h-8 text-sm font-medium transition-all duration-200 rounded-none relative",
              selectedTime === time
                ? "bg-blue-100 text-blue-700 dark:bg-gray-600 dark:text-blue-300"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            {time}
          </Button>
        ))}

        {/* Desktop dropdown */}
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
                  className={`flex items-center justify-between px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${selectedTime === option.value ? "dark:bg-gray-700 bg-gray-200" : ""}`}
                  onClick={() => handleTimeSelect(option.value)}
                >
                  <span>{option.value}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(option.value);
                    }}
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

      {/* Mobile dropdown */}
      <div className="sm:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-fit border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-200"
            >
              {selectedTime}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0">
            <div className="max-h-[300px] overflow-auto">
              {sortedTimeOptions.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-center justify-between px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${selectedTime === option.value ? "bg-gray-700" : ""}`}
                  onClick={() => handleTimeSelect(option.value)}
                >
                  <span>{option.value}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(option.value);
                    }}
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