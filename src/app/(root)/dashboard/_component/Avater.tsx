import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Avatar() {
  return (
    <Select>
      <SelectTrigger className="border-2 border-black dark:border-white w-7 h-7 rounded-full">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Logout</SelectItem>
          <SelectItem value="banana">Delete Cookies</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
