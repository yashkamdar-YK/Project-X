import React from "react";
import { Panel, useReactFlow, ControlButton } from "@xyflow/react";
import {
  BiZoomIn,
  BiZoomOut,
  BiExpand,
  BiPointer,
  BiPlus,
} from "react-icons/bi";
import {
  IoArrowUndoCircleOutline,
  IoArrowRedoCircleOutline,
} from "react-icons/io5";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNodeStore } from "@/lib/store/nodeStore";
import { DEFAULT_NODE_TEMPLATES } from "../../constants/menu";
import { handleAddNode } from "../../_utils/nodeTypes";

interface CustomControlsProps {
  onAddNode?: () => void;
  onBoardAction?: () => void;
  onUndo?: () => void; // Add prop for undo
  onRedo?: () => void; // Add prop for redo
}


const CustomControls: React.FC<CustomControlsProps> = ({ onBoardAction, onUndo, onRedo, }) => {
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
    "group"
  );

  const controlButtonClass = cn(
    baseButtonClass,
    "w-11 h-11 rounded-lg",
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

  const largeIconClass = cn(iconClass, "w-5 h-5");
  const smallIconClass = cn(iconClass, "w-4 h-4");
  const actionIconClass = cn(iconClass, "w-4 h-4");

  return (
    <>
      {/* Desktop Controls */}
      <Panel position="bottom-center" className="hidden sm:block mb-6">
        <div
          className={cn(
            containerClass,
            "flex flex-row items-center gap-3 justify-center py-3 px-4"
          )}
        >
          <div className="flex items-center gap-2 pr-3 border-r border-gray-200/50 dark:border-gray-700/50">
            {/* Undo */}
            <ControlButton
              onClick={onUndo}
              className={controlButtonClass}
              title="Undo"
            >
              <IoArrowUndoCircleOutline size={12} className={smallIconClass} />
            </ControlButton>

            {/* Redo */}
            <ControlButton
              onClick={onRedo}
              className={controlButtonClass}
              title="Redo"
            >
              <IoArrowRedoCircleOutline size={20} className={largeIconClass} />
            </ControlButton>
          </div>

          <div className="flex items-center gap-2 pr-3 border-r border-gray-200/50 dark:border-gray-700/50">
            {/* Zoom In  */}
            <ControlButton
              onClick={handleZoomIn}
              className={controlButtonClass}
              title="Zoom In"
            >
              <BiZoomIn size={20} className={largeIconClass} />
            </ControlButton>

            {/* Zoom Out  */}
            <ControlButton
              onClick={handleZoomOut}
              className={controlButtonClass}
              title="Zoom Out"
            >
              <BiZoomOut size={20} className={largeIconClass} />
            </ControlButton>

            {/* Fit Screen  */}
            <ControlButton
              onClick={handleFitView}
              className={controlButtonClass}
              title="Fit View"
            >
              <BiExpand size={20} className={largeIconClass} />
            </ControlButton>

          </div>

          <ControlButton
            onClick={onBoardAction}
            className={wideButtonClass}
            title="On the Board"
          >
            <BiPointer size={16} className={actionIconClass} />
            <span className="text-sm font-medium my-4 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              On the Board
            </span>
          </ControlButton>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={wideButtonClass}>
                <BiPlus size={16} className={actionIconClass} />
                <span className="text-sm font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Quick Add
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48 p-2">
              {DEFAULT_NODE_TEMPLATES.map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  className={dropdownItemClass}
                  onClick={() => onAdd(item)}
                >
                  <BiPlus size={16} className="text-blue-500" />
                  {/* @ts-ignore */}
                  <span>{item.data.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Panel>

      {/* Mobile Controls */}
      <Panel position="bottom-right" className="sm:hidden mb-4 mr-4">
        <div className={cn(containerClass, "flex gap-2 p-2")}>
          <div className="flex gap-2">
            {/* Undo */}
            <ControlButton
              onClick={onUndo}
              className={controlButtonClass}
              title="Undo"
            >
              <IoArrowUndoCircleOutline size={12} className={smallIconClass} />
            </ControlButton>

            {/* Redo */}
            <ControlButton
              onClick={onRedo}
              className={controlButtonClass}
              title="Redo"
            >
              <IoArrowRedoCircleOutline size={20} className={largeIconClass} />
            </ControlButton>
            <ControlButton
              onClick={handleZoomIn}
              className={mobileButtonClass}
              title="Zoom In"
            >
              <BiZoomIn size={16} className={smallIconClass} />
            </ControlButton>

            <ControlButton
              onClick={handleZoomOut}
              className={mobileButtonClass}
              title="Zoom Out"
            >
              <BiZoomOut size={16} className={smallIconClass} />
            </ControlButton>

            <ControlButton
              onClick={handleFitView}
              className={mobileButtonClass}
              title="Fit View"
            >
              <BiExpand size={16} className={smallIconClass} />
            </ControlButton>
          </div>

          <div className="w-px bg-gray-200/50 dark:bg-gray-700/50" />

          <div className="flex gap-2">
            <ControlButton
              onClick={onBoardAction}
              className={mobileButtonClass}
              title="On the Board"
            >
              <BiPointer size={16} className={smallIconClass} />
            </ControlButton>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={mobileButtonClass}>
                  <BiPlus size={12} className={smallIconClass} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 p-2">
                {DEFAULT_NODE_TEMPLATES.map((item, index) => (
                  <DropdownMenuItem
                    key={index}
                    className={dropdownItemClass}
                    onClick={() => onAdd(item)}
                  >
                    <BiPlus size={16} className="text-blue-500" />
                    {/* @ts-ignore */}
                    <span>{item.data.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Panel>
    </>
  );
};

export default CustomControls;
