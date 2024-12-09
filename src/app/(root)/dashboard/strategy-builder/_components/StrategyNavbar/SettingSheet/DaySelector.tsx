import React, { useState, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface DaySelectorProps {
}

const DaySelector: React.FC<{}> = ({ 
}) => {
  const [selectorState, setSelectorState] = useState<"days" | "daily" | "exp">("days");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedExp, setSelectedExp] = useState<string[]>([]);
  const [currentExpPage, setCurrentExpPage] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const allExpDays = Array.from({ length: 31 }, (_, i) => i.toString());
  const itemsPerPage = 4;
  const totalPages = Math.ceil(allExpDays.length / itemsPerPage);

  const buttonClass = 'transition-colors font-medium bg-blue-500 hover:bg-blue-600 text-white';
  
  const dayButtonClass = (isSelected: boolean) => cn(
    "px-3 py-1.5 h-8 text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0",
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
    setCurrentExpPage(0);
  };

  const handleDaySelect = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) 
        ? prev.filter(d => d !== day) 
        : [...prev, day]
    );
  };
  
  //Add handleExpSelect for selecting multiple Exp Dates
  const handleExpSelect = (day: string) => {
    setSelectedExp(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };


  const scrollToPage = (page: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = page * (container.clientWidth);
    container.scrollTo({
      left: scrollAmount,
      behavior: 'smooth'
    });
    setCurrentExpPage(page);
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const newPage = Math.round(container.scrollLeft / container.clientWidth);
    if (newPage !== currentExpPage) {
      setCurrentExpPage(newPage);
    }
  };

  const navigationButtonClass = "h-8 w-8 p-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700";

  return (
    <div className="flex items-center justify-between space-x-2">
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

      {selectorState === "days" && (
        <>
          <div className="hidden sm:flex items-center rounded-md overflow-hidden border">
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

          <div className="sm:hidden">
            <Select
              value={selectedDays[0] || weekDays[0]}
              onValueChange={handleDaySelect}
            >
              <SelectTrigger className="w-20 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
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

      {selectorState === "exp" && (
        <div className="flex items-center space-x-1 border rounded-md overflow-hidden">
          {currentExpPage > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scrollToPage(currentExpPage - 1)}
              className={navigationButtonClass}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}

          <div className="relative w-[200px] overflow-hidden">
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto scrollbar-none snap-x snap-mandatory"
              style={{
                scrollSnapType: 'x mandatory',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {allExpDays.map((day) => (
                <button
                  key={day}
                  onClick={() => handleExpSelect(day)}
                  className={cn(
                    dayButtonClass(selectedExp.includes(day)),
                    "snap-center"
                  )}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {currentExpPage < totalPages - 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scrollToPage(currentExpPage + 1)}
              className={navigationButtonClass}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default DaySelector;