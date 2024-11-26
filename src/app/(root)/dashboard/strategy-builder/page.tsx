"use client";
import React from 'react';
import StrategyNavbar from './_components/StrategyNavbar';
import DashboardSidebar from './_components/DashboardSidebar';
import StrategyCanvas from './_components/StrategyCanvas';
import SettingSheet from './_components/StrategyNavbar/SettingSheet/SettingSheet';
import { useSheetStore } from '@/lib/store/SheetStore'

export default function StrategyBuilder() {
  const { isOpen } = useSheetStore();

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex flex-col">
        {/* Navbar with dynamic width */}
        <div 
          className={`
            transition-all 
            duration-300 
            ease-in-out
            ${isOpen ? 'w-[calc(100%-400px)]' : 'w-full'}
          `}
        >
          <StrategyNavbar />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Canvas with dynamic width and positioning */}
        <div 
          className={`
            flex-1 
            transition-all 
            duration-300 
            ease-in-out
            relative
            ${isOpen ? 'w-[calc(100%-400px)] right-0' : 'w-full'}
          `}
        >
          <StrategyCanvas />
        </div>
      </div>

      {/* Settings Sheet */}
      <SettingSheet />
    </div>
  );
}