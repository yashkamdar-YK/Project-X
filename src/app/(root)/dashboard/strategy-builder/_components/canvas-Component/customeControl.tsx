import React from 'react';
import { Panel, useReactFlow, ControlButton } from '@xyflow/react';
import { 
  BiZoomIn, 
  BiZoomOut 
} from 'react-icons/bi';
import { RxEnterFullScreen } from 'react-icons/rx';
import { IoHandRightOutline } from 'react-icons/io5';
import { GoTriangleUp } from 'react-icons/go';
import { IoAddCircleOutline } from 'react-icons/io5';

interface CustomControlsProps {
  onAddNode?: () => void;
  onBoardAction?: () => void;
}

const CustomControls: React.FC<CustomControlsProps> = ({ 
  onAddNode, 
  onBoardAction 
}) => {
  const { zoomIn, zoomOut, fitView, setViewport } = useReactFlow();

  const handleZoomIn = () => {
    zoomIn();
  };

  const handleZoomOut = () => {
    zoomOut();
  };

  const handleFitView = () => {
    fitView();
  };

  const handleLock = () => {
    setViewport({ x: 0, y: 0, zoom: 1 });
  };

  return (
    <>
      {/* Main Controls - Bottom Center on Desktop, Hidden on Mobile */}
      <Panel position="bottom-center" className="hidden sm:block">
        <div className="flex flex-row items-center gap-3 justify-center py-3 bg-white dark:border-gray-900 rounded-lg shadow-md min-w-[450px]">
          <ControlButton 
            onClick={handleZoomIn}
            className="flex items-center justify-center w-14 h-14 hover:bg-gray-100 rounded-md transition-colors border-2 border-black"
            title="Zoom In"
          >
            <BiZoomIn className="w-8 h-8" />
          </ControlButton>

          <ControlButton 
            onClick={handleZoomOut}
            className="flex items-center justify-center w-14 h-14 hover:bg-gray-100 rounded-md transition-colors border-2 border-black"
            title="Zoom Out"
          >
            <BiZoomOut className="w-8 h-8" />
          </ControlButton>

          <ControlButton 
            onClick={handleFitView}
            className="flex items-center justify-center w-14 h-14 hover:bg-gray-100 rounded-md transition-colors border-2 border-black"
            title="Fit View"
          >
            <RxEnterFullScreen className="w-8 h-8" />
          </ControlButton>

          <ControlButton 
            onClick={handleLock}
            className="flex items-center justify-center w-14 h-14 hover:bg-gray-100 rounded-md transition-colors border-2 border-black"
            title="Lock"
          >
            <IoHandRightOutline className="w-8 h-8" />
          </ControlButton>

          <ControlButton 
            onClick={onBoardAction}
            className="flex items-center justify-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-md transition-colors min-w-[140px] border-2 border-black"
            title="On the Board"
          >
            <GoTriangleUp className="w-6 h-6" />
            <span className="text-sm font-medium whitespace-nowrap">On the Board</span>
          </ControlButton>

          <ControlButton 
            onClick={onAddNode}
            className="flex items-center justify-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-md transition-colors min-w-[120px] border-2 border-black"
            title="Quick Add"
          >
            <IoAddCircleOutline className="w-6 h-6" />
            <span className="text-sm font-medium whitespace-nowrap">Quick Add</span>
          </ControlButton>
        </div>
      </Panel>

      {/* Mobile Controls - Bottom Right */}
      <Panel position="bottom-right" className="sm:hidden">
        <div className="flex gap-2 p-2 bg-white dark:border-gray-900 rounded-lg shadow-md">
          {/* Mobile Standard Controls */}
          <div className="flex flex-row gap-2">
            <ControlButton 
              onClick={handleZoomIn}
              className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-md transition-colors border-2 border-black"
              title="Zoom In"
            >
              <BiZoomIn className="w-6 h-6" />
            </ControlButton>

            <ControlButton 
              onClick={handleZoomOut}
              className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-md transition-colors border-2 border-black"
              title="Zoom Out"
            >
              <BiZoomOut className="w-6 h-6" />
            </ControlButton>
          </div>

          <div className="flex flex-row gap-2">
            <ControlButton 
              onClick={handleFitView}
              className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-md transition-colors border-2 border-black"
              title="Fit View"
            >
              <RxEnterFullScreen className="w-6 h-6" />
            </ControlButton>

            <ControlButton 
              onClick={handleLock}
              className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-md transition-colors border-2 border-black"
              title="Lock"
            >
              <IoHandRightOutline className="w-6 h-6" />
            </ControlButton>
          </div>

          {/* Mobile Custom Controls - Icon Only */}
          <div className="flex flex-row gap-2">
            <ControlButton 
              onClick={onBoardAction}
              className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-md transition-colors border-2 border-black"
              title="On the Board"
            >
              <GoTriangleUp className="w-6 h-6" />
            </ControlButton>

            <ControlButton 
              onClick={onAddNode}
              className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-md transition-colors border-2 border-black"
              title="Quick Add"
            >
              <IoAddCircleOutline className="w-6 h-6" />
            </ControlButton>
          </div>
        </div>
      </Panel>
    </>
  );
};

export default CustomControls;