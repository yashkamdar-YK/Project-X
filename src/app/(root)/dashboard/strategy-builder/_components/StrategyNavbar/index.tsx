import React, { useCallback } from "react";
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
  Pencil,
  ArrowDown,
  ChevronDown,
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
import { useSettingStore } from "@/lib/store/settingStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { strategyService } from "../../_actions";
import { toast } from "@/hooks/use-toast";
import { TStrategyInfo } from "../../_utils/strategyTypes";
import { useUnsavedChangesStore } from "@/lib/store/unsavedChangesStore";
import { getSaveStrategyData } from "../../_utils/utils";
import { StrategyActions } from "./StrategyActions";
import { useRouter } from "next/navigation";

interface StrategyNavbarProps {
  name?: string | null;
  stratinfo: TStrategyInfo['stratinfo'];
}

const StrategyNavbar: React.FC<StrategyNavbarProps> = ({
  name = null,
  stratinfo
}) => {
  const { openSheet, isOpen } = useSheetStore();
  const { strategyType, setStrategyType } = useSettingStore();
  const { isUnsaved, setUnsaved } = useUnsavedChangesStore();

  const [isSaveDialogOpen, setIsSaveDialogOpen] = React.useState(false);
  const [isCodeSheetOpen, setIsCodeSheetOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const updateStrategyMutation = useMutation({
    mutationFn: ({ strategyName, data }: { strategyName: string; data: any }) =>
      strategyService.updateStrategy(strategyName, data),
    mutationKey: ["updateStrategy"],
    onSuccess: () => {
      toast({
        title: "Strategy saved successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to save strategy",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Store hooks
  const queryClient = useQueryClient();
  const router = useRouter()

  const handleSaveStrategy = async () => {
    if (name) {
      setUnsaved(false);
      await updateStrategyMutation.mutateAsync({
        data: getSaveStrategyData(name),
        strategyName: name,
      });
    } else {
      setIsSaveDialogOpen(true);
    }
  };

  const handleEditStrategy = () => {
    if (!!name) {
      setIsSaveDialogOpen(true);
    }
  };

  const handleStrategyType = () => {
    openSheet("settings");
    if (isOpen) return;
    if (strategyType === "Intraday") {
      setStrategyType("Positional");
    } else {
      setStrategyType("Intraday");
    }
  };
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        event.preventDefault(); // Prevent browser's default save dialog
        handleSaveStrategy();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [name]);

  const handleMobileMenuItemClick = (action: () => void) => {
    action();
    setIsMobileMenuOpen(false);
  };

  const deleteSt = useMutation({
    mutationFn: strategyService.deleteSt,
    mutationKey: ["deleteStrategy"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["allStrategies"],
        exact: true
      });
      toast({
        title: "Strategy deleted successfully",
        variant: "default",
      });
      router.push("/dashboard/my-strategies");
    },
    onError: (error) => {
      toast({
        title: "Error deleting strategy",
        variant: "destructive",
      });
    }
  });
  const handleDeleteStrategy = () => {
    if (name) {
      deleteSt.mutate(name);
    } else {
      toast({
        title: "No strategy to delete",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="px-2 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side controls */}
            <div className="flex items-center space-x-1 sm:space-x-4">
              <div className="relative">
                <SymbolSearch />
              </div>
              <TimeSelector />
              <Button
                className="h-9 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md dark:shadow-blue-500/20"
                onClick={handleStrategyType}
              >
                {strategyType}
              </Button>
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

            {/* Template selector - desktop */}
            <div className="md:block hidden">
              <TemplateSelector />
            </div>

            {/* Desktop controls */}
            <div className="hidden sm:flex items-center space-x-2 sm:space-x-4">
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
                className="hidden sm:flex items-center space-x-2 transition-all duration-200"
                onClick={() => setIsCodeSheetOpen(true)}
              >
                <Code className="h-4 w-4" />
                <span>Code</span>
              </Button>

              <div className={`flex shadow-md rounded-lg overflow-hidden `}>
                <Button
                  className={`transition-all duration-200 ${!!name ? "rounded-r-none" : ''
                    } ${isUnsaved ? "bg-orange-500 hover:bg-orange-400 text-white" : ""
                    }`}
                  onClick={handleSaveStrategy}
                  disabled={updateStrategyMutation.isPending}
                >
                  <Save className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {updateStrategyMutation.isPending ? "Saving..." : "Save"}
                  </span>
                </Button>

                {!!name && (
                  <StrategyActions
                    name={name}
                    onEdit={handleEditStrategy}
                    onDelete={handleDeleteStrategy}
                  />
                )}
              </div>
            </div>

            {/* Mobile menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="secondary"
                  className="sm:hidden"
                >
                  <ChartNoAxesGantt className="h-4 w-4" />
                  <span>Menu</span>
                  {isUnsaved && (
                    <span className="p-1 text-xs bg-orange-500 rounded-full">
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-fit">
                <div className="flex flex-col space-y-4 mt-8">
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleMobileMenuItemClick(() => openSheet("settings"))}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>

                  <div className="border-t pt-4">
                    <TemplateSelector />
                  </div>

                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleMobileMenuItemClick(() => { })}
                  >
                    <BarChart2 className="mr-2 h-4 w-4" />
                    Chart View
                  </Button>

                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleMobileMenuItemClick(() => setIsCodeSheetOpen(true))}
                  >
                    <Code className="mr-2 h-4 w-4" />
                    Code
                  </Button>

                  <Button
                    variant={isUnsaved ? "destructive" : "outline"}
                    className="justify-start"
                    onClick={() => handleMobileMenuItemClick(handleSaveStrategy)}
                    disabled={updateStrategyMutation.isPending}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {updateStrategyMutation.isPending ? "Saving..." : "Save"}
                  </Button>

                  {!!name && (
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => handleMobileMenuItemClick(handleEditStrategy)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Strategy
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <SaveStrategyDialog
        isOpen={isSaveDialogOpen}
        onClose={() => setIsSaveDialogOpen(false)}
        name={name}
        defaultName={name || ""}
        stratinfo={stratinfo}
      />

      <StrategyCodeSheet
        isOpen={isCodeSheetOpen}
        onClose={() => setIsCodeSheetOpen(false)}
      />
    </>
  );
};

export default StrategyNavbar;