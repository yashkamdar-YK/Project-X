import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DaySelectorProps {
  onStateChange?: (state: "days" | "daily" | "exp") => void;
  showDaysInDaily?: boolean;
}

const DaySelector: React.FC<DaySelectorProps> = ({ 
  onStateChange,
  showDaysInDaily = false 
}) => {
  const [selectorState, setSelectorState] = useState<"days" | "daily" | "exp">("days");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedExp, setSelectedExp] = useState<string>("0");

  const weekDays = ["M", "Tu", "W", "Th", "F"];
  const expDays = ["0", "1", "2", "3", "4", "5"];

  const buttonClass = 'transition-colors font-medium bg-blue-500  hover:bg-blue-600 text-white';
  
  const dayButtonClass = (isSelected: boolean) => cn(
    "px-3 py-1.5 h-8 text-sm font-medium border transition-all duration-200",
    isSelected
      ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:border-blue-600"
      : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
  );

  const handleStateChange = () => {
    const newState =
      selectorState === "days"
        ? "daily"
        : selectorState === "daily"
        ? "exp"
        : "days";
    setSelectorState(newState);
    onStateChange?.(newState);
  };

  const handleDaySelect = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) 
        ? prev.filter(d => d !== day) 
        : [...prev, day]
    );
  };

  return (
    <div className="flex items-center justify-between space-x-2">
      {/* State Toggle Button */}
      <Button 
        onClick={handleStateChange} 
        variant="outline"
        className={buttonClass}
      >
        {selectorState === "days"
          ? "Days"
          : selectorState === "daily"
          ? "Daily"
          : "Exp"}
      </Button>

      {/* Days Selection Section */}
      {(selectorState === "days" || (selectorState === "daily" && showDaysInDaily)) && (
        <>
          {/* Desktop View */}
          <div className="hidden sm:flex items-center rounded-md overflow-hidden">
            {weekDays.map((day) => (
              <button
                key={day}
                onClick={() => handleDaySelect(day)}
                className={dayButtonClass(selectedDays.includes(day))}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Mobile View */}
          <div className="sm:hidden">
            <Select
              value={selectedDays[0] || weekDays[0]}
              onValueChange={handleDaySelect}
            >
              <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {weekDays.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {/* Expiry Days Selection */}
      {selectorState === "exp" && (
        <>
          {/* Desktop View */}
          <div className="hidden sm:flex items-center rounded-md overflow-hidden">
            {expDays.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedExp(day)}
                className={dayButtonClass(selectedExp === day)}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Mobile View */}
          <div className="sm:hidden">
            <Select value={selectedExp} onValueChange={setSelectedExp}>
              <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {expDays.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  );
};

export default DaySelector;