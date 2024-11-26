"use client";
import React from 'react';
import StrategyNavbar from './_components/StrategyNavbar';
import DashboardSidebar from './_components/DashboardSidebar';
import StrategyCanvas from './_components/StrategyCanvas';
import SettingSheet from './_components/StrategyNavbar/SettingSheet/SettingSheet';
import { useSheetStore } from '@/lib/store/SheetStore';

export default function StrategyBuilder() {
  const { isOpen } = useSheetStore();

  return (
    // Use h-[calc(100vh-64px)] to account for main navbar height
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      {/* Strategy Navbar */}
      <div 
        className={`
          transition-all duration-300 ease-in-out
          ${isOpen ? 'w-[calc(100%-400px)]' : 'w-full'}
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
              ${isOpen ? 'w-[calc(100%-400px)]' : 'w-full'}
            `}
          >
            <StrategyCanvas />
          </div>

          {/* Settings Sheet */}
          {isOpen && (
            <div className="absolute top-0 right-0 bottom-0 w-[400px] z-50">
              <SettingSheet />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}