import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/components/providers/theme-provider";
import { Highlight, themes } from "prism-react-renderer";
import { Settings } from "lucide-react";

interface StrategyCodeSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingSheet = ({ isOpen, onClose }: StrategyCodeSheetProps) => {
  const { theme } = useTheme();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className=" sm:max-w-72 overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>Setting</SheetTitle>
        </SheetHeader>

        
      </SheetContent>
    </Sheet>
  );
};

export default SettingSheet;
