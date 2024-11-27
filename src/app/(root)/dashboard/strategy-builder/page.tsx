"use client";
import React from 'react';
import StrategyNavbar from './_components/StrategyNavbar';
import DashboardSidebar from './_components/DashboardSidebar';
import StrategyCanvas from './_components/StrategyCanvas';
import SettingSheet from './_components/StrategyNavbar/SettingSheet/SettingSheet';
import { useSheetStore } from '@/lib/store/SheetStore';
import CustomSheet from '@/components/shared/custom-sheet';
import NodeSheet from './_components/StrategyNavbar/NodeSheet';

export default function StrategyBuilder() {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      {/* Strategy Navbar */}
      <div
        className={`
          transition-all duration-300 ease-in-out
        `}
      >
        <StrategyNavbar />
      </div>

      {/* Flex container for sidebar and canvas */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Fixed width dashboard sidebar */}
        <DashboardSidebar />

        {/* Flexible width canvas container */}
        <div className="flex-1 relative">
          {/* Canvas with dynamic width */}
          <div
            className={`
              w-full h-full
              transition-all duration-300 ease-in-out
            `}
          >
            <StrategyCanvas />
          </div>

          {/* Sheet */}
          <CustomSheet />
          <NodeSheet/>
        </div>
      </div>
    </div>
  );
}