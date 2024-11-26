import React from 'react';
import { Panel, useReactFlow, ControlButton } from '@xyflow/react';
import { 
  BiZoomIn, 
  BiZoomOut 
} from 'react-icons/bi';
import { RxEnterFullScreen } from 'react-icons/rx';
import { GoTriangleUp } from 'react-icons/go';
import { IoAddCircleOutline } from 'react-icons/io5';
import { cn } from "@/lib/utils";

interface CustomControlsProps {
  onAddNode?: () => void;
  onBoardAction?: () => void;
}

const CustomControls: React.FC<CustomControlsProps> = ({ 
  onAddNode, 
  onBoardAction 
}) => {
  const { zoomIn, zoomOut, fitView, setViewport } = useReactFlow();

  const handleZoomIn = () => zoomIn();
  const handleZoomOut = () => zoomOut();
  const handleFitView = () => fitView();
  const handleLock = () => setViewport({ x: 0, y: 0, zoom: 1 });

  const baseButtonClass = cn(
    "flex items-center justify-center transition-all duration-200",
    "bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700",
    "border border-gray-200 dark:border-gray-600",
    "text-gray-700 dark:text-gray-200",
    "group" // Added for hover effects
  );

  const controlButtonClass = cn(
    baseButtonClass,
    "w-14 h-14 rounded-md"
  );

  const wideButtonClass = cn(
    baseButtonClass,
    "gap-2 px-4 py-2 rounded-md min-w-[120px]"
  );

  const containerClass = cn(
    "bg-white dark:bg-gray-800",
    "border border-gray-200 dark:border-gray-700",
    "shadow-lg dark:shadow-gray-900/30",
    "rounded-lg"
  );

  const mobileButtonClass = cn(
    baseButtonClass,
    "w-10 h-10 rounded-md"
  );

  // Icon base classes
  const iconClass = "transition-colors duration-200 text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white";
  const largeIconClass = cn(iconClass, "w-8 h-8"); // Increased size for desktop
  const smallIconClass = cn(iconClass, "w-6 h-6"); // Increased size for mobile
  const actionIconClass = cn(iconClass, "w-6 h-6"); // Size for action buttons

  return (
    <>
      {/* Main Controls - Bottom Center on Desktop */}
      <Panel position="bottom-center" className="hidden sm:block">
        <div className={cn(
          containerClass,
          "flex flex-row items-center gap-3 justify-center py-3 min-w-[450px]"
        )}>
          <ControlButton 
            onClick={handleZoomIn}
            className={controlButtonClass}
            title="Zoom In"
          >
            <BiZoomIn className={largeIconClass} />
          </ControlButton>

          <ControlButton 
            onClick={handleZoomOut}
            className={controlButtonClass}
            title="Zoom Out"
          >
            <BiZoomOut className={largeIconClass} />
          </ControlButton>

          <ControlButton 
            onClick={handleFitView}
            className={controlButtonClass}
            title="Fit View"
          >
            <RxEnterFullScreen className={largeIconClass} />
          </ControlButton>

          <ControlButton 
            onClick={onBoardAction}
            className={wideButtonClass}
            title="On the Board"
          >
            <GoTriangleUp className={actionIconClass} />
            <span className="text-sm font-medium whitespace-nowrap">On the Board</span>
          </ControlButton>

          <ControlButton 
            onClick={onAddNode}
            className={wideButtonClass}
            title="Quick Add"
          >
            <IoAddCircleOutline className={actionIconClass} />
            <span className="text-sm font-medium whitespace-nowrap">Quick Add</span>
          </ControlButton>
        </div>
      </Panel>

      {/* Mobile Controls - Bottom Right */}
      <Panel position="bottom-right" className="sm:hidden">
        <div className={cn(
          containerClass,
          "flex gap-2 p-2"
        )}>
          <div className="flex flex-row gap-2">
            <ControlButton 
              onClick={handleZoomIn}
              className={mobileButtonClass}
              title="Zoom In"
            >
              <BiZoomIn className={smallIconClass} />
            </ControlButton>

            <ControlButton 
              onClick={handleZoomOut}
              className={mobileButtonClass}
              title="Zoom Out"
            >
              <BiZoomOut className={smallIconClass} />
            </ControlButton>
          </div>

          <div className="flex flex-row gap-2">
            <ControlButton 
              onClick={handleFitView}
              className={mobileButtonClass}
              title="Fit View"
            >
              <RxEnterFullScreen className={smallIconClass} />
            </ControlButton>
          </div>

          <div className="flex flex-row gap-2">
            <ControlButton 
              onClick={onBoardAction}
              className={mobileButtonClass}
              title="On the Board"
            >
              <GoTriangleUp className={smallIconClass} />
            </ControlButton>

            <ControlButton 
              onClick={onAddNode}
              className={mobileButtonClass}
              title="Quick Add"
            >
              <IoAddCircleOutline className={smallIconClass} />
            </ControlButton>
          </div>
        </div>
      </Panel>
    </>
  );
};

export default CustomControls;