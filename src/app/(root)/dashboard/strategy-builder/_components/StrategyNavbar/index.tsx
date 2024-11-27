import React from "react";
import { Search, Settings, BarChart2, Code, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TimeSelector from "./TimeSelector";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GoProjectTemplate } from "react-icons/go";

import SaveStrategyDialog from "./SaveStrategyDialog";
import StrategyCodeSheet from "./StrategyCodeSheet";
import { useSheetStore } from "@/lib/store/SheetStore"; // Import the store
import { LayoutPanelTop } from 'lucide-react';

interface StrategyNavbarProps {
  className?: string;
}

const StrategyNavbar: React.FC<StrategyNavbarProps> = ({ className = "" }) => {
  const { openSheet } = useSheetStore();

  const [isSaveDialogOpen, setIsSaveDialogOpen] = React.useState(false);
  const [isCodeSheetOpen, setIsCodeSheetOpen] = React.useState(false);

  const handleSaveStrategy = async () => {
    // Simulate saving strategy
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Strategy saved!");
  };

  return (
    <>
      <nav
        className={`border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${className}`}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                />
                <Input
                  className="pl-10 pr-4 py-2 w-28 sm:w-40 md:w-48 rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 transition-all duration-200"
                  type="text"
                  placeholder="NIFTY"
                  aria-label="Search NIFTY"
                />
              </div>

              <TimeSelector />

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => openSheet("settings")}
                      variant="ghost"
                      size="icon"
                      aria-label="Settings"
                      className="transition-all duration-200"
                    >
                      <Settings className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Settings</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="dark:bg-gray-900">
                    Templates <GoProjectTemplate className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  className="min-w-[140px] dark:bg-gray-900"
                >
                  {/* Addind Items  */}
                  <DropdownMenuItem>
                    <div className="flex w-[300px] gap-1 dark:text-gray-300 text-gray-800 items-center  ">
                      <div>
                      <LayoutPanelTop size={100} />
                      </div>
                      <div>
                        <h1 className="text-2xl">Starter Templates</h1>
                        <p className="text-sm">Never write from scratch again. Go from idea to blog in minutes.</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Chart view"
                      className="transition-all duration-200"
                    >
                      <BarChart2 className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Chart view</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button
                variant="outline"
                className="hidden sm:flex items-center space-x-2 transition-all duration-200 mt-2"
                onClick={() => setIsCodeSheetOpen(true)}
              >
                <Code className="h-4 w-4" />
                <span>Code</span>
              </Button>

              <Button
                className="transition-all duration-200 mt-2"
                onClick={() => setIsSaveDialogOpen(true)}
              >
                <Save className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Save</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <SaveStrategyDialog
        isOpen={isSaveDialogOpen}
        onClose={() => setIsSaveDialogOpen(false)}
        onConfirm={handleSaveStrategy}
      />

      <StrategyCodeSheet
        isOpen={isCodeSheetOpen}
        onClose={() => setIsCodeSheetOpen(false)}
      />
    </>
  );
};

export default StrategyNavbar;
