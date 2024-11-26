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

interface DaySelectorProps {
  onStateChange?: (state: "days" | "daily" | "exp") => void;
}

const DaySelector: React.FC<DaySelectorProps> = ({ onStateChange }) => {
  const [selectorState, setSelectorState] = useState<"days" | "daily" | "exp">(
    "days"
  );
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedExp, setSelectedExp] = useState<string>("0");

  const weekDays = ["M", "Tu", "W", "Th", "F"];
  const expDays = ["0", "1", "2", "3", "4", "5"];

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
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="flex items-center gap-1">
      <Button onClick={handleStateChange} className="min-w-[80px] mb-0">
        {selectorState === "days"
          ? "Days"
          : selectorState === "daily"
          ? "Daily"
          : "Exp"}
      </Button>

      {selectorState === "days" && (
        <div className="hidden sm:flex items-center border-y border-x rounded-md overflow-hidden dark:border-gray-700">
          {weekDays.map((day) => (
            <Button
              key={day}
              variant="ghost"
              size="sm"
              onClick={() => handleDaySelect(day)}
              className={cn(
                "px-2 py-1 h-8 text-sm font-medium border  transition-all duration-200 rounded-none",
                selectedDays.includes(day)
                  ? "bg-blue-100 text-blue-700 dark:bg-gray-600 dark:text-blue-300"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              {day}
            </Button>
          ))}
        </div>
      )}

      {selectorState === "days" && (
        <div className="sm:hidden">
          <Select
            value={selectedDays[0] || weekDays[0]}
            onValueChange={(value) => handleDaySelect(value)}
          >
            <SelectTrigger className="w-20 min-w-20 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-200">
              <SelectValue>{selectedDays[0] || weekDays[0]}</SelectValue>
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
      )}

      {selectorState === "exp" && (
        <div className="hidden sm:flex items-center border rounded-md overflow-hidden dark:border-gray-700">
          {expDays.map((day) => (
            <Button
              key={day}
              variant="ghost"
              size="sm"
              onClick={() => setSelectedExp(day)}
              className={cn(
                "px-2 py-1 h-8 text-sm font-medium transition-all duration-200 rounded-none",
                selectedExp === day
                  ? "bg-blue-100 text-blue-700 dark:bg-gray-600 dark:text-blue-300"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              {day}
            </Button>
          ))}
        </div>
      )}

      {selectorState === "exp" && (
        <div className="sm:hidden">
          <Select value={selectedExp} onValueChange={setSelectedExp}>
            <SelectTrigger className="w-20 min-w-20 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-200">
              <SelectValue>{selectedExp}</SelectValue>
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
      )}
    </div>
  );
};

export default DaySelector;
