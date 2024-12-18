import React from "react";
import {
  Search,
  Settings,
  BarChart2,
  Code,
  Save,
  Menu,
  Logs,
  SquareChevronLeft,
  ChevronLeft,
  ChartNoAxesGantt,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TimeSelector from "./TimeSelector";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SaveStrategyDialog from "./SaveStrategyDialog";
import StrategyCodeSheet from "./StrategyCodeSheet";
import { useSheetStore } from "@/lib/store/SheetStore"; 
import { TemplateSelector } from "../Templete/Templates";
import SymbolSearch from "./SymbolSearch";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {useSettingStore} from "@/lib/store/settingStore"

interface StrategyNavbarProps {
  className?: string;
}

const StrategyNavbar: React.FC<StrategyNavbarProps> = ({ className = "" }) => {
  const { openSheet,isOpen } = useSheetStore();

  const { strategyType,setStrategyType } = useSettingStore();

  const [isSaveDialogOpen, setIsSaveDialogOpen] = React.useState(false);
  const [isCodeSheetOpen, setIsCodeSheetOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleSaveStrategy = async () => {
    // Simulate saving strategy
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Strategy saved!");
  };

  const handleStrategyType = () => {
    openSheet("settings")
    if(isOpen) return;
    if(strategyType === "Intraday") {
      setStrategyType("Positional")
    } else {
      setStrategyType("Intraday")
    }
  }

  const handleMobileMenuItemClick = (action: () => void) => {
    action();
    setIsMobileMenuOpen(false);
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
                <SymbolSearch />
              </div>

              <TimeSelector />

              {/* Intraday Button */}
              <Button
                className="h-9 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md dark:shadow-blue-500/20"
                onClick={handleStrategyType}
              >
                {strategyType} 
              </Button>

              {/* Setting */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => openSheet("settings")}
                      variant="ghost"
                      size="icon"
                      aria-label="Settings"
                      className="transition-all duration-200 hidden sm:flex"
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

            {/* Template */}
            <div className="md:block hidden">
              <TemplateSelector />
            </div>

            <div className="hidden sm:flex items-center space-x-2 sm:space-x-4">
              {/* Chart View */}
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

              {/* Code Button */}
              <Button
                variant="outline"
                className="hidden sm:flex items-center space-x-2 transition-all duration-200"
                onClick={() => setIsCodeSheetOpen(true)}
              >
                <Code className="h-4 w-4" />
                <span>Code</span>
              </Button>

              {/* Save Button */}
              <Button
                className="transition-all duration-200"
                onClick={() => setIsSaveDialogOpen(true)}
              >
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">Save</span>
              </Button>
            </div>

            {/* Mobile menu button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="secondary"
                  // size="icon"
                  aria-label="Menu"
                  className="sm:hidden mr-1"
                >
                  <ChartNoAxesGantt />
                  Menu
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-fit"> 
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Setting */}
                  <Button
                    variant="ghost"
                    className="justify-start border-2 "
                    onClick={() =>
                      handleMobileMenuItemClick(() => openSheet("settings"))
                    }
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>

                  {/* Template */}
                  <div className="justify-start">
                    <TemplateSelector />
                  </div>

                  {/* Chart */}
                  <Button
                    variant="ghost"
                    className="justify-start border-2"
                    onClick={() => handleMobileMenuItemClick(() => {})}
                  >
                    <BarChart2 className="mr-2 h-4 w-4" />
                    Chart View
                  </Button>

                  {/* Code */}
                  <Button
                    variant="ghost"
                    className="justify-start border-2"
                    onClick={() =>
                      handleMobileMenuItemClick(() => setIsCodeSheetOpen(true))
                    }
                  >
                    <Code className="mr-2 h-4 w-4" />
                    Code
                  </Button>

                  {/* Save */}
                  <Button
                    variant="ghost"
                    className="justify-start border-2"
                    onClick={() =>
                      handleMobileMenuItemClick(() => setIsSaveDialogOpen(true))
                    }
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
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
