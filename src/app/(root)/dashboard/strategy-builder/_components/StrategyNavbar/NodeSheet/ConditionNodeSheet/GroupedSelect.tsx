import React, { useState, useMemo } from "react";
import { Search, Check, ChevronDown } from 'lucide-react';
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface GroupedOptions {
  [key: string]: string[];
}

interface GroupedDropdownProps {
  groupedOptions: GroupedOptions;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const GroupedDropdown: React.FC<GroupedDropdownProps> = ({
  groupedOptions,
  value,
  onValueChange,
  placeholder = "Select...",
  className = "",
  disabled = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Filter grouped options based on search term
  const filteredGroups = useMemo(() => {
    const filtered: GroupedOptions = {};

    Object.entries(groupedOptions).forEach(([groupName, options]) => {
      const filteredOptions = options.filter((opt) =>
        opt.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (filteredOptions.length > 0) {
        filtered[groupName] = filteredOptions;
      }
    });

    if (value) {
      const allOriginalOptions = Object.values(groupedOptions).flat();
      if (
        allOriginalOptions.includes(value) &&
        !Object.values(filtered).flat().includes(value)
      ) {
        filtered["Selected"] = [value];
      }
    }

    return filtered;
  }, [groupedOptions, searchTerm, value]);

  const handleSelect = (newValue: string) => {
    onValueChange(newValue);
    setSearchTerm("");
    setIsOpen(false);
  };

  const displayValue = makeActionReadable(value) || placeholder;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button
          variant="outline"
          className={`justify-between w-fit bg-transparent ${className}`}
        >
          <span className="truncate">{displayValue}</span>
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-full p-2 bg-transparent backdrop-blur-3xl"
        align="start"
        onCloseAutoFocus={(e) => {
          // Prevent the dropdown from closing when clicking the input
          e.preventDefault();
        }}
      >
        <div className="px-2 pb-2" onClick={(e) => e.stopPropagation()}>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-8 pl-8 text-sm bg-transparent focus-visible:ring-1 focus-visible:ring-offset-0"
              placeholder="Type to search..."
              autoComplete="off"
              type="search"
              onKeyDown={(e) => {
                // Prevent dropdown from closing on key press
                e.stopPropagation();
              }}
              onClick={(e) => {
                // Prevent dropdown from closing on click
                e.stopPropagation();
              }}
            />
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] w-full hide-horizontal-scrollbar overflow-y-auto">
          {Object.entries(filteredGroups).map(
            ([groupName, options], groupIndex) => (
              <React.Fragment key={groupName}>
                {groupIndex > 0 && <DropdownMenuSeparator />}
                <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                  {groupName}
                </div>
                {options.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => handleSelect(option)}
                  >
                    <span className="capitalize">
                      {["Time", "MTM"]?.includes(groupName)
                        ? option.replace(/_/g, " ")
                        : groupName === "Actions" ? makeActionReadable(option)
                        : option}
                    </span>
                    {option === value && <Check className="w-4 h-4" />}
                  </DropdownMenuItem>
                ))}
              </React.Fragment>
            )
          )}
          {Object.keys(filteredGroups).length === 0 && (
            <div className="px-2 py-2 text-sm text-muted-foreground">
              No matches found
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GroupedDropdown;

const makeActionReadable = (action: string) => {
  if(action?.split(":").length !== 2) return action;
  const [a, b] = action.split(":");
  return `${b} (${a})`;
}