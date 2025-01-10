import React from "react";
import { Panel, useReactFlow, ControlButton } from "@xyflow/react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNodeStore } from "@/lib/store/nodeStore";
import { DEFAULT_NODE_TEMPLATES } from "../../constants/menu";
import { handleAddNode } from "../../_utils/nodeTypes";
import {
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Expand,
  Plus
} from "lucide-react";

interface CustomControlsProps {
  onAddNode?: () => void;
  onBoardAction?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

const CustomControls: React.FC<CustomControlsProps> = ({ onBoardAction, onUndo, onRedo }) => {
  const { zoomIn, zoomOut, fitView, setViewport } = useReactFlow();
  const { nodes, edges, setNodes, setEdges } = useNodeStore();

  const handleZoomIn = () => zoomIn();
  const handleZoomOut = () => zoomOut();
  const handleFitView = () => fitView();

  const onAdd = (item: any) => {
    const { newNode, newEdges } = handleAddNode(nodes, edges, item);
    setNodes([...nodes, newNode]);
    setEdges(newEdges);
  };

  const baseButtonClass = cn(
    "flex items-center justify-center transition-all duration-200",
    "bg-white/80 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800",
    "border border-gray-200/50 dark:border-gray-700/50",
    "text-gray-700 dark:text-gray-200",
    "backdrop-blur-sm",
    "group",
    "cursor-pointer"
  );

  const controlButtonClass = cn(
    baseButtonClass,
    "w-7 h-7 rounded-lg",
    "hover:shadow-lg hover:border-blue-500/20 dark:hover:border-blue-500/20",
    "hover:translate-y-[-1px]"
  );

  const wideButtonClass = cn(
    baseButtonClass,
    "gap-2 px-4 py-2 rounded-lg min-w-[130px]",
    "hover:shadow-lg hover:border-blue-500/20 dark:hover:border-blue-500/20",
    "hover:translate-y-[-1px]"
  );

  const containerClass = cn(
    "bg-white/60 dark:bg-gray-800/50",
    "border border-gray-200/50 dark:border-gray-700/50",
    "shadow-lg shadow-black/5 dark:shadow-black/20",
    "backdrop-blur-sm",
    "rounded-2xl"
  );

  const mobileButtonClass = cn(baseButtonClass, "w-7 h-7 rounded-lg");

  const iconClass = cn(
    "transition-all duration-200",
    "text-gray-600 dark:text-gray-300",
    "group-hover:text-blue-600 dark:group-hover:text-blue-400",
    "group-hover:scale-110"
  );

  const dropdownItemClass = cn(
    "flex items-center gap-2 cursor-pointer",
    "text-gray-700 dark:text-gray-200",
    "hover:text-blue-600 dark:hover:text-blue-400",
    "focus:text-blue-600 dark:focus:text-blue-400"
  );

  const actionIconClass = cn(iconClass, "w-3 h-3");

  return (
    <TooltipProvider>
      {/* Desktop Controls */}
      <Panel position="bottom-center" className="hidden sm:block mb-6">
        <div
          className={cn(
            containerClass,
            "flex flex-row items-center gap-3 justify-center py-3 px-4"
          )}
        >
          <div className="flex items-center gap-2 pr-3 border-r border-gray-200/50 dark:border-gray-700/50">
            <Tooltip>
              <TooltipTrigger asChild>
                <div onClick={onUndo} className={controlButtonClass}>
                  <Undo size={20} className={actionIconClass} />
                </div>
              </TooltipTrigger>
              <TooltipContent>Undo</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div onClick={onRedo} className={controlButtonClass}>
                  <Redo size={20} className={actionIconClass} />
                </div>
              </TooltipTrigger>
              <TooltipContent>Redo</TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center gap-2 pr-3 border-r border-gray-200/50 dark:border-gray-700/50">
            <Tooltip>
              <TooltipTrigger asChild>
                <div onClick={handleZoomIn} className={controlButtonClass}>
                  <ZoomIn size={20} className={actionIconClass} />
                </div>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div onClick={handleZoomOut} className={controlButtonClass}>
                  <ZoomOut size={20} className={actionIconClass} />
                </div>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div onClick={handleFitView} className={controlButtonClass}>
                  <Expand size={20} className={actionIconClass} />
                </div>
              </TooltipTrigger>
              <TooltipContent>Fit View</TooltipContent>
            </Tooltip>
          </div>

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <button className={wideButtonClass}>
                    <Plus size={16} className={actionIconClass} />
                    <span className="text-xs font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      Quick Add
                    </span>
                  </button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Add New Node</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="center" className="w-48 p-2">
              {DEFAULT_NODE_TEMPLATES.map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  className={dropdownItemClass}
                  onClick={() => onAdd(item)}
                >
                  <Plus size={16} className="text-blue-500" />
                  {/* @ts-ignore */}
                  <span>{item.data.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Panel>

      {/* Mobile Controls */}
      <Panel position="bottom-right" className="sm:hidden">
        <div className={cn(containerClass, "flex gap-2 p-2 fixed bottom-6 right-2 z-50")}>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div onClick={onUndo} className={mobileButtonClass}>
                  <Undo size={12} className={actionIconClass} />
                </div>
              </TooltipTrigger>
              <TooltipContent>Undo</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div onClick={onRedo} className={mobileButtonClass}>
                  <Redo size={20} className={actionIconClass} />
                </div>
              </TooltipTrigger>
              <TooltipContent>Redo</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div onClick={handleZoomIn} className={mobileButtonClass}>
                  <ZoomIn size={16} className={actionIconClass} />
                </div>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div onClick={handleZoomOut} className={mobileButtonClass}>
                  <ZoomOut size={16} className={actionIconClass} />
                </div>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div onClick={handleFitView} className={mobileButtonClass}>
                  <Expand size={16} className={actionIconClass} />
                </div>
              </TooltipTrigger>
              <TooltipContent>Fit View</TooltipContent>
            </Tooltip>
          </div>

          <div className="w-px bg-gray-200/50 dark:bg-gray-700/50" />

          <div className="flex gap-2">
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <button className={mobileButtonClass}>
                      <Plus size={12} className={actionIconClass} />
                    </button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>Add New Node</TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end" className="w-48 p-2">
                {DEFAULT_NODE_TEMPLATES.map((item, index) => (
                  <DropdownMenuItem
                    key={index}
                    className={dropdownItemClass}
                    onClick={() => onAdd(item)}
                  >
                    <Plus size={16} className="text-blue-500" />
                    {/* @ts-ignore */}
                    <span>{item.data.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Panel>
    </TooltipProvider>
  );
};

export default CustomControls;